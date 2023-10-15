import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeeManagementPage from "./pages/FeeManagementPage";
import HomePage from "./pages/HomePage";

//https://www.codeconcisely.com/posts/react-navigation/
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="fees" element={<FeeManagementPage/>} />
      </Routes>
    </div>
  );
}

export default App;
