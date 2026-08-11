import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Digitise.css";

import {
  Upload,
  Camera,
  Image,
  CameraIcon,
  RefreshCcw,
  X,
  Check,
  AlertCircle,
  Sparkles,
  FileText,
} from "lucide-react";

function Digitise() {
  const navigate = useNavigate();
  // =========================================================
  // Active tab
  // =========================================================

  const [activeTab, setActiveTab] = useState(
    new URLSearchParams(window.location.search).get("mode") ===
      "camera"
      ? "camera"
      : "upload"
  );

  // =========================================================
  // Upload states
  // =========================================================

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  // =========================================================
  // Camera states
  // =========================================================

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] =
    useState("environment");
  const [cameraCount, setCameraCount] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // =========================================================
  // Captured image states
  // =========================================================

  const [capturedImage, setCapturedImage] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [fileName, setFileName] = useState(
    "inkSense-document"
  );

  // =========================================================
  // Gemini / AI states
  // =========================================================

  const [language, setLanguage] = useState("English");

  const [isDigitising, setIsDigitising] =
    useState(false);

  const [digitiseError, setDigitiseError] =
    useState("");

  const [extractedText, setExtractedText] =
    useState("");

  // =========================================================
  // Detect mobile device
  // =========================================================

  useEffect(() => {
    const mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    setIsMobile(mobile);
  }, []);

  // =========================================================
  // Smooth scroll when coming from Home page
  // =========================================================

  useEffect(() => {
    const mode = new URLSearchParams(
      window.location.search
    ).get("mode");

    const timer = setTimeout(() => {
      const element = document.getElementById(
        mode === "camera"
          ? "camera-section"
          : "upload-section"
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  // =========================================================
  // Connect camera stream to video element
  // =========================================================

  useEffect(() => {
    if (
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject =
        streamRef.current;
    }
  }, [cameraActive]);

  // =========================================================
  // Cleanup camera when leaving page
  // =========================================================

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // =========================================================
  // Open file picker
  // =========================================================

  const handleBrowseClick = () => {
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // =========================================================
  // Handle selected image
  // =========================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setDigitiseError("");
    setExtractedText("");

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Please select a JPG, JPEG, or PNG image."
      );

      event.target.value = "";
      return;
    }

    // 10 MB limit
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError(
        "File size exceeds the 10 MB limit. Please choose a smaller image."
      );

      event.target.value = "";
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setSelectedImage({
      file,
      url: imageUrl,
      name: file.name,
    });

    // Allow selecting the same file again
    event.target.value = "";
  };

  // =========================================================
  // Remove selected upload
  // =========================================================

  const removeSelectedImage = () => {
    if (selectedImage?.url) {
      URL.revokeObjectURL(
        selectedImage.url
      );
    }

    setSelectedImage(null);
    setUploadError("");
    setDigitiseError("");
    setExtractedText("");
  };

  // =========================================================
  // Start camera
  // =========================================================

  const startCamera = async (
    facingMode = cameraFacingMode
  ) => {
    setCameraError("");

    try {
      // Stop previous stream
      stopCamera();

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser."
        );

        return;
      }

      const constraints = {
        video: {
          facingMode: {
            ideal: facingMode,
          },
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
          },
        },
        audio: false,
      };

      const stream =
        await navigator.mediaDevices.getUserMedia(
          constraints
        );

      streamRef.current = stream;

      setCameraActive(true);

      // Count available cameras
      try {
        const devices =
          await navigator.mediaDevices.enumerateDevices();

        const videoDevices =
          devices.filter(
            (device) =>
              device.kind === "videoinput"
          );

        setCameraCount(
          videoDevices.length
        );
      } catch {
        setCameraCount(0);
      }

      // Attach stream after render
      setTimeout(() => {
        if (
          videoRef.current &&
          streamRef.current
        ) {
          videoRef.current.srcObject =
            streamRef.current;
        }
      }, 50);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      if (
        error.name === "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access in your browser settings and try again."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        setCameraError(
          "No camera was detected on this device."
        );
      } else if (
        error.name === "NotReadableError"
      ) {
        setCameraError(
          "The camera is currently being used by another application."
        );
      } else {
        setCameraError(
          "Unable to access the camera. Please check your camera settings and try again."
        );
      }

      setCameraActive(false);
    }
  };

  // =========================================================
  // Stop camera
  // =========================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  // =========================================================
  // Click camera preview
  // =========================================================

  const handleCameraPreviewClick = () => {
    if (!cameraActive) {
      startCamera();
    }
  };

  // =========================================================
  // Capture image
  // =========================================================

  const handleCapture = () => {
    if (
      !videoRef.current ||
      !cameraActive
    ) {
      return;
    }

    const video = videoRef.current;

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        "Camera is not ready yet. Please wait a moment and try again."
      );

      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setCameraError(
        "Unable to capture the camera image."
      );

      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData =
      canvas.toDataURL(
        "image/jpeg",
        0.92
      );

    setCapturedImage(imageData);

    setExtractedText("");
    setDigitiseError("");

    stopCamera();

    setFileName(
      "inkSense-document"
    );

    setShowSaveDialog(true);
  };

  // =========================================================
  // Switch mobile camera
  // =========================================================

  const handleSwitchCamera =
    async () => {
      setCameraError("");

      if (!isMobile) {
        setCameraError(
          "Camera switching is available on mobile devices only."
        );

        return;
      }

      if (cameraCount === 1) {
        setCameraError(
          "Only one camera is available on this device."
        );

        return;
      }

      const newFacingMode =
        cameraFacingMode ===
        "environment"
          ? "user"
          : "environment";

      setCameraFacingMode(
        newFacingMode
      );

      await startCamera(
        newFacingMode
      );
    };

  // =========================================================
  // Save captured image
  // =========================================================

  const handleSaveCapturedImage =
    () => {
      if (!capturedImage) {
        return;
      }

      let finalFileName =
        fileName.trim();

      if (!finalFileName) {
        finalFileName =
          "inkSense-document";
      }

      // Remove invalid filename characters
      finalFileName =
        finalFileName.replace(
          /[<>:"/\\|?*]/g,
          "-"
        );

      // Add extension
      if (
        !finalFileName
          .toLowerCase()
          .endsWith(".jpg")
      ) {
        finalFileName += ".jpg";
      }

      const link =
        document.createElement("a");

      link.href = capturedImage;
      link.download =
        finalFileName;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      setShowSaveDialog(false);
    };

  // =========================================================
  // Cancel save dialog
  // =========================================================

  const handleCancelSave = () => {
    setShowSaveDialog(false);
  };

  // =========================================================
  // Change tab
  // =========================================================

  const handleTabChange = (
    tab
  ) => {
    if (tab === activeTab) {
      return;
    }

    // Stop camera when leaving camera tab
    if (tab !== "camera") {
      stopCamera();
    }

    setCameraError("");
    setDigitiseError("");
    setExtractedText("");

    setActiveTab(tab);
  };

  // =========================================================
  // Convert captured image to File
  // =========================================================

  const convertDataUrlToFile =
    async (dataUrl) => {
      const response =
        await fetch(dataUrl);

      const blob =
        await response.blob();

      return new File(
        [blob],
        "inkSense-camera-capture.jpg",
        {
          type: "image/jpeg",
        }
      );
    };

  // =========================================================
  // DIGITISE WITH GEMINI
  // =========================================================

  // =========================================================
// DIGITISE WITH GEMINI + SAVE DOCUMENT
// =========================================================

const handleDigitise = async () => {
  setDigitiseError("");
  setExtractedText("");

  let imageFile = null;

  // =========================================================
  // 1. Get image from Upload tab
  // =========================================================

  if (activeTab === "upload") {
    if (!selectedImage?.file) {
      setDigitiseError(
        "Please select a handwritten image first."
      );

      return;
    }

    imageFile = selectedImage.file;
  }

  // =========================================================
  // 2. Get image from Camera tab
  // =========================================================

  if (activeTab === "camera") {
    if (!capturedImage) {
      setDigitiseError(
        "Please capture a handwritten document first."
      );

      return;
    }

    try {
      const response = await fetch(capturedImage);

      const blob = await response.blob();

      imageFile = new File(
        [blob],
        "inkSense-camera-capture.jpg",
        {
          type: "image/jpeg",
        }
      );
    } catch (error) {
      console.error(
        "Camera image conversion failed:",
        error
      );

      setDigitiseError(
        "Unable to prepare the captured image."
      );

      return;
    }
  }

  // =========================================================
  // Safety check
  // =========================================================

  if (!imageFile) {
    setDigitiseError(
      "Unable to prepare the document image."
    );

    return;
  }

  // =========================================================
  // 3. Start processing
  // =========================================================

  setIsDigitising(true);

  try {

    // =======================================================
    // STEP A — Send image to Gemini
    // =======================================================

    const digitiseFormData = new FormData();

    digitiseFormData.append(
      "image",
      imageFile
    );

    digitiseFormData.append(
      "language",
      language
    );

    console.log(
      "Sending image to InkSense Gemini backend..."
    );

    const digitiseResponse = await fetch(
      "http://127.0.0.1:8000/api/digitize",
      {
        method: "POST",
        body: digitiseFormData,
      }
    );

    // =======================================================
    // Read Gemini response
    // =======================================================

    const digitiseResponseText =
      await digitiseResponse.text();

    console.log(
      "InkSense digitisation response:",
      digitiseResponseText
    );

    let digitiseData;

    try {
      digitiseData = JSON.parse(
        digitiseResponseText
      );
    } catch (error) {
      console.error(
        "Invalid JSON from digitisation endpoint:",
        digitiseResponseText
      );

      throw new Error(
        "Backend returned an invalid digitisation response."
      );
    }

    console.log(
      "Gemini digitisation result:",
      digitiseData
    );

    // =======================================================
    // Check Gemini result
    // =======================================================

    if (
      !digitiseResponse.ok ||
      !digitiseData.success
    ) {
      throw new Error(
        digitiseData.error ||
        "Digitisation failed."
      );
    }

    const extractedText =
      digitiseData.text?.trim() || "";

    if (!extractedText) {
      throw new Error(
        "No handwritten text was detected."
      );
    }

    // =======================================================
    // Show extracted text temporarily
    // =======================================================

    setExtractedText(
      extractedText
    );


    // =======================================================
    // STEP B — Create document title
    // =======================================================

    let documentTitle =
      imageFile.name
        ? imageFile.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[_-]/g, " ")
        : "Untitled Handwritten Document";

    documentTitle =
      documentTitle.trim() ||
      "Untitled Handwritten Document";


    // =======================================================
    // STEP C — Save document to backend
    // =======================================================

    console.log(
      "Saving digitised document..."
    );

    const saveFormData =
      new FormData();

    saveFormData.append(
      "image",
      imageFile
    );

    saveFormData.append(
      "text",
      extractedText
    );

    saveFormData.append(
      "title",
      documentTitle
    );

    saveFormData.append(
      "language",
      language
    );


    const saveResponse =
      await fetch(
        "http://127.0.0.1:8000/api/documents",
        {
          method: "POST",
          body: saveFormData,
        }
      );


    // =======================================================
    // Read save response
    // =======================================================

    const saveResponseText =
      await saveResponse.text();

    console.log(
      "Document save response:",
      saveResponseText
    );


    let saveData;

    try {
      saveData =
        JSON.parse(
          saveResponseText
        );
    } catch (error) {

      console.error(
        "Invalid JSON from document save endpoint:",
        saveResponseText
      );

      throw new Error(
        "Backend returned an invalid document save response."
      );
    }


    // =======================================================
    // Check save result
    // =======================================================

    if (
      !saveResponse.ok ||
      !saveData.success
    ) {
      throw new Error(
        saveData.error ||
        "Unable to save the document."
      );
    }


    const savedDocument =
      saveData.document;


    console.log(
      "Document saved successfully:",
      savedDocument
    );


    // =======================================================
    // STEP D — Navigate to Document Viewer
    // =======================================================

    navigate(
      "/document/new",
      {
        state: {

          title:
            savedDocument?.title ||
            documentTitle,

          text:
            savedDocument?.text ||
            extractedText,

          imageFile:
            imageFile,

          language:
            savedDocument?.language ||
            language,

          type:
            imageFile.type ||
            "image/jpeg",

          date:
            savedDocument?.date ||
            new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),

          documentId:
            savedDocument?.id ||
            null,

          saved:
            true,

        },
      }
    );

  } catch (error) {

    console.error(
      "Digitisation / document save error:",
      error
    );

    setDigitiseError(
      error.message ||
      "Unable to process and save the document."
    );

  } finally {

    setIsDigitising(false);

  }
};

  // =========================================================
  // Render
  // =========================================================

  return (
    <section className="digitise-page">

      {/* =====================================================
          Heading
      ===================================================== */}

      <div className="digitise-header">

        <h1>
          Digitise Handwriting
        </h1>

        <p>
          Upload a handwritten document
          or capture it using your device
          camera.
        </p>

      </div>


      {/* =====================================================
          Tabs
      ===================================================== */}

      <div className="digitise-tabs">

        <button
          className={
            activeTab === "upload"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            handleTabChange(
              "upload"
            )
          }
        >
          Upload Image
        </button>

        <button
          className={
            activeTab === "camera"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            handleTabChange(
              "camera"
            )
          }
        >
          Take Photo
        </button>

      </div>


      {/* =====================================================
          Upload Section
      ===================================================== */}

      {activeTab === "upload" && (

        <div
          id="upload-section"
          className="upload-wrapper"
        >

          {!selectedImage ? (

            <div className="upload-box">

              <div className="upload-icon">
                <Upload size={28} />
              </div>

              <h2>
                Drag and drop your handwritten
                image here
              </h2>

              <p>
                or browse from your device
              </p>

              <button
                className="browse-btn"
                onClick={
                  handleBrowseClick
                }
              >
                Browse Image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={
                  handleFileChange
                }
                className="hidden-file-input"
              />

              <span>
                Supported formats: JPG,
                JPEG, PNG • Maximum file
                size: 10 MB
              </span>

              <h4>
                or use a sample document
              </h4>

              {uploadError && (

                <div className="upload-error">

                  <AlertCircle size={17} />

                  <span>
                    {uploadError}
                  </span>

                </div>

              )}

            </div>

          ) : (

            <div className="selected-image-container">

              <div className="selected-image-header">

                <div>

                  <p className="selected-image-label">
                    SELECTED DOCUMENT
                  </p>

                  <h3>
                    {selectedImage.name}
                  </h3>

                </div>

                <button
                  className="remove-image-btn"
                  onClick={
                    removeSelectedImage
                  }
                  title="Remove image"
                >
                  <X size={18} />
                </button>

              </div>


              <div className="selected-image-preview">

                <img
                  src={
                    selectedImage.url
                  }
                  alt="Selected handwritten document"
                />

              </div>


              <div className="selected-image-actions">

                <button
                  className="browse-btn"
                  onClick={
                    handleBrowseClick
                  }
                >
                  Choose Another Image
                </button>

                <p>
                  Image selected
                  successfully. Ready for
                  digitisation.
                </p>

              </div>


              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={
                  handleFileChange
                }
                className="hidden-file-input"
              />

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          Camera Section
      ===================================================== */}

      {activeTab === "camera" && (

        <div
          id="camera-section"
          className="camera-wrapper"
        >

          <div
            className={
              cameraActive
                ? "camera-preview camera-active"
                : "camera-preview"
            }
            onClick={
              !cameraActive
                ? handleCameraPreviewClick
                : undefined
            }
          >

            {cameraActive ? (

              <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
              />

            ) : capturedImage ? (

              <div className="captured-preview-container">

                <img
                  src={capturedImage}
                  alt="Captured handwritten document"
                  className="captured-preview-image"
                />

                <button
                  className="retake-btn"
                  onClick={() => {
                    setCapturedImage(
                      null
                    );
                    setExtractedText(
                      ""
                    );
                    setDigitiseError(
                      ""
                    );
                    startCamera();
                  }}
                >
                  <Camera size={17} />
                  Retake Photo
                </button>

              </div>

            ) : (

              <div className="camera-placeholder">

                <Camera size={30} />

                <h3>
                  Camera preview
                </h3>

                <p>
                  Click here to allow
                  camera access and
                  start the camera.
                </p>

              </div>

            )}

          </div>


          {/* Camera error */}

          {cameraError && (

            <div className="camera-error">

              <AlertCircle size={18} />

              <span>
                {cameraError}
              </span>

            </div>

          )}


          {/* Camera buttons */}

          <div className="camera-buttons">

            <button
              className="capture-btn"
              onClick={
                handleCapture
              }
              disabled={
                !cameraActive
              }
            >
              <CameraIcon size={18} />
              Capture
            </button>

            <button
              className="switch-btn"
              onClick={
                handleSwitchCamera
              }
              disabled={
                !cameraActive
              }
            >
              <RefreshCcw size={18} />
              Switch Camera
            </button>

          </div>


          <p className="camera-tip">

            {cameraActive
              ? "Position your handwritten document clearly inside the camera view."
              : "Place the document on a flat surface with good lighting."}

          </p>

        </div>

      )}


        {/* =====================================================
            AI Digitisation Panel
        ===================================================== */}

        {(selectedImage ||
          capturedImage) && (

          <div className="ai-digitise-panel">

            <div className="ai-controls">

              {/* ==============================
                  Language Selection
              ============================== */}

              <div className="language-control">

                <label htmlFor="language">
                  Document Language
                </label>

                <select
                  id="language"
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value)
                  }
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Tamil">
                    Tamil
                  </option>

                  <option value="English and Tamil">
                    English + Tamil
                  </option>
                </select>

              </div>


              {/* ==============================
                  Digitise With AI
              ============================== */}

              <button
                type="button"
                className="digitise-ai-btn"
                onClick={handleDigitise}
                disabled={isDigitising}
              >

                <Sparkles size={18} />

                {isDigitising
                  ? "Digitising..."
                  : "Digitise with AI"}

              </button>

            </div>


            {/* ==============================
                AI Error
            ============================== */}

            {digitiseError && (

              <div className="digitise-error">

                <AlertCircle size={18} />

                <span>
                  {digitiseError}
                </span>

              </div>

            )}

          </div>
      )}


      {/* ==========================
    Extracted Text
========================== */}

{extractedText && (

  <div className="gemini-result">

    <div className="result-card">

      <div className="result-card-heading">

        <FileText size={19} />

        <h3>
          Extracted Text
        </h3>

      </div>

      <div className="transcription-content">

        {extractedText}

      </div>

    </div>

  </div>

)}


      {/* =====================================================
          Save Captured Image Dialog
      ===================================================== */}

      {showSaveDialog && (

        <div className="save-dialog-overlay">

          <div className="save-dialog">

            <button
              className="save-dialog-close"
              onClick={
                handleCancelSave
              }
            >
              <X size={18} />
            </button>


            <div className="save-dialog-icon">

              <Image size={24} />

            </div>


            <h2>
              Save Captured Image
            </h2>

            <p>
              Give your captured document
              a name before saving it.
            </p>


            <label htmlFor="file-name">
              File name
            </label>

            <input
              id="file-name"
              type="text"
              value={fileName}
              onChange={(event) =>
                setFileName(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  handleSaveCapturedImage();
                }
              }}
              autoFocus
              placeholder="Enter file name"
            />

            <span className="file-extension">
              .jpg
            </span>


            <div className="save-dialog-buttons">

              <button
                className="cancel-save-btn"
                onClick={
                  handleCancelSave
                }
              >
                Cancel
              </button>

              <button
                className="confirm-save-btn"
                onClick={
                  handleSaveCapturedImage
                }
              >
                <Check size={17} />
                Save Image
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default Digitise;