import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PumpFun = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loopNum, setLoopNum] = useState("");
  // const [presaleAmount, setPresaleAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!loopNum) {
      alert("Required Loop Number, and presale Amount!");
      return;
    }

    try {
      const response = await axios.post(
        "http://170.130.165.249:5000/pumpfun/",
        {
          loopNum,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`Successfully!`, {
        autoClose: 2000,
      });
      console.log("Successfully", response.success);
    } catch (error) {
      // Improved error handling
      toast.error(`Error: ${error.message}`, {
        autoClose: 2000,
      });
      console.error("Error creating token:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide"
    >
      <ToastContainer />
      <div className="mx-[7%] flex w-full h-auto flex-col">
        <div className="w-full border-b-2 border-solid border-[#EBEBEB] justify-center items-start flex flex-col mt-10 pb-4">
          <p className="text-2xl font-medium">Solana Token Creation</p>
        </div>
        <div className="w-full h-auto flex flex-col mt-12">
          <div className="w-full flex flex-row justify-between items-center mb-6">
            <div className="flex flex-col w-[48%]">
              <div className="w-full flex flex-col mb-6">
                <p className="mb-2 text-lg font-medium">
                  <span className="text-[#ff0000] mr-2">*</span>Token Name
                </p>
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="DONT BUY !"
                  disabled
                  type="text"
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="mb-2 text-lg font-medium">
                  <span className="text-[#ff0000] mr-2">*</span>Token Symbol
                </p>
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="DONTBUY"
                  disabled
                  type="text"
                />
              </div>
            </div>
            <div className="w-[48%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Token Logo
              </p>
              <div className="bg-[#fff] transition-all active:border-[#8b5cf6] flex flex-row justify-between items-center border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[20px_30px] text-[16px] text-[#3a3c4b]">
                {/* <input className="hidden" id="file-input" type="file" /> */}
                <img
                  alt=""
                  src="https://ipfs.io/ipfs/QmWrUt7gQpeXNiwHd87s2taEeSbBBGy6Z4pAjpZyRDftnR"
                  className="w-[110px] overflow-hidden h-[110px] cursor-pointer bg-[#FAFAFA] flex justify-center items-center rounded-xl border border-dashed border-[#EBEBEB] hover:border-[#8b5cf6] transition-all"
                />

                <div className="flex h-[100px] flex-col justify-between w-[75%]">
                  <div className="flex flex-col font-normal text-[12px]">
                    <p>Supported image formats: PNG/GIF/JPG/WEBP and JPEG</p>
                    <p>Recommended size: 1000×1000 pixels</p>
                  </div>
                  <p className="font-normal text-[12px] text-black/60">
                    If it meets the above requirements, it can be better
                    displayed on various platforms and applications
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start my-6">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Token Description
            </p>
            <textarea
              className="bg-[#fff] w-full h-[150px] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="THIS WEEK WE ARE LAUNCH OUR GAME-CHANGING UTILITY COIN & EXCLUSIVE SOL TOOL WEBSITE! 🔥 💥 GET READY FOR THE LOWEST SERVICE FEES ON THE MARKET! 💥 ⚠️ DON’T BUY ANY TESTING COINS – WE'RE JUST TESTING OUR TOOLS! ⚠️ BE A PART OF THIS INNOVATION FROM DAY ONE!"
              disabled
            ></textarea>
          </div>
          <div className="w-full flex flex-row justify-between items-center mb-6">
            <div className="flex flex-col w-[48%]">
              <div className="w-full flex flex-col">
                <p className="mb-2 text-lg font-medium">
                  <span className="text-[#ff0000] mr-2">*</span>Presale Amount
                </p>
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="0.0001 SOL"
                  disabled
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-col w-[48%]">
              <div className="w-full flex flex-col">
                <p className="mb-2 text-lg font-medium">
                  <span className="text-[#ff0000] mr-2">*</span>Loop Number
                </p>
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="100"
                  required
                  value={loopNum}
                  onChange={(e) => setLoopNum(e.target.value)}
                  type="text"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 mb-12 transition-all active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-violet-500 bg-violet-700"
              } flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
          >
            {isSubmitting ? "Generating..." : "Start"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PumpFun;
