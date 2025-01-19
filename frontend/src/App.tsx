import { useState } from "react";
import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles.css";
import Landing from "./Landing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Add more routes as needed, for example: */}
          {/* <Route path="/topics" element={<Topics />} /> */}
          {/* <Route path="/map" element={<Map />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
