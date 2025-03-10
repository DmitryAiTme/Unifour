const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();

// CORS setup
app.use(cors({
  origin: ['https://unifour.io', 'http://unifour.io', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL Database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
};

testConnection();

// Base path for all routes
const BASE_PATH = '/backend';

// Health check endpoint
app.get(`${BASE_PATH}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes with base path /backend for posts2
app.get(`${BASE_PATH}/api/posts2`, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM posts2 ORDER BY created_at ASC LIMIT 5'
    );
    res.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.post(`${BASE_PATH}/api/posts2`, async (req, res) => {
  const {
    name,
    username,
    description,
    media,
    q_name,
    q_username,
    q_description,
    q_media
  } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO posts2 (
        name,
        username,
        description,
        media,
        q_name,
        q_username,
        q_description,
        q_media
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, username, description, media, q_name, q_username, q_description, q_media]
    );

    const [newPost] = await pool.query(
      'SELECT * FROM posts2 WHERE id = ?',
      [result.insertId]
    );

    res.json(newPost[0]);
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// =====================================================
// TWITTER HANDLER FUNCTIONALITY
// =====================================================

// Twitter API Bearer Token
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Add these functions to your server.js

// Rate limit tracking
const rateLimitStore = {
  // Store rate limit info by endpoint
  endpoints: {},

  // Update rate limit info from response headers
  updateFromHeaders(endpoint, headers) {
    if (!this.endpoints[endpoint]) {
      this.endpoints[endpoint] = {};
    }

    const info = this.endpoints[endpoint];
    info.limit = parseInt(headers['x-rate-limit-limit'] || info.limit || 0);
    info.remaining = parseInt(headers['x-rate-limit-remaining'] || info.remaining || 0);
    info.reset = parseInt(headers['x-rate-limit-reset'] || info.reset || 0);
    info.lastUpdated = Date.now();

    return info;
  },

  // Check if we're rate limited for an endpoint
  isRateLimited(endpoint) {
    const info = this.endpoints[endpoint];
    if (!info) return false;

    // If we have remaining requests, we're not rate limited
    if (info.remaining > 0) return false;

    // If reset time has passed, assume we're not rate limited anymore
    const now = Math.floor(Date.now() / 1000);
    if (info.reset && now > info.reset) return false;

    // We're rate limited
    return true;
  },

  // Get wait time until rate limit reset
  getWaitTimeMs(endpoint) {
    const info = this.endpoints[endpoint];
    if (!info || !info.reset) return 0;

    const now = Math.floor(Date.now() / 1000);
    const waitSeconds = Math.max(0, info.reset - now);
    return waitSeconds * 1000 + 1000; // Add 1 second buffer
  }
};

// Enhanced fetchTweets with rate limit handling
const fetchTweets = async (account) => {
  const endpoint = `users/${account.id}/tweets`;

  // Check if we're rate limited
  if (rateLimitStore.isRateLimited(endpoint)) {
    const waitTime = rateLimitStore.getWaitTimeMs(endpoint);
    console.log(`Rate limited for ${account.handle}. Waiting ${waitTime/1000} seconds until reset.`);
    // Option: wait and retry, or queue for later processing
    return { rateLimited: true, waitTime };
  }

  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${account.id}/tweets`,
      {
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`
        },
        params: {
          max_results: 5,
          "tweet.fields": "created_at,referenced_tweets,attachments",
          "media.fields": "url,preview_image_url",
          "user.fields": "name,username",
          expansions: "attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id"
        }
      }
    );

    // Update rate limit info from response headers
    rateLimitStore.updateFromHeaders(endpoint, response.headers);

    return response.data;
  } catch (err) {
    if (err.response) {
      // Update rate limit info from error response headers
      if (err.response.headers) {
        rateLimitStore.updateFromHeaders(endpoint, err.response.headers);
      }

      if (err.response.status === 429) {
        const resetTime = err.response.headers['x-rate-limit-reset'];
        const now = Math.floor(Date.now() / 1000);
        const waitSeconds = Math.max(0, resetTime - now);
        console.log(`Rate limited for ${account.handle}. Reset in ${waitSeconds} seconds.`);
        return { rateLimited: true, waitTime: waitSeconds * 1000 };
      }
    }

    console.error(`Error fetching tweets for ${account.handle}:`, err);
    return null;
  }
};

// Modified Twitter fetch endpoint with rate limit handling and job scheduling
app.post(`${BASE_PATH}/api/fetch-tweets`, async (req, res) => {
  let conn = null;
  const newPosts = [];
  const rateLimitedAccounts = [];

  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Get the accounts to fetch from the request body or use defaults
    const accounts = req.body.accounts || [
      { id: "44196397", handle: "elonmusk", name: "Elon Musk" },
      { id: "69972349", handle: "MrBeast", name: "MrBeast" },
      { id: "1452103059314638851", handle: "pumpdotfun", name: "Pump.fun" }
    ];

    // Process each account
    for (const account of accounts) {
      const tweetData = await fetchTweets(account);

      // Handle rate limiting
      if (tweetData && tweetData.rateLimited) {
        rateLimitedAccounts.push({
          ...account,
          retryAfter: tweetData.waitTime
        });
        continue;
      }

      if (!tweetData || !tweetData.data) {
        console.log(`No tweets found for ${account.handle}`);
        continue;
      }

      // Process tweets (rest of your existing code)
      const mediaData = tweetData.includes?.media || [];
      const includedTweets = tweetData.includes?.tweets || [];

      // Process each tweet
      for (const tweet of tweetData.data) {
        // Check if the tweet already exists in the database
        const exists = await checkPostExists(conn, tweet.id, account.handle);
        if (exists) {
          console.log(`Tweet ${tweet.id} from ${account.handle} already exists in the database`);
          continue;
        }

        // Process the tweet
        const userData = { name: account.name, username: account.handle };
        const post = await processTweet(tweet, userData, mediaData, includedTweets);

        // Insert the post into the database
        const [result] = await conn.execute(
          `INSERT INTO posts2 (name, username, description, media, q_name, q_username, q_description, q_media, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.name,
            post.username,
            post.description,
            post.media,
            post.q_name || null,
            post.q_username || null,
            post.q_description || null,
            post.q_media || null,
            new Date(post.created_at)
          ]
        );

        console.log(`Post saved to database with ID ${result.insertId}`);

        // Add the post ID to the list of new posts
        newPosts.push({ id: result.insertId, ...post });
      }

      console.log(`Processed tweets for ${account.handle}`);
    }

    // Return success response
    res.json({
      success: true,
      message: `Successfully processed ${newPosts.length} new tweets`,
      newPosts,
      rateLimitedAccounts: rateLimitedAccounts.length > 0 ? rateLimitedAccounts : undefined
    });
  } catch (err) {
    console.error("Error in fetchAndProcessTweets:", err);
    res.status(500).json({
      success: false,
      message: `Error processing tweets: ${err.message}`
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

const saveMedia = async (mediaUrl, fileName) => {
  try {
    const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
    const mediaPath = path.join(process.cwd(), 'public', 'posts', fileName);

    // Ensure the directory exists
    const dir = path.dirname(mediaPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(mediaPath, Buffer.from(mediaResponse.data));
    return fileName;
  } catch (err) {
    console.error("Error saving media:", err);
    return null;
  }
};

// Function to check if a post already exists in the database
const checkPostExists = async (conn, tweetId, username) => {
  try {
    const [rows] = await conn.execute(
      "SELECT id FROM posts2 WHERE description LIKE ? AND username = ?",
      [`%[${tweetId}]%`, username]
    );
    return rows.length > 0;
  } catch (err) {
    console.error("Error checking if post exists:", err);
    return false;
  }
};

// Process a tweet to extract necessary data
const processTweet = async (tweet, userData, mediaData, quotedTweets) => {
  // Add tweet ID to description for later reference
  const description = `${tweet.text} [${tweet.id}]`;
  let mediaFileName = null;

  // Handle media if present
  if (tweet.attachments && tweet.attachments.media_keys) {
    const mediaKey = tweet.attachments.media_keys[0];
    const media = mediaData.find(m => m.media_key === mediaKey);

    if (media) {
      const mediaUrl = media.url || media.preview_image_url;
      if (mediaUrl) {
        const fileExtension = path.extname(mediaUrl);
        mediaFileName = `${tweet.id}${fileExtension}`;
        await saveMedia(mediaUrl, mediaFileName);
      }
    }
  }

  // Handle quoted tweet if present
  let quotedTweet = null;
  if (tweet.referenced_tweets) {
    const quotedRef = tweet.referenced_tweets.find(rt => rt.type === "quoted");
    if (quotedRef) {
      quotedTweet = quotedTweets.find(qt => qt.id === quotedRef.id);
    }
  }

  // Prepare the post object
  const post = {
    name: userData.name,
    username: userData.username,
    description: description,
    media: mediaFileName,
    created_at: tweet.created_at
  };

  // Add quoted tweet data if available
  if (quotedTweet) {
    const quotedAuthor = userData; // In a real scenario, this would be the author of the quoted tweet

    post.q_name = quotedAuthor.name;
    post.q_username = quotedAuthor.username;
    post.q_description = `${quotedTweet.text} [${quotedTweet.id}]`;

    // Handle quoted tweet media
    if (quotedTweet.attachments && quotedTweet.attachments.media_keys) {
      const quotedMediaKey = quotedTweet.attachments.media_keys[0];
      const quotedMedia = mediaData.find(m => m.media_key === quotedMediaKey);

      if (quotedMedia) {
        const quotedMediaUrl = quotedMedia.url || quotedMedia.preview_image_url;
        if (quotedMediaUrl) {
          const quotedFileExtension = path.extname(quotedMediaUrl);
          const quotedFileName = `quoted_${quotedTweet.id}${quotedFileExtension}`;
          await saveMedia(quotedMediaUrl, quotedFileName);
          post.q_media = quotedFileName;
        }
      }
    }
  }

  return post;
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at path: ${BASE_PATH}/api/`);
  console.log(`Twitter endpoint: ${BASE_PATH}/api/fetch-tweets`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});

// Add this function for staggered processing
const processAccountsStaggered = async (accounts, conn) => {
  const results = [];
  const DELAY_BETWEEN_ACCOUNTS = 5000; // 5 seconds

  for (let i = 0; i < accounts.length; i++) {
    // Process one account
    const result = await processOneAccount(accounts[i], conn);
    results.push(result);

    // Add delay between accounts (except after the last one)
    if (i < accounts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_ACCOUNTS));
    }
  }

  return results;
};

// Add this somewhere in your code to set up scheduled fetching
const setupScheduledFetching = () => {
  // Run every 15 minutes (adjust as needed)
  const INTERVAL = 15 * 60 * 1000;

  console.log('Setting up scheduled tweet fetching every 15 minutes');

  setInterval(async () => {
    console.log('Running scheduled tweet fetch job at', new Date().toISOString());

    const accounts = [
      { id: "44196397", handle: "elonmusk", name: "Elon Musk" },
      { id: "69972349", handle: "MrBeast", name: "MrBeast" },
      { id: "1452103059314638851", handle: "pumpdotfun", name: "Pump.fun" }
    ];

    try {
      // Fetch each account with proper delays
      let conn = null;
      try {
        conn = await pool.getConnection();
        await processAccountsStaggered(accounts, conn);
      } finally {
        if (conn) conn.release();
      }
    } catch (err) {
      console.error('Error in scheduled tweet fetch:', err);
    }
  }, INTERVAL);
};

// Add this function to your code to fix the error
const processOneAccount = async (account, conn) => {
  console.log(`Processing account: ${account.handle}`);

  try {
    const tweetData = await fetchTweets(account);

    // Handle rate limiting
    if (tweetData && tweetData.rateLimited) {
      console.log(`Rate limited for ${account.handle}. Will retry later.`);
      return {
        account: account.handle,
        status: 'rate_limited',
        waitTime: tweetData.waitTime
      };
    }

    if (!tweetData || !tweetData.data || tweetData.data.length === 0) {
      console.log(`No tweets found for ${account.handle}`);
      return {
        account: account.handle,
        status: 'no_tweets',
        newPosts: []
      };
    }

    // Extract media and included tweets
    const mediaData = tweetData.includes?.media || [];
    const includedTweets = tweetData.includes?.tweets || [];
    const newPosts = [];

    // Process each tweet
    for (const tweet of tweetData.data) {
      // Check if the tweet already exists in the database
      const exists = await checkPostExists(conn, tweet.id, account.handle);
      if (exists) {
        console.log(`Tweet ${tweet.id} from ${account.handle} already exists in the database`);
        continue;
      }

      // Process the tweet
      const userData = { name: account.name, username: account.handle };
      const post = await processTweet(tweet, userData, mediaData, includedTweets);

      // Insert the post into the database
      const [result] = await conn.execute(
        `INSERT INTO posts2 (name, username, description, media, q_name, q_username, q_description, q_media, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.name,
          post.username,
          post.description,
          post.media,
          post.q_name || null,
          post.q_username || null,
          post.q_description || null,
          post.q_media || null,
          new Date(post.created_at)
        ]
      );

      console.log(`Post saved to database with ID ${result.insertId}`);

      // Add the post ID to the list of new posts
      newPosts.push({ id: result.insertId, ...post });
    }

    return {
      account: account.handle,
      status: 'success',
      newPosts: newPosts,
      count: newPosts.length
    };
  } catch (err) {
    console.error(`Error processing account ${account.handle}:`, err);
    return {
      account: account.handle,
      status: 'error',
      error: err.message
    };
  }
};

// Call this during server startup
setupScheduledFetching();
