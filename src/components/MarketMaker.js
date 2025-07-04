import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const MarketMaker = () => {
  const [baseTokenAddress, setBaseTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [importWalletPk, setImportWalletPk] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!baseTokenAddress || !amount || !importWalletPk) {
      toast.warning("Base Token address and Amount are required", {
        autoClose: 2000
      });
      return;
    }
  };

  return (
    <form className="flex w-full h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide">
      <ToastContainer />
      <div className="mx-[7%] flex w-full h-auto flex-col">
        <div className="w-full border-b-2 border-solid border-[#EBEBEB] justify-between items-center flex flex-row mt-10 pb-4">
          <p className="text-2xl font-medium">
            Market Maker Bot on Raydium CPMM
          </p>
        </div>
        <div className="w-full flex flex-row justify-between items-end mt-6">
          <div className="w-[100%] flex flex-col">
            <p className="mb-2 text-lg font-medium">Main Wallet</p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter your main wallet private key"
              type="password"
              value={importWalletPk}
              onChange={(e) => setImportWalletPk(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full h-auto flex flex-row mt-6 justify-between items-end">
          <div className="w-[48%] flex flex-col mb-6">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Base Token Address
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter the Base Token Address"
              type="text"
              value={baseTokenAddress}
              onChange={(e) => setBaseTokenAddress(e.target.value)}
            />
          </div>
          <div className="w-[48%] flex flex-col mb-6">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Amount
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter the Amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className={`mt-12 transition-all active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer hover:bg-violet-500 bg-violet-700 flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
        >
          Start
        </button>
      </div>
    </form>
  );
};

export default MarketMaker;
