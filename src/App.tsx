import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import FeeDetailsPage from "./fees";

//https://www.codeconcisely.com/posts/react-navigation/
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="fees" element={<FeeDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
