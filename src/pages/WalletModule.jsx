import React, { useImperativeHandle } from "react";

export default function WalletModule({ ref, saveKey }) {
  async function walletConnection() {
    try {
      if ("solana" in window) {
        const provider = window.solana;
        if (!provider.isPhantom) {
          throw new Error("Incorrect provider");
        }
        await provider.connect();
        const pk = provider.publicKey;
        saveKey(pk);
        if (pk) {
          alert(`Successfully connected: ${pk.toString()}`);
          console.log(pk);
        } else {
          throw new Error("Unable to receive public key");
        }
      } else {
        alert(
          "Phantom Wallet is not detected. Install it: https://phantom.app/"
        );
      }
    } catch (error) {
      console.error("Connection error:", error);
      if (error.message.includes("User rejected")) {
        alert("You rejected wallect connection");
      } else {
        alert("Error encountered: " + error.message);
      }
    }
  }

  useImperativeHandle(ref, () => ({
    connectWallet() {
      walletConnection();
    }
  }));
}
