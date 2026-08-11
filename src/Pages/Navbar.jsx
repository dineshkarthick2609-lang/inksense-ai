import { useState } from "react";
import "./Navbar.css";
import { PenTool, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div
          className="logo"
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
        >
          <div className="logo-icon">
            <PenTool size={18} />
          </div>

          <h2>InkSense AI</h2>
        </div>

        {/* Hamburger */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navigation */}
        <div className={`nav-links ${menuOpen ? "active-menu" : ""}`}>

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/digitise"
            onClick={() => setMenuOpen(false)}
          >
            Digitise
          </NavLink>

          <NavLink
            to="/documents"
            onClick={() => setMenuOpen(false)}
          >
            My Documents
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          <button
            className="scan-btn"
            onClick={() => {
              navigate("/digitise");
              setMenuOpen(false);
            }}
          >
            New Scan
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;