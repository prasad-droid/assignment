import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import LeadsPage from "./components/LeadsPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <main>
        <SideBar />
        <div className="maincontent">
          <Routes>
            <Route path="dashboard" index element={<Dashboard />}></Route>
            <Route path="leads" index element={<LeadsPage />}></Route>
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
