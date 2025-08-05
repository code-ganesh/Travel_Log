import React from 'react';
import { Outlet } from 'react-router-dom'; // <--- IMPORT OUTLET
import Navbar from './Navbar'; // Ensure this path is correct
// import Footer from './Footer'; // If you have one

export default function AuthLayout() { // No need for { children } prop anymore if using Outlet
  return (
    <>
      <Navbar />
      {/* This padding-top (pt-20) is crucial to prevent content from being hidden by the fixed Navbar */}
      <main className="pt-20"> 
        <Outlet /> {/* <--- THIS IS THE KEY! It renders the matched nested route component */}
      </main>
      {/* If you have a footer, it would go here */}
      {/* <Footer /> */}
    </>
  );
}