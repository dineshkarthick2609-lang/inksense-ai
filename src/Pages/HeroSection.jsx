import "./HeroSection.css";
import { Upload, Camera } from "lucide-react";

function HeroSection() {
 const handleUploadDocument = () => {
  window.location.href = "/digitise";
};

  return (
    <section className="hero">

      {/* Left Side */}
      <div className="hero-left">

        <p className="hero-tag">
          HANDWRITING DIGITISATION PLATFORM
        </p>

        <h1 className="hero-title">
          Turn Handwriting into Digital Text
        </h1>

        <p className="hero-description">
          Upload handwritten notes or capture them using your camera.
          InkSense AI converts them into editable, searchable,
          and downloadable digital text.
        </p>

        <div className="hero-buttons">

          <button
            className="upload-btn"
            onClick={handleUploadDocument}
          >
            <Upload size={18} strokeWidth={2} />
            Upload Document
          </button>

          <button
          className="camera-btn"
          onClick={() => {
            window.location.href = "/digitise?mode=camera";
          }}
        >
          <Camera size={18} strokeWidth={2}/>
          Take Photo
        </button>

        </div>

      </div>

      {/* Right Side */}
      <div className="hero-right">

        <div className="preview-card">

          <div className="preview-grid">

            {/* Handwritten */}
            <div className="preview-box">

              <p className="preview-heading">
                HANDWRITTEN
              </p>

              <div className="fake-line line1"></div>
              <div className="fake-line line2"></div>
              <div className="fake-line line3"></div>
              <div className="fake-line line4"></div>
              <div className="fake-line line5"></div>

            </div>

            {/* Extracted */}
            <div className="preview-box">

              <p className="preview-heading">
                EXTRACTED TEXT
              </p>

              <p className="preview-text">
                Supervised learning uses labelled
                data to map inputs to outputs.
                Split the dataset into training,
                validation and test sets.
              </p>

            </div>

          </div>

          <div className="preview-footer">

            <span className="status-dot"></span>

            Recognition complete • 92% confidence

          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;