import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Index from "../../components/Index/index";

function App() {
  const currentUrl = window.location.href;
  const [activePage, setActivePage] = useState("index");


  useEffect(() => {
    localStorage.setItem(
      "userToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTFrYXgxZ2cwMDAwbWhrN2U5b3F4dWNyIiwiZW1haWwiOiJ2aW5heWFrdGh1a3JhbDIwMDNAZ21haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzI3NDM2NDU4fQ.RMqb_5e0sU5LKUOPImpG3klUgFXgM7v3dr82moqYjcM"
    );
  }, []);

  const navigateToPage = (page: string) => {
    console.log(`Navigating to page: ${page}`);
    setActivePage(page);
  };

  console.log("current", currentUrl);

  return (
    <main className="newboard-theme w-[400px] h-[600px] bg-white">

    
    <Index/>

 
    </main>
  );
}

export default App;