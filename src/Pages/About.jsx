import {
  FileText,
  Brain,
  Edit3,
  Search,
  Users,
  GraduationCap,
  FlaskConical,
  Briefcase,
  Camera,
  ScanText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-eyebrow">
            ABOUT INKSENSE AI
          </span>

          <h1>
            Turning Handwriting Into
            <span> Digital Intelligence</span>
          </h1>

          <p>
            InkSense AI is an intelligent handwriting digitisation platform
            designed to transform handwritten notes and documents into
            editable, searchable, and reusable digital content.
          </p>

        </div>

        <div className="about-hero-card">

          <div className="hero-card-icon">
            <Sparkles size={24} />
          </div>

          <h3>
            From Paper to Digital
          </h3>

          <p>
            Capture handwritten information, process it with AI-powered
            recognition, and turn it into usable digital documents.
          </p>

          <div className="hero-flow">

            <div>
              <FileText size={18} />
              <span>Handwriting</span>
            </div>

            <ArrowRight size={18} />

            <div>
              <Brain size={18} />
              <span>AI Processing</span>
            </div>

            <ArrowRight size={18} />

            <div>
              <Edit3 size={18} />
              <span>Digital Text</span>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHAT IS INKSENSE
      ========================= */}

      <section className="about-section">

        <div className="section-heading">

          <span>WHAT IS INKSENSE AI?</span>

          <h2>
            Making handwritten information easier to use
          </h2>

          <p>
            Handwritten notes remain an important part of education,
            research, business, and everyday documentation. However,
            manually converting those notes into digital documents can
            be time-consuming and prone to errors.
          </p>

          <p>
            InkSense AI provides a streamlined handwriting-to-text workflow.
            Users can upload a handwritten image or capture a document
            using a camera, allowing the platform to process the content
            and generate editable digital text.
          </p>

        </div>


        <div className="about-feature-grid">

          <div className="about-feature-card">

            <div className="feature-icon">
              <FileText size={22} />
            </div>

            <h3>
              Handwriting Digitisation
            </h3>

            <p>
              Convert handwritten documents into structured digital text
              without manually retyping every page.
            </p>

          </div>


          <div className="about-feature-card">

            <div className="feature-icon">
              <Brain size={22} />
            </div>

            <h3>
              AI-Powered Recognition
            </h3>

            <p>
              Analyse captured handwriting and recognise written content
              using intelligent document processing.
            </p>

          </div>


          <div className="about-feature-card">

            <div className="feature-icon">
              <Edit3 size={22} />
            </div>

            <h3>
              Editable Documents
            </h3>

            <p>
              Review, correct, copy, save, and download recognised
              handwriting as usable digital content.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          WHY INKSENSE
      ========================= */}

      <section className="about-section">

        <div className="section-heading">

          <span>WHY INKSENSE AI?</span>

          <h2>
            Designed to make handwriting more accessible
          </h2>

          <p>
            InkSense AI focuses on reducing the gap between physical
            handwriting and modern digital workflows.
          </p>

        </div>


        <div className="benefits-grid">

          <div className="benefit-card">

            <Search size={22} />

            <div>
              <h3>
                Reduce Manual Transcription
              </h3>

              <p>
                Minimise the time spent manually typing handwritten notes
                into digital documents.
              </p>
            </div>

          </div>


          <div className="benefit-card">

            <FileText size={22} />

            <div>
              <h3>
                Create Digital Records
              </h3>

              <p>
                Turn physical notes into editable digital records that
                are easier to organise and maintain.
              </p>
            </div>

          </div>


          <div className="benefit-card">

            <Search size={22} />

            <div>
              <h3>
                Searchable Information
              </h3>

              <p>
                Make handwritten information easier to search, reference,
                and reuse.
              </p>
            </div>

          </div>


          <div className="benefit-card">

            <Edit3 size={22} />

            <div>
              <h3>
                Flexible Editing
              </h3>

              <p>
                Review and correct recognised text before saving or
                exporting your digital document.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHO CAN USE
      ========================= */}

      <section className="about-section users-section">

        <div className="section-heading centered">

          <span>WHO CAN USE INKSENSE AI?</span>

          <h2>
            Built for people who work with handwritten information
          </h2>

        </div>


        <div className="users-grid">

          <div className="user-card">

            <div className="user-icon">
              <GraduationCap size={23} />
            </div>

            <h3>
              Students
            </h3>

            <p>
              Digitise lecture notes, assignments, study material,
              and handwritten records.
            </p>

          </div>


          <div className="user-card">

            <div className="user-icon">
              <FlaskConical size={23} />
            </div>

            <h3>
              Researchers
            </h3>

            <p>
              Convert handwritten observations, research notes,
              and field documentation into digital content.
            </p>

          </div>


          <div className="user-card">

            <div className="user-icon">
              <Briefcase size={23} />
            </div>

            <h3>
              Professionals
            </h3>

            <p>
              Transform handwritten meeting notes, records,
              and documents into editable digital files.
            </p>

          </div>


          <div className="user-card">

            <div className="user-icon">
              <Users size={23} />
            </div>

            <h3>
              Organisations
            </h3>

            <p>
              Reduce manual transcription and improve digital
              document workflows.
            </p>

          </div>

        </div>

      </section>



    </main>
  );
}

export default About;