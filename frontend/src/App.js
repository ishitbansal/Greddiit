import React from "react";
import { Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";
import MySubGredditsPage from "./components/MySubGreddiitsPage";
import MySubGreddiit from "./components/MySubGreddiit";
import SubGredditsPage from "./components/SubGreddiitsPage";
import SubGreddiit from "./components/SubGreddiit";
import SavedPosts from "./components/SavedPostsPage";
import NotFoundPage from "./components/NotFoundPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PersistentLogin from "./routes/PersistentLogin";
import ProtectMySubGreddiit from "./routes/ProtectMySubGreddiit";
import ProtectSubGreddiit from "./routes/ProtectSubGreddiit";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PersistentLogin><LoginPage /></PersistentLogin>} />
        <Route path="/home" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
        <Route path="/profile" element={<ProtectedRoutes><ProfilePage /></ProtectedRoutes>} />
        <Route path="/mysubgreddiit" element={<ProtectedRoutes><MySubGredditsPage /></ProtectedRoutes>} />
        <Route path="/mysubgreddiit/:subgred_id" element={<ProtectedRoutes><ProtectMySubGreddiit><MySubGreddiit /></ProtectMySubGreddiit> </ProtectedRoutes>} />
        <Route path="/subgreddiit" element={<ProtectedRoutes><SubGredditsPage /></ProtectedRoutes>} />
        <Route path="/subgreddiit/:subgred_id" element={<ProtectedRoutes><ProtectSubGreddiit><SubGreddiit /></ProtectSubGreddiit> </ProtectedRoutes>} />
        <Route path="/savedposts" element={<ProtectedRoutes><SavedPosts /></ProtectedRoutes>} />
        <Route path="*" element={<ProtectedRoutes> <NotFoundPage /> </ProtectedRoutes>} />
      </Routes>
    </div>
  );
}

export default App;
