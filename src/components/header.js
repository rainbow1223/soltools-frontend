import React, { useState } from "react";
import WalletModal from "./WalletModal.js";

const Header = () => {
  const [modal, setModal] = useState(false);

  // const walletAddress = localStorage.getItem("importedPk");

  const OpenImportWallet = () => {
    setModal(!modal);
  };

  return (
    <div className="w-full h-[100px] bg-[#FFF9F1] items-center justify-between flex flex-row border-b border-solid border-[#EBEBEB]">
      <p className="ml-[7%] text-3xl text-black/70 font-bold">Solana Tools</p>
      <div
        onClick={() => OpenImportWallet()}
        className="mr-[7%] transition-all text-base px-4 py-3 rounded-lg cursor-pointer hover:bg-violet-500 bg-violet-700 flex items-center justify-center text-white font-semibold border border-[#a27be0]"
      >
        Import Wallet
      </div>
      <WalletModal show={modal} close={OpenImportWallet} />
    </div>
  );
};

export default Header;
