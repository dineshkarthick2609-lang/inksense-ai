import "./FeatureSection.css";
import {
  UploadCloud,
  ScanText,
  FileText,
} from "lucide-react";

function FeatureSection() {
  return (
    <section className="feature-section">

      {/* Card 1 */}

      <div className="feature-card">

        <div className="feature-header">
          <div className="feature-icon">
            <UploadCloud size={22} strokeWidth={2} />
          </div>

          <h3>Upload or Capture</h3>
        </div>

        <p>
          Upload handwritten notes or capture them instantly using your
          camera.
        </p>

      </div>

      {/* Card 2 */}

      <div className="feature-card">

        <div className="feature-header">
          <div className="feature-icon">
            <ScanText size={22} strokeWidth={2} />
          </div>

          <h3>AI Recognition</h3>
        </div>

        <p>
          Convert handwritten content into editable digital text with high
          accuracy.
        </p>

      </div>

      {/* Card 3 */}

      <div className="feature-card">

        <div className="feature-header">
          <div className="feature-icon">
            <FileText size={22} strokeWidth={2} />
          </div>

          <h3>Edit & Export</h3>
        </div>

        <p>
          Review, edit, copy and export your digitised notes in multiple
          formats.
        </p>

      </div>

    </section>
  );
}

export default FeatureSection;