import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TwitterModule.css";

// Twitter API configurations
const TWITTER_API_BASE_URL = "https://api.twitter.com/2";
const TWITTER_ACCOUNTS = [
  { id: "44196397", handle: "elonmusk", name: "Elon Musk" },
  { id: "69972349", handle: "MrBeast", name: "MrBeast" },
  { id: "1452103059314638851", handle: "pumpdotfun", name: "Pump.fun" }
];

export default function TwitterModule({ apiUrl, onPostsUpdated }) {
  const [lastFetch, setLastFetch] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState(null);

  // Function to fetch tweets from Twitter API and save to database via backend
  const fetchAndProcessTweets = async () => {
    setStatus("Fetching tweets...");

    try {
      // Call the backend API to fetch and process tweets
      const response = await axios.post(`${apiUrl}/fetch-tweets`, {
        accounts: TWITTER_ACCOUNTS
      });

      if (response.data.success) {
        console.log("Tweets fetched and saved successfully");
        setLastFetch(new Date());
        setStatus("Idle");

        // If new posts were added, notify the parent component
        if (response.data.newPosts && response.data.newPosts.length > 0) {
          console.log(`${response.data.newPosts.length} new posts added`);
          onPostsUpdated();
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch tweets");
      }
    } catch (err) {
      console.error("Error in fetchAndProcessTweets:", err);
      setError(`Error fetching tweets: ${err.message}`);
      setStatus("Error");
    }
  };

  // Set up hourly fetching of tweets
  useEffect(() => {
    // Fetch tweets immediately on component mount
    fetchAndProcessTweets();

    // Set up hourly interval
    const interval = setInterval(fetchAndProcessTweets, 60 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [apiUrl]);
}
