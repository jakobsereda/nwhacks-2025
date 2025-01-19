import { useState } from "react";
import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Landing from "./Landing";
import Home from "./Home"
import View from "./View"
import Host from "./Host"

import "./styles.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/View" element={<View />} />
          <Route path="/Host" element={<Host />} />

          {/* Add more routes as needed, for example: */}
          {/* <Route path="/topics" element={<Topics />} /> */}
          {/* <Route path="/map" element={<Map />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
