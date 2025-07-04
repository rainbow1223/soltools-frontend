import React, { useState, useEffect } from "react";
import axios from "axios";

const HolderIncrease = () => {
  const [masterWallet, setMasterWallet] = useState("");
  const [baseTokenAddress, setBaseTokenAddress] = useState("");
  const [childWallets, setChildWallets] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Log state changes
  useEffect(() => {
    console.log("State updated:", {
      baseTokenAddress,
      childWallets,
      minAmount,
      maxAmount,
      isBotRunning
    });
  }, [baseTokenAddress, childWallets, minAmount, maxAmount, isBotRunning]);

  const validateInputs = () => {
    console.log("Validating form inputs...");
    
    if (!masterWallet) {
      console.log("Validation error: Master wallet key is required");
      return false;
    }
    
    if (!baseTokenAddress) {
      console.log("Validation error: Base token address is required");
      return false;
    }
    
    if (!childWallets) {
      console.log("Validation error: Number of child wallets is required");
      return false;
    }
    
    if (!minAmount || !maxAmount) {
      console.log("Validation error: Min and Max amounts are required");
      return false;
    }
    
    console.log("All inputs valid");
    return true;
  };

  const onHandleStartBot = async () => {
    console.log("Start button clicked");
    
    if (!validateInputs()) {
      setStatusMessage("Please fill all required fields");
      return;
    }
    
    try {
      const payload = {
        masterWallet,
        baseTokenAddress,
        childWallets,
        minAmount,
        maxAmount,
        action: "start",
      };
      
      console.log("Sending start request with payload:", {
        ...payload,
        masterWallet: "***PRIVATE KEY HIDDEN***" // Don't log the actual private key
      });
      
      setStatusMessage("Starting holder increase bot...");
      const response = await axios.post("http://170.130.165.249:3001/holderbot", payload);
      
      console.log("Start bot response:", response.data);

      if (response.data.success) {
        setIsBotRunning(true);
        setStatusMessage("Holder increase bot started successfully!");
      } else {
        console.error("Failed to start bot:", response.data.message);
        setStatusMessage(`Failed to start bot: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error starting holder increase bot:", error);
      console.error("Error details:", {
        message: error.message,
        responseData: error.response?.data
      });
      setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const onHandleStopBot = async () => {
    console.log("Refund button clicked");
    
    try {
      // Include the same payload structure as start, but with "stop" action
      const payload = {
        masterWallet,
        baseTokenAddress,
        childWallets,
        minAmount,
        maxAmount,
        action: "stop",
      };

      console.log("Sending refund request with payload:", {
        ...payload,
        masterWallet: "***PRIVATE KEY HIDDEN***" // Don't log the actual private key
      });
      
      setStatusMessage("Processing refund...");
      const response = await axios.post("http://170.130.165.249:3001/holderbot", payload);
      
      console.log("Refund response:", response.data);

      if (response.data.success) {
        setIsBotRunning(false);
        setStatusMessage("Refund processed successfully!");
      } else {
        console.error("Failed to process refund:", response.data.message);
        setStatusMessage(`Failed to process refund: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      console.error("Error details:", {
        message: error.message,
        responseData: error.response?.data
      });
      setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };


  return (
    <div className="p-6 h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide">
      <h2 className="text-2xl font-bold mb-4">Holder Increase</h2>

      {/* Inputs */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Master Wallet Private Key:</label>
        <input
          type="password"
          className="w-full border rounded p-2"
          value={masterWallet}
          onChange={(e) => setMasterWallet(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Base Token Address:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={baseTokenAddress}
          onChange={(e) => setBaseTokenAddress(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Number of Child Wallets:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={childWallets}
          onChange={(e) => setChildWallets(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-2">Buy Amount in Sol (should be less 0.03 SOL than Distribute Amount ):</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-2">Distribute Amount:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={onHandleStartBot}
          disabled={isBotRunning}
          className={`px-4 py-2 rounded ${isBotRunning ? "bg-gray-400" : "bg-blue-500 text-white"}`}
        >
          Increase Holders
        </button>
        <button
          onClick={onHandleStopBot}
          disabled={!isBotRunning}
          className={`px-4 py-2 rounded ${!isBotRunning ? "bg-gray-400" : "bg-red-500 text-white"}`}
        >
          Decrease Holders and Refund
        </button>
      </div>
      {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
    </div>
  );
};

export default HolderIncrease;