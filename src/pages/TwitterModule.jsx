import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TwitterModule.css";

// Twitter API configurations
const TWITTER_ACCOUNTS = [
  { id: "44196397", handle: "elonmusk", name: "Elon Musk" },
  { id: "2455740283", handle: "MrBeast", name: "MrBeast" },
  { id: "1622243071806128131", handle: "pumpdotfun", name: "pump.fun" }
];

export default function TwitterModule({ apiUrl, onPostsUpdated }) {
  const [lastFetch, setLastFetch] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState(null);
  const [fetchLog, setFetchLog] = useState([]);

  // Function to determine which account to fetch based on the time of day
  const getAccountByTimeOfDay = () => {
    const hour = new Date().getHours();

    // 00:00-07:59: pump.fun
    if (hour >= 0 && hour < 8) {
      return TWITTER_ACCOUNTS[2]; // pump.fun
    }
    // 08:00-15:59: Elon Musk
    else if (hour >= 8 && hour < 16) {
      return TWITTER_ACCOUNTS[0]; // Elon Musk
    }
    // 16:00-23:59: MrBeast
    else {
      return TWITTER_ACCOUNTS[1]; // MrBeast
    }
  };

  // Function to fetch tweets from Twitter API and save to database via backend
  const fetchAndProcessTweets = async () => {
    const currentAccount = getAccountByTimeOfDay();
    setStatus(`Fetching tweets from ${currentAccount.handle}...`);

    try {
      // Call the backend API to fetch and process tweets
      const response = await axios.post(`${apiUrl}/fetch-tweets`, {
        accounts: [currentAccount]
      });

      if (response.data.success) {
        const timestamp = new Date().toISOString();
        setLastFetch(new Date());
        setStatus("Idle");

        // Update fetch log
        setFetchLog(prevLog => [...prevLog, {
          timestamp,
          account: currentAccount.handle,
          success: true,
          newPosts: response.data.newPosts?.length || 0
        }]);

        // If new posts were added, notify the parent component
        if (response.data.newPosts && response.data.newPosts.length > 0) {
          onPostsUpdated();
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch tweets");
      }
    } catch (err) {
      setError(`Error fetching tweets: ${err.message}`);
      setStatus("Error");

      // Update fetch log with error
      setFetchLog(prevLog => [...prevLog, {
        timestamp: new Date().toISOString(),
        account: getAccountByTimeOfDay().handle,
        success: false,
        error: err.message
      }]);
    }
  };

  // Check if it's time to fetch (exactly at 8:00, 16:00, or 0:00)
  const shouldFetchNow = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Only fetch exactly at the hour (when minutes are 0)
    if ((currentHour % 2) === 0 && (currentMinute % 30) === 0) {
      return true;
    } else if ((currentHour % 2) === 0 && ((currentMinute - 10) % 30) === 0) {
      return true;
    } else if ((currentHour % 2) === 0 && ((currentMinute - 20) % 30) === 0) {
      return true;
    } else {
      return false;
    }
  };

  // Set up minute check for tweets instead of hourly
  useEffect(() => {
    // Initial check immediately when component mounts
    if (shouldFetchNow()) {
      fetchAndProcessTweets();
    } else {
      setStatus("Waiting for scheduled time");
    }

    // Check every minute instead of every hour
    const interval = setInterval(() => {
      if (shouldFetchNow()) {
        fetchAndProcessTweets();
      } else {
        const now = new Date();
        setStatus("Waiting for scheduled time");
      }
    }, 60 * 1000); // Check every minute

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [apiUrl]);
}
