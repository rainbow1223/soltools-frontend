import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/header";
import LPBot from "./components/LPBot.js";
import CreateToken from "./components/CreateToken.js";
import Sidebar from "./components/sidebar.js";
import PumpFun from "./components/pumpFun.js";
import WashFund from "./components/WashFund.js";
import RemoveLPOnly from "./components/RemoveLPOnly.js";
import MarketMaker from "./components/MarketMaker.js";
import VolumeBot from "./components/volumeBot.js";
import HolderIncrease from "./components/HolderIncrease.js";

function App() {
  return (
    <Router>
      <div className="flex flex-row w-full max-h-screen h-screen bg-[#4d4d4d]">
        <div className="flex w-[15%] h-screen">
          <Sidebar />
        </div>
        <div className="flex flex-col w-[85%] h-screen">
          <Header />
          <main>
            <Routes>
              <Route exact path="/" element={<CreateToken />} />
              <Route exact path="/bot" element={<LPBot />} />
              <Route exact path="/pumpfun" element={<PumpFun />} />
              <Route exact path="/washfund" element={<WashFund />} />
              <Route exact path="/remove-lp-only" element={<RemoveLPOnly />} />
              <Route exact path="/market-maker" element={<MarketMaker />} />
              <Route exact path="/volumebot" element={<VolumeBot />} />
              <Route exact path="/holder-increase" element={<HolderIncrease />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
