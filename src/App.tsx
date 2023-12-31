import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeeManagementPage from "./pages/FeeManagementPage";
import HomePage from "./pages/HomePage";
import MyCourses from "./pages/MyCourses";
import TeacherHomePage from "./pages/TeacherHomePage";
import InPlaceEditingTableComponent from "./components/InPlaceEditingTable/inPlaceEditingTableComponent";
import CoursesListingComponent from "./components/ListingComponents/CoursesListingComponent";
import StudentListingComponent from "./components/ListingComponents/StudentListingComponent";
import TeachersListingComponent from './components/ListingComponents/TeachersListingComponent';
import PaymentListingComponent from "./components/ListingComponents/PaymentListingComponent";

//https://www.codeconcisely.com/posts/react-navigation/
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        {/*<Route path="/fees" element={<FeeManagementPage/>} />*/}
          <Route path="/teachers" element={<TeachersListingComponent/>} />
          <Route path="/courses" element={<CoursesListingComponent/>} />
          <Route path="/students" element={<StudentListingComponent/>} />
          <Route path="/fees/:srno" element={<PaymentListingComponent/>} />
      </Routes>
    </div>
  );
}

export default App;
