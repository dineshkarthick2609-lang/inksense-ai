import "./WorkflowSection.css";
import { ArrowRight } from "lucide-react";

function WorkflowSection() {
  return (
    <section className="workflow-section">

      <p className="workflow-tag">
        HOW IT WORKS
      </p>

      <div className="workflow-container">

        <div className="workflow-card">
          <span className="step">Step 1</span>
          <h4>Upload or Capture</h4>
        </div>

        <ArrowRight className="workflow-arrow" size={22} />

        <div className="workflow-card">
          <span className="step">Step 2</span>
          <h4>Digitise</h4>
        </div>

        <ArrowRight className="workflow-arrow" size={22} />

        <div className="workflow-card">
          <span className="step">Step 3</span>
          <h4>Edit</h4>
        </div>

        <ArrowRight className="workflow-arrow" size={22} />

        <div className="workflow-card">
          <span className="step">Step 4</span>
          <h4>Save</h4>
        </div>

      </div>

      <p className="workflow-footer">
        Already digitised something?
        <span> View your documents.</span>
      </p>

    </section>
  );
}

export default WorkflowSection;