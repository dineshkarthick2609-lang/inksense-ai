import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Digitise from "./Pages/Digitise";
import Documents from "./Pages/Documents";
import DocumentViewer from "./Pages/DocumentViewer";
import About from "./Pages/About";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Backend connection error:", error);
      });
  }, []);

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/digitise" element={<Digitise />} />

        <Route path="/documents" element={<Documents />} />

        <Route
          path="/document/:id"
          element={<DocumentViewer />}
        />

        <Route path="/about" element={<About />} />

      </Routes>

      {/* Temporary Backend Connection Test */}
      <div className="backend-test">
        <p>{message}</p>
      </div>

    </BrowserRouter>
  );
}

export default App;