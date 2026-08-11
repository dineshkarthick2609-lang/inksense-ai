import {
  PenTool,
  ArrowUpRight,
  Github,
  Mail,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      {/* =================================
          MAIN FOOTER
      ================================= */}

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <div
            className="footer-logo"
            onClick={() => {
              navigate("/");
              scrollToTop();
            }}
          >

            <div className="footer-logo-icon">
              <PenTool size={17} />
            </div>

            <span>InkSense AI</span>

          </div>


          <p>
            An intelligent handwriting digitisation platform that
            transforms handwritten content into editable and
            searchable digital text.
          </p>


          <button
            className="footer-top-btn"
            onClick={scrollToTop}
          >
            Back to top
            <ArrowUpRight size={15} />
          </button>

        </div>


        {/* Product */}

        <div className="footer-column">

          <h3>Product</h3>

          <NavLink to="/digitise">
            Digitise Handwriting
          </NavLink>

          <NavLink to="/documents">
            My Documents
          </NavLink>

          <NavLink to="/digitise">
            New Scan
          </NavLink>

        </div>


        {/* Platform */}

        <div className="footer-column">

          <h3>Platform</h3>

          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/about">
            About InkSense
          </NavLink>

          <a href="#workflow">
            How It Works
          </a>

        </div>


        {/* Project */}

        <div className="footer-column">

          <h3>Project</h3>

          <a href="#features">
            Features
          </a>

          <a href="#workflow">
            Workflow
          </a>

          <a href="/about">
            Technology
          </a>

        </div>


      </div>


      {/* =================================
          FOOTER BOTTOM
      ================================= */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {new Date().getFullYear()} InkSense AI. All rights reserved.
          </p>


          <div className="footer-bottom-right">

            <span>
              Handwriting Digitisation Platform
            </span>

            <a
              href="mailto:inksenseai@gmail.com"
              aria-label="Email InkSense AI"
            >
              <Mail size={16} />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;