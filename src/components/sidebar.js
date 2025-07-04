import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState("");

  const links = [
    { path: "/", key: "creation", label: "SPL Token Creation" },
    { path: "/bot", key: "bot", label: "Manage LP" },
    { path: "/volumebot", key: "volumebot", label: "Market Maker" },
    { path: "/remove-lp-only", key: "remove-lp-only", label: "Remove LP Only" },
    { path: "/holder-increase", key: "holder-increase", label: "Holder Increase" },
    // Uncomment or add more links as needed:
    // { path: "/pumpfun", key: "pumpfun", label: "Pump.Fun Bot" },
    // { path: "/washfund", key: "washfund", label: "Funds Wash" },
    // { path: "/market-maker", key: "market-maker", label: "Market Maker Bot" },
  ];

  useEffect(() => {
    const currentLink = links.find((link) => link.path === location.pathname);
    if (currentLink) {
      setSelected(currentLink.key);
    }
  }, [location.pathname, links]);

  return (
    <div className="flex flex-col w-full h-screen bg-[#262B3F]">
      <div className="w-full h-[100px] border-b border-solid border-[#EBEBEB] text-white font-bold text-3xl flex items-center justify-center">
        SOLANA TOOLS
      </div>
      <div className="w-full mt-10 flex flex-col justify-start items-start">
        {links.map((link) => (
          <Link
            key={link.key}
            to={link.path}
            onClick={() => setSelected(link.key)}
            className={`${
              selected === link.key ? "bg-[#41465c]" : "bg-transparent"
            } flex w-full h-[60px] hover:bg-[#20232e] transition-all items-center text-white font-semibold text-xl`}
          >
            <p className="ml-6">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
