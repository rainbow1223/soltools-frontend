import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const RemoveLPOnly = () => {
  const [baseTokenAddress, setBaseTokenAddress] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [profit, setProfit] = useState("");
  // const [loss, setLoss] = useState("");
  // const [lpSolAmount, setLpSolAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!baseTokenAddress || !poolAddress) {
      toast.warning("Pool address is required", { autoClose: 2000 });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        "http://170.130.165.249:3001/remove-lp-only/",
        {
          baseTokenAddress,
          poolAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Removed LP successfully!");

      setBaseTokenAddress("");
    } catch (error) {
      console.error("Error removing LP: ", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setBaseTokenAddress("");
      setPoolAddress("");
      // setProfit("");
      // setLoss("");
      // setLpSolAmount("");
    }
  };

  // const handleManualWithdraw = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://170.130.165.249:3001/lp-remove-manual",
  //       {
  //         result: "true" // Sending true boolean value
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       }
  //     );

  //     alert(`Manual withdraw successful! ${response.data.message}`);
  //   } catch (error) {
  //     console.error("Error during manual withdraw:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide"
    >
      <ToastContainer />
      <div className="mx-[7%] flex w-full h-auto flex-col mb-12">
        <div className="w-full border-b-2 border-solid border-[#EBEBEB] justify-center items-start flex flex-col mt-10 pb-4">
          <p className="text-2xl font-medium">Remove LP Only</p>
        </div>
        <div className="w-full h-auto flex flex-row mt-6 justify-between items-end">
          <div className="w-[48%] flex flex-col mb-6">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Pool Address
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter the Pool Address"
              type="text"
              value={poolAddress}
              onChange={(e) => setPoolAddress(e.target.value)}
            />
          </div>
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
        </div>
        {/* <button
          onClick={() => {
            handleManualWithdraw();
          }}
          type="button"
          disabled={!isSubmitting}
          className={`mt-6 mb-6 w-[100%] transition-all active:scale-90 text-base rounded-[6px] p-[10px_15px] ${
            isSubmitting
              ? "hover:bg-violet-500 bg-violet-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          } flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
        >
          Remove LP Manually
        </button> */}
        {/* <p className="text-[22px] font-semibold mb-5">PnL</p>
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-[48%] flex flex-col">
            <p className="text-lg font-medium mb-2">
              <span className="text-[#ff0000] mr-2">*</span>Profit:
            </p>
            <div className="flex flex-row justify-between items-center relative">
              <input
                className="bg-[#fff] focus:border-[#8b5cf6] transition-all w-full mb-5 border border-solid outline-none border-[#3a3c4b] rounded-[3px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                placeholder="Exp. 15"
                type="text"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
              />
              <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                USD
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
                placeholder="Exp. 10"
                type="text"
                value={loss}
                onChange={(e) => setLoss(e.target.value)}
              />
              <div className="absolute right-0 font-medium p-[9px_25px] text-[18px] top-0 border-l border-[#3a3c4b] cursor-default">
                USD
              </div>
            </div>
          </div>
        </div> */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-12 transition-all active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer ${isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "hover:bg-violet-500 bg-violet-700"
            } flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
        >
          Remove LP Manually
        </button>
      </div>
    </form>
  );
};

export default RemoveLPOnly;
