import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import Auth from "./pages/Auth.jsx";
import Channel from "./pages/Channel.jsx";
import ManageVideos from "./pages/ManageVideos.jsx";

import Sidebar from "./components/Sidebar.jsx";
import TopNavbar from "./components/Navbar.jsx";

function App() {
  const location = useLocation();

  const isWatchPage = location.pathname.startsWith("/watch");
  const isHomePage = location.pathname === "/";

  const [showSidebar, setShowSidebar] = useState(true);

  // 🔥 AUTO CONTROL SIDEBAR BASED ON ROUTE
  useEffect(() => {
    if (isHomePage) {
      setShowSidebar(true);      // Always open on Home
    } else if (isWatchPage) {
      setShowSidebar(false);     // Closed by default on Watch
    }
  }, [isHomePage, isWatchPage]);

  return (
    <>
      <TopNavbar toggleSidebar={() => setShowSidebar(prev => !prev)} />

      <div
        className={`app-layout 
          ${isWatchPage ? "watch-layout" : ""} 
          ${showSidebar ? "sidebar-open" : "sidebar-closed"}
        `}
      >
        {/* ✅ Sidebar rendered ONLY ONCE */}
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/channel/:userId" element={<Channel />} />
            <Route path="/channel/:userId/videos" element={<ManageVideos />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
