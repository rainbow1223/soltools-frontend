import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const WashFund = () => {
  const [numberOfWallets, setNumberOfWallets] = useState(1);
  const [senderWalletPk, setSenderWalletPk] = useState("");
  const [targetWalletAddr, setTargetWalletAddr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstBatchs, setFirstBatchs] = useState([]);
  const [secondBatchs, setSecondBatchs] = useState([]);
  const [isWalletGenerating, setIsWalletGenerating] = useState(false);
  const [isExportEnabled, setIsExportEnabled] = useState(false);
  // const [enableBatch2, setEnableBatch2] = useState(false);

  // const generateWallets = () => {
  //   const newWallets = [];
  //   for (let i = 0; i < numberOfWallets; i++) {
  //     const wallet = Keypair.generate();
  //     newWallets.push(base58.encode(wallet.secretKey));
  //   }

  //   setWallets(newWallets);
  // };

  useEffect(() => {
    if (numberOfWallets > 14) {
      setNumberOfWallets(14);
    } else {
      setNumberOfWallets(numberOfWallets);
    }
  }, [numberOfWallets]);

  const generateWallets = async (e) => {
    e.preventDefault();

    if (!numberOfWallets) {
      toast.warning("Plesae input number of wallets", { autoClose: 2000 });
      return;
    }

    setIsWalletGenerating(true);

    try {
      const res = await axios.post(
        "http://170.130.165.249:3001/generate-wallet",
        {
          numberOfWallets,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFirstBatchs(res.data.firstBatchs);
      setSecondBatchs(res.data.secondBatchs);
      setIsExportEnabled(true);

      console.log("Generated wallets successfully!");
    } catch (error) {
      console.error("Error while generating wallets", error);
    } finally {
      setIsWalletGenerating(false);
      setNumberOfWallets(1);
    }
  };

  // const splitWallets = () => {
  //   const midIndex = Math.ceil(wallets.length / 2);
  //   return [wallets.slice(0, midIndex), wallets.slice(midIndex)];
  // };

  // const [firstBatchs, secondBatchs] = splitWallets();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senderWalletPk || !targetWalletAddr || !firstBatchs) {
      toast.warning("Please input all!", { autoClose: 2000 });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        "http://170.130.165.249:3001/wash-funds",
        {
          firstBatchs,
          secondBatchs,
          senderWalletPk,
          targetWalletAddr,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Fund Wash is Successfully!");
    } catch (error) {
      console.error("Error removing LP:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setSenderWalletPk("");
      setTargetWalletAddr("");
      setFirstBatchs([]);
      setSecondBatchs([]);
      setIsExportEnabled(false);
    }
  };

  const exportToFile = () => {
    const combinedBatches = `BatchOneWallets:
    ${firstBatchs.join("\n")}
    ----------------------------------------------------------------------
    
    BatchTwoWallets:
    ${secondBatchs.join("\n")}`.trim();
    const blob = new Blob([combinedBatches], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `CombinedBatchWallets.txt`;
    link.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide"
    >
      <ToastContainer />
      <div className="mx-[7%] flex w-full h-auto flex-col">
        <div className="w-full border-b-2 border-solid border-[#EBEBEB] justify-center items-start flex flex-col mt-10 pb-4">
          <p className="text-2xl font-medium">Batch Wallets Generation</p>
        </div>
        <div className="w-full flex flex-row justify-between items-end mt-6">
          <div className="w-[30%] flex flex-col">
            <p className="mb-2 text-lg font-medium">Wallet Addresses Number</p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="25"
              type="number"
              value={numberOfWallets}
              onChange={(e) => setNumberOfWallets(e.target.value)}
              min={1}
              max={14}
            />
          </div>
          <div className="w-[30%] flex flex-col">
            <button
              onClick={generateWallets}
              type="button"
              disabled={isWalletGenerating}
              className={`transition-all active:scale-90 text-base  p-[10px_15px] rounded-lg cursor-pointer ${isWalletGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-violet-500 bg-violet-700"
                }  flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
            >
              Generate
            </button>
          </div>
          <div className="w-[30%] flex flex-col">
            <button
              onClick={exportToFile}
              type="button"
              disabled={!isExportEnabled}
              className={`transition-all text-base  p-[10px_15px] rounded-lg cursor-pointer ${!isExportEnabled
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "hover:bg-violet-500 bg-violet-700 active:scale-90"
                }  flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
            >
              Export Batch Private Key
            </button>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between items-end mt-6">
          <div className="w-[48%] flex flex-col justify-between items-start my-6">
            <p className="mb-2 text-lg font-medium">Batch Wallets 1</p>
            <textarea
              className="bg-[#fff] scroll-hide w-full h-[250px] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[12px] text-[#3a3c4b]"
              placeholder="Batch Wallets Addresses"
              rows={10}
              cols={50}
              value={firstBatchs.map((wallet) => wallet).join("\n")}
              readOnly
            />
          </div>
          <div className="w-[48%] flex flex-col justify-between items-start my-6">
            <div className="mb-2 flex flex-row items-center justify-start">
              <p className="text-lg font-medium mr-2">Batch Wallets 2</p>
              {/* <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer z-0"
                  onChange={toggleEnableSecondBatch}
                  checked={enableBatch2}
                />
                <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700" />
              </label> */}
            </div>

            <textarea
              className="bg-[#fff] scroll-hide w-full h-[250px] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[12px] text-[#3a3c4b]"
              placeholder="Batch Wallets Addresses"
              rows={10}
              cols={50}
              value={secondBatchs.map((wallet) => wallet).join("\n")}
              readOnly
            />
          </div>
        </div>
        <div className="w-full flex flex-row justify-between items-end mt-6">
          <div className="w-[100%] flex flex-col">
            <p className="mb-2 text-lg font-medium">Sender Wallet</p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter your sender wallet private key"
              type="password"
              value={senderWalletPk}
              onChange={(e) => setSenderWalletPk(e.target.value)}
            />
          </div>
          {/* <div className="w-[18%] flex flex-col">
            <p className="text-lg font-medium mb-2">Amount</p>
            <div className="flex flex-row justify-between items-center relative">
              <input
                className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                placeholder="Exp. 15"
                type="text"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
              <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#EBEBEB] cursor-default">
                SOL
              </div>
            </div>
          </div> */}
        </div>
        <div className="w-full flex flex-row justify-between items-end mt-6">
          <div className="w-[48%] flex flex-col">
            <p className="mb-2 text-lg font-medium">Target Wallet Address</p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter your target wallet address!"
              type="text"
              value={targetWalletAddr}
              onChange={(e) => setTargetWalletAddr(e.target.value)}
            />
          </div>
          <div className="w-[48%] flex flex-col">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`transition-all active:scale-90 text-base  p-[10px_15px] rounded-lg cursor-pointer ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-violet-500 bg-violet-700"
                }  flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default WashFund;
