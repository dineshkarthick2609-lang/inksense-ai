  import "./Documents.css";
  import { Search, FileText, Download, Trash2, FolderOpen } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { useState } from "react";

  function Documents() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const documents = [
      {
        id: 1,
        title: "Machine Learning — Lecture Notes",
        description:
          "Machine Learning — Lecture Notes Supervised learning uses labelled data to map inputs to outputs. Two common...",
        date: "28 Jul 2026",
        type: "PNG",
        status: "Digitised",
      },
      {
        id: 2,
        title: "Machine Learning Notes",
        description:
          "Machine Learning — Lecture Notes Supervised learning uses labelled data to map inputs to outputs. Two common...",
        date: "21 Jul 2026",
        type: "PNG",
        status: "Digitised",
      },
      {
        id: 3,
        title: "Project Meeting Notes",
        description:
          "Meeting notes — 18 July Discussed the clip-on capture device and the image pipeline...",
        date: "18 Jul 2026",
        type: "JPG",
        status: "Digitised",
      },
      {
        id: 4,
        title: "Assignment Draft",
        description:
          "Assignment draft — handwriting recognition literature review...",
        date: "12 Jul 2026",
        type: "JPEG",
        status: "Draft",
      },
      {
        id: 5,
        title: "Daily Study Notes",
        description:
          "Daily study notes — revised linear algebra, eigenvalues and singular value decomposition...",
        date: "06 Jul 2026",
        type: "PNG",
        status: "Digitised",
      },
    ];

    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <section className="documents-page">

        {/* Header */}

        <div className="documents-header">

          <div>

            <h1>My Documents</h1>

            <p>
              View and manage previously digitised handwritten documents.
            </p>

          </div>

          {/* <button
            className="newscan-btn"
            onClick={() => navigate("/digitise")}
          >
            New Scan
          </button> */}

        </div>

        {/* Search */}

        <div className="documents-toolbar">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search documents"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select>

            <option>Newest first</option>

            <option>Oldest first</option>

          </select>

        </div>

        {/* Cards */}

        <div className="documents-list">

          {filtered.map((doc) => (

            <div className="document-card" key={doc.id}>

              {/* Thumbnail */}

            <div className="document-thumb">
      <FileText size={32} />
  </div>

              {/* Info */}

              <div className="document-info">

                <h3>{doc.title}</h3>

                <p>{doc.description}</p>

                <div className="document-tags">

                  <span>{doc.date}</span>

                  <span>{doc.type}</span>

                  <span>{doc.status}</span>

                </div>

              </div>

              {/* Actions */}

              <div className="document-actions">

                <button
    className="open-btn"
    onClick={() => navigate(`/document/${doc.id}`)}
  >
    <FolderOpen size={18} />
    Open
  </button>

                <button>

                  <Download size={18} />

                  Download

                </button>

                <button className="delete-btn">

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

            </div>

          ))}

        </div>

      </section>
    );
  }

  export default Documents;