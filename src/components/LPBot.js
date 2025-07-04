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

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col justify-start w-[48%]">

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


        
      </div>
    </form>
  );
};

export default LPBot;
