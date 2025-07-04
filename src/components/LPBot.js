import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const LPBot = () => {
  const [searchParams] = useSearchParams();
  const baseTokenAddress = searchParams.get("baseTokenAddress") || "";
  const [value, setValue] = useState(2);
  const [address, setAddress] = useState(baseTokenAddress);
  const [profit, setProfit] = useState("");
  const [loss, setLoss] = useState("0");
  const [baseTokenAmo, setBaseTokenAmo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lpSolAmount, setLpSolAmount] = useState("");

  const [volumeMasterWallet, setVolumeMasterWallet] = useState("");
  const [targetVolumeAddr, setTargetVolumeAddr] = useState('');
  const [volumeChildWallets, setVolumeChildWallets] = useState("");
  const [distributeAmo, setDistributeAmo] = useState('');
  const [volumeMin, setVolumeMin] = useState("");
  const [volumeMax, setVolumeMax] = useState("");
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const onHandleStartBot = async () => {
    try {
      setStatusMessage("Starting volume bot...");
      
      const response = await axios.post("http://170.130.165.249:3001/volumebot", {
        volumeMasterWallet,
        targetVolumeAddr,
        volumeChildWallets,
        distributeAmo,
        volumeMin,
        volumeMax,
        action: 'start'
      });
      
      if (response.data.success) {
        setIsBotRunning(true);
        setStatusMessage("Volume bot started successfully!");
      } else {
        setStatusMessage(`Failed to start bot: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error starting volume bot:", error);
      setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Add stop bot handler
  const onHandleStopBot = async () => {
    try {
      setStatusMessage("Stopping volume bot...");
      
      const response = await axios.post("http://170.130.165.249:3001/volumebot", {
        action: 'stop'
      });
      
      if (response.data.success) {
        setIsBotRunning(false);
        setStatusMessage("Volume bot stopped successfully!");
      } else {
        setStatusMessage(`Failed to stop bot: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error stopping volume bot:", error);
      setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!address || !lpSolAmount) {
      alert("Base Token address, Liquidity SOL amount are required!");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        "http://170.130.165.249:3001/lpbots/",
        {
          address,
          lpSolAmount,
          profit,
          loss,
          baseTokenAmo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(`LP auto removed successfully!`);
    } catch (error) {
      // Improved error handling
      console.error("Error creating token:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setAddress("");
      setProfit("");
      setLoss("0");
      setLpSolAmount("");
      setBaseTokenAmo("");
    }
  };

  const handleManualWithdraw = async () => {
    try {
      const response = await axios.post(
        "http://170.130.165.249:3001/lp-remove-manual",
        {
          result: "true", // Sending true boolean value
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Manual withdraw successful! ${response.data.message}`);
    } catch (error) {
      console.error("Error during manual withdraw:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const onHandleBuyToken = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://170.130.165.249:3001/buyToken/",
        {
          address,
          volumeMin,
          volumeMax,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      // Improved error handling
      console.error("Error creating token:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setAddress("");
      setProfit("");
      setLoss("0");
      setLpSolAmount("");
      setBaseTokenAmo("");
    }
  };

  

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide"
    >
      <div className="mx-[7%] flex w-full h-full flex-col">
        <div className="h-[90px] w-full border-b-2 border-solid border-[#EBEBEB] justify-end items-start flex flex-col mt-4">
          <p className="text-2xl font-medium mb-2">Create Liquidity Pool</p>
          <p className="text-sm font-medium text-black/50 mb-3">
            Easily create liquidity pools for any Solana token. Your tokens will
            be tradable on Raydium.
          </p>
        </div>
        <div className="w-full flex flex-col mt-12">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[48%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Base Token:
              </p>
              <input
                className="bg-[#fff] focus:border-[#8b5cf6] transition-all border border-solid outline-none border-[#3a3c4b] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                placeholder="Please enter the base token address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <p className="text-[22px] font-semibold mb-5 mt-10">PnL</p>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[48%] flex flex-col">
              <p className="text-lg font-medium mb-2">
                <span className="text-[#ff0000] mr-2">*</span>Profit:
              </p>
              <div className="flex flex-row justify-between items-center relative">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="Exp. 0.15"
                  type="text"
                  required
                  value={profit}
                  onChange={(e) => setProfit(e.target.value)}
                />
                <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                  SOL
                </div>
              </div>
            </div>
            <div className="w-[48%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Loss
              </p>
              <div className="flex flex-row justify-between items-center relative">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="Exp. 0.1"
                  type="text"
                  value={loss}
                  onChange={(e) => setLoss(e.target.value)}
                />
                <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                  SOL
                </div>
              </div>
            </div>
          </div>
          <p className="text-[22px] font-semibold my-5">Add Liquidity</p>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[48%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Base Token Amount:
              </p>
              <div className="flex flex-row justify-between items-center relative">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="Exp. 70"
                  type="text"
                  value={baseTokenAmo}
                  onChange={(e) => setBaseTokenAmo(e.target.value)}
                />
                <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                  %
                </div>
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
            <div className="w-[48%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>SOL Amount
              </p>
              <div className="flex flex-row justify-between items-center">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="SOL Amount!"
                  type="text"
                  required
                  value={lpSolAmount}
                  onChange={(e) => setLpSolAmount(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
          </div>
          <p className="text-[22px] font-semibold my-5">Intial Buys</p>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[68%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Input Intial buy wallet private key:
              </p>
              <div className="flex flex-row justify-between items-center relative">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="ABCDEFG...."
                  type="password"
                  // value={baseTokenAmo}
                  onChange={(e) => setBaseTokenAmo(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
            <div className="w-[28%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Buy Amount
              </p>
              <div className="flex flex-row justify-between items-center">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="10"
                  type="text"
                  required
                  value={lpSolAmount}
                  onChange={(e) => setLpSolAmount(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[68%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Input Intial buy wallet private key:
              </p>
              <div className="flex flex-row justify-between items-center relative">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="ABCDEFG...."
                  type="password"
                  // value={baseTokenAmo}
                  onChange={(e) => setBaseTokenAmo(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
            <div className="w-[28%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Buy Amount
              </p>
              <div className="flex flex-row justify-between items-center">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="10"
                  type="text"
                  required
                  value={lpSolAmount}
                  onChange={(e) => setLpSolAmount(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[68%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Input Intial buy wallet private key:
              </p>
              <div className="flex flex-row justify-between items-center relative">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="ABCDEFG...."
                  type="password"
                  // value={baseTokenAmo}
                  onChange={(e) => setBaseTokenAmo(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
            <div className="w-[28%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Buy Amount
              </p>
              <div className="flex flex-row justify-between items-center">
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="10"
                  type="text"
                  required
                  value={lpSolAmount}
                  onChange={(e) => setLpSolAmount(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm font-normal" />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col justify-start w-[48%]">
              {/* <p className="text-[22px] font-semibold mt-5 mb-5">
                Set Time Frame
              </p>
              <div className="w-full flex flex-row justify-start items-center mb-12">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-[70%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mr-6"
                />
                <label className="block pt-1 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {value} {value === 1 ? "Second" : "Seconds"}
                </label>
              </div> */}
            </div>
            <button
              onClick={() => {
                handleManualWithdraw();
              }}
              type="button"
              disabled={!isSubmitting}
              className={`${isSubmitting
                ? "hover:bg-violet-500 bg-violet-700"
                : "bg-gray-400 cursor-not-allowed"
                } transition-all mt-8 w-[48%] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer hover:bg-violet-500 bg-violet-700 flex items-center justify-center text-white font-semibold border border-[#a27be0] mb-12`}
            >
              Manual Withdraw
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-violet-500 bg-violet-700"
              } transition-all active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer flex items-center justify-center text-white font-semibold border border-[#a27be0] mb-12`}
          >
            {isSubmitting ? "Please wait...." : "Start"}
          </button>
        </div>

        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-full flex flex-col mb-2">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Import your volume bot master wallet private key:
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all border border-solid outline-none border-[#3a3c4b] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Input your volume bot master wallet private key:"
              type="password"
              value={volumeMasterWallet}
              onChange={(e) => setVolumeMasterWallet(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex flex-row justify-start items-center">
          <div className="w-[48%] flex flex-col mb-2">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Base Token Address:
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all border border-solid outline-none border-[#3a3c4b] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Input your token address"
              type="text"
              value={targetVolumeAddr}
              onChange={(e) => setTargetVolumeAddr(e.target.value)}
            />
          </div>

          <div className="w-[22%] flex flex-col mb-2 ml-4">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Number of Child Wallet:
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all border border-solid outline-none border-[#3a3c4b] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="4"
              type="text"
              value={volumeChildWallets}
              onChange={(e) => setVolumeChildWallets(e.target.value)}
            />
          </div>

          <div className="w-[22%] flex flex-col mb-2 ml-4">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Distrubute Amount:
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all border border-solid outline-none border-[#3a3c4b] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="0.5"
              type="text"
              value={distributeAmo}
              onChange={(e) => setDistributeAmo(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex flex-row justify-start gap-3 items-end">
          <div className="w-[33%] flex flex-col">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Min:
            </p>
            <div className="flex flex-row justify-between items-center relative">
              <input
                className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                placeholder="Min SOL Amount, Exp. 0.01"
                type="text"
                value={volumeMin}
                onChange={(e) => setVolumeMin(e.target.value)}
              />
              <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                SOL
              </div>
            </div>
            <p className="mt-2 text-sm font-normal" />
          </div>
          <div className="w-[33%] flex flex-col">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Max
            </p>
            <div className="flex flex-row justify-between items-center relative">
              <input
                className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                placeholder="Max SOL Amount, Exp. 0.02"
                type="text"
                required
                value={volumeMax}
                onChange={(e) => setVolumeMax(e.target.value)}
              />
              <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                SOL
              </div>
            </div>
            <p className="mt-2 text-sm font-normal" />
          </div>

          <button
            type="button"
            disabled={isBotRunning}
            onClick={onHandleStartBot}
            className={`${isBotRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-violet-500 bg-violet-700 cursor-pointer"
              } transition-all active:scale-90 text-base px-12 py-3 rounded-lg flex items-center justify-center text-white font-semibold border border-[#a27be0] mb-7`}
          >
            Start
          </button>

          <button
            type="button"
            disabled={!isBotRunning}
            onClick={onHandleStopBot}
            className={`${!isBotRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-red-500 bg-red-700 cursor-pointer"
              } transition-all active:scale-90 text-base px-12 py-3 rounded-lg flex items-center justify-center text-white font-semibold border border-[#a27be0] mb-7`}
          >
            Stop
          </button>
        </div>

        {statusMessage && (
          <div className="w-full mt-4 p-3 rounded-md bg-gray-100 text-center">
            <p className={`text-lg ${isBotRunning ? 'text-green-600' : 'text-gray-700'}`}>
              {statusMessage}
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default LPBot;
