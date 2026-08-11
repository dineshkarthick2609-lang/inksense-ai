import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import {
  Minus,
  Plus,
  RotateCw,
  Copy,
  Download,
  ArrowLeft,
} from "lucide-react";

import "./DocumentViewer.css";

import notebook from "../image/flower.jpeg";

function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationData = location.state;

  const documents = {
    1: {
      title: "Machine Learning — Lecture Notes",
      text: "Machine Learning Notes...",
      image: notebook,
    },

    2: {
      title: "Machine Learning Notes",
      text: "Machine Learning Notes...",
      image: notebook,
    },

    3: {
      title: "Project Meeting Notes",
      text: "Project Meeting Notes...",
      image: notebook,
    },

    4: {
      title: "Assignment Draft",
      text: "Assignment Draft...",
      image: notebook,
    },

    5: {
      title: "Daily Study Notes",
      text: "Daily Study Notes...",
      image: notebook,
    },
  };

  // ==========================================
  // Temporary document from Digitise page
  // ==========================================

  let selectedDocument;

  if (id === "new" && navigationData) {
    selectedDocument = {
      title:
        navigationData.title ||
        "Untitled Handwritten Document",

      text:
        navigationData.text || "",

      imageFile:
        navigationData.imageFile,

      type:
        navigationData.type || "image/jpeg",

      language:
        navigationData.language || "English",

      date:
        navigationData.date || "",
    };
  } else {
    selectedDocument = documents[id];
  }

  const imageSource =
    selectedDocument?.imageFile
      ? URL.createObjectURL(selectedDocument.imageFile)
      : selectedDocument?.image;

  const [text, setText] = useState(
    selectedDocument?.text || ""
  );

  const [zoom, setZoom] = useState(100);

  // -----------------------------
  // Document Not Found
  // -----------------------------

  if (!selectedDocument) {
    return (
      <div className="document-not-found">
        <h2>Document Not Found</h2>
        <p>The document you are looking for does not exist.</p>
      </div>
    );
  }

  // -----------------------------
  // Statistics
  // -----------------------------

  const words =
    text.trim() === ""
      ? 0
      : text.trim().split(/\s+/).length;

  const characters = text.length;

  // -----------------------------
  // Zoom
  // -----------------------------

  const increaseZoom = () => {
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const decreaseZoom = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setZoom(100);
  };

  // -----------------------------
  // Copy Text
  // -----------------------------

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);

      alert("Text copied successfully!");
    } catch (error) {
      console.error("Failed to copy text:", error);

      alert("Unable to copy text. Please try again.");
    }
  };

  // -----------------------------
  // Download Text
  // -----------------------------

  const handleDownloadText = () => {
    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    const fileName = selectedDocument.title
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "_");

    link.download = `${fileName}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // -----------------------------
  // Digitise Again
  // -----------------------------

  const handleDigitiseAgain = () => {
    navigate("/digitise");
  };

  return (
    <main className="viewer-page">

      {/* =================================
          TOP SECTION
      ================================= */}

      <div className="viewer-container">

        {/* Back + Status */}

        <div className="viewer-top">

          <button
            className="back-btn"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="doc-status">

            <span className="file-type">
              PNG
            </span>

            <span className="digitised-status">
              Digitised
            </span>

          </div>

        </div>


        {/* =================================
            HEADING
        ================================= */}

        <div className="viewer-heading">

          <h1>
            {selectedDocument.title}
          </h1>

          <p>
            Review the extracted handwriting, make corrections,
            then export or save your document.
          </p>

        </div>


        {/* =================================
            MAIN WORKSPACE
        ================================= */}

        <div className="viewer-grid">


          {/* =================================
              LEFT - ORIGINAL DOCUMENT
          ================================= */}

          <section className="viewer-card original-card">

            <div className="card-header">

              <h3>
                Original Document
              </h3>

              <div className="header-icons">

                <button
                  type="button"
                  onClick={decreaseZoom}
                  aria-label="Zoom out"
                >
                  <Minus size={16} />
                </button>

                <button
                  type="button"
                  onClick={increaseZoom}
                  aria-label="Zoom in"
                >
                  <Plus size={16} />
                </button>

                <button
                  type="button"
                  onClick={resetZoom}
                  aria-label="Reset zoom"
                >
                  <RotateCw size={16} />
                </button>

              </div>

            </div>


            {/* Image Preview */}

            <div className="image-wrapper">

              <div
                className="paper"
                style={{
                  transform: `scale(${zoom / 100})`,
                }}
              >

                <img
                  src={imageSource}
                  alt={selectedDocument.title}
                />

              </div>

            </div>


            {/* Image Footer */}

            <div className="image-footer">

              <button className="replace-btn">
                Replace Image
              </button>

              <span>
                Zoom {zoom}%
              </span>

            </div>

          </section>


          {/* =================================
              RIGHT - EXTRACTED TEXT
          ================================= */}

          <section className="viewer-card extracted-card">

            <div className="card-header">

              <h3>
                Extracted Text
              </h3>

              <label className="checkbox">

                <input
                  type="checkbox"
                />

                <span>
                  Show uncertain words
                </span>

              </label>

            </div>


            {/* Text Editor */}

            <textarea
              className="text-editor"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Extracted text will appear here..."
            />


            {/* Statistics */}

            <div className="stats">

              <div className="stat-item">

                <strong>
                  {words}
                </strong>

                <span>
                  Words
                </span>

              </div>


              <div className="stat-item">

                <strong>
                  {characters}
                </strong>

                <span>
                  Characters
                </span>

              </div>


              <div className="stat-item">
                <strong>
                  {text.trim() === ""
                    ? 0
                    : text.trim().split(/\n/).length}
                </strong>

                <span>
                  Lines
                </span>
              </div>

            </div>


            {/* Hint */}

            <p className="hint">
              Review the extracted text before exporting.
            </p>


            {/* Buttons */}

            <div className="button-group">

              {/* Copy */}

              <button
                className="secondary-btn"
                onClick={handleCopyText}
                type="button"
              >

                <Copy size={16} />

                Copy Text

              </button>


              {/* Download */}

              <button
                className="secondary-btn"
                onClick={handleDownloadText}
                type="button"
              >

                <Download size={16} />

                Download TXT

              </button>

            </div>


            {/* Digitise Again */}

            <button
              className="again-btn"
              onClick={handleDigitiseAgain}
              type="button"
            >
              Digitise Again
            </button>

          </section>

        </div>

      </div>

    </main>
  );
}

export default DocumentViewer;