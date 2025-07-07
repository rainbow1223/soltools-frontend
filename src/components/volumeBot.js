import React, { useState, useEffect } from "react";
import axios from "axios";

const VolumeBot = () => {
  const [volumeMasterWallet, setVolumeMasterWallet] = useState("");
  const [targetVolumeAddr, setTargetVolumeAddr] = useState("");
  const [volumeChildWallets, setVolumeChildWallets] = useState("");
  const [distributeAmo, setDistributeAmo] = useState("");
  const [volumeMin, setVolumeMin] = useState("");
  const [volumeMax, setVolumeMax] = useState("");
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("plan1"); // Default to Plan 1

// Log state changes
useEffect(() => {
  console.log("State updated:", {
    targetVolumeAddr,
    volumeChildWallets: volumeChildWallets,
    distributeAmo,
    volumeMin,
    volumeMax,
    selectedPlan,
    isBotRunning
  });
}, [targetVolumeAddr, volumeChildWallets, distributeAmo, 
    volumeMin, volumeMax, selectedPlan, isBotRunning]);

const validateInputs = () => {
  console.log("Validating form inputs...");
  
  if (!volumeMasterWallet) {
    console.log("Validation error: Master wallet key is required");
    return false;
  }
  
  if (!targetVolumeAddr) {
    console.log("Validation error: Base token address is required");
    return false;
  }
  
  // Add more validation as needed
  
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
      volumeMasterWallet,
      targetVolumeAddr,
      volumeChildWallets,
      distributeAmo,
      volumeMin,
      volumeMax,
      selectedPlan,
      action: "start",
    };
    
    console.log("Sending start request with payload:", {
      ...payload,
      volumeMasterWallet: "***PRIVATE KEY HIDDEN***" // Don't log the actual private key
    });
    
    setStatusMessage("Starting volume bot...");
    const response = await axios.post("http://45.61.169.114:3001/volumebot", payload);
    
    console.log("Start bot response:", response.data);

    if (response.data.success) {
      setIsBotRunning(true);
      setStatusMessage("Volume bot started successfully!");
    } else {
      console.error("Failed to start bot:", response.data.message);
      setStatusMessage(`Failed to start bot: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error starting volume bot:", error);
    console.error("Error details:", {
      message: error.message,
      responseData: error.response?.data
    });
    setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
  }
};

const onHandleStopBot = async () => {
  console.log("Stop button clicked");
  
  try {
    console.log("Sending stop request");
    setStatusMessage("Stopping volume bot...");
    const response = await axios.post("http://45.61.169.114:3001/volumebot", {
      action: "stop",
    });
    
    console.log("Stop bot response:", response.data);

    if (response.data.success) {
      setIsBotRunning(false);
      setStatusMessage("Volume bot stopped successfully!");
    } else {
      console.error("Failed to stop bot:", response.data.message);
      setStatusMessage(`Failed to stop bot: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error stopping volume bot:", error);
    console.error("Error details:", {
      message: error.message,
      responseData: error.response?.data
    });
    setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
  }
};
  return (
    <div className="p-6 h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide">
      <h2 className="text-2xl font-bold mb-4">Market Maker</h2>

      {/* Plan Selection */}
      

      {/* Other Inputs */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Master Wallet Private Key:</label>
        <input
          type="password"
          className="w-full border rounded p-2"
          value={volumeMasterWallet}
          onChange={(e) => setVolumeMasterWallet(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Base Token Address:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={targetVolumeAddr}
          onChange={(e) => setTargetVolumeAddr(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Number of Child Wallets:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={volumeChildWallets}
          onChange={(e) => setVolumeChildWallets(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Distribute Amount:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={distributeAmo}
          onChange={(e) => setDistributeAmo(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-2">Min:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={volumeMin}
            onChange={(e) => setVolumeMin(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-2">Max:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={volumeMax}
            onChange={(e) => setVolumeMax(e.target.value)}
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
          Start Bot
        </button>
        <button
          onClick={onHandleStopBot}
          disabled={!isBotRunning}
          className={`px-4 py-2 rounded ${!isBotRunning ? "bg-gray-400" : "bg-red-500 text-white"}`}
        >
          Stop Bot
        </button>
      </div>
      {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
    </div>
  );
};

export default VolumeBot;
