import React, { useEffect } from 'react';
import './App.css';
import Map from "./Components/Map/Map";
import { Amplify } from "aws-amplify";
import GoogleLoginComp from "./Components/GoogleLogin/GoogleLogin";
import { LoginProvider } from "./api/LoginContext";

function App() {
  // const { categories } = useCategories();

  return (
    <LoginProvider>
      <div className="App">
        <Map />
        <GoogleLoginComp />
      </div>
    </LoginProvider>
  );
}

export default App;
