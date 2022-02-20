import React, { useEffect } from 'react';
import './App.css';
import Map from "./Components/Map/Map";
import { Amplify } from "aws-amplify";

console.log('Env test: ', process.env.REACT_APP_IDENTITY_POOL_ID);

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: "us-east-1",
  },
  geo: {
    AmazonLocationService: {
      maps: {
        items: {
          "TravelingSalesmansTaskDemo": {
            style: "VectorEsriDarkGrayCanvas"
          },
        },
        default: "TravelingSalesmansTaskDemo",
      },
      region: "us-east-1",
    },
  }
});

function App() {
  // const { categories } = useCategories();

  return (
    <div className="App">
        <Map />
    </div>
  );
}

export default App;
