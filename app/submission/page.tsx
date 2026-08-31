"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaPhone, FaSpinner, FaPlus, FaTimes, FaUserPlus, FaUser, FaCheck, FaUniversity, FaSearch, FaChevronDown, FaPlusCircle, FaFilePdf, FaEye, FaDownload, FaSync, FaList, FaExclamationTriangle, FaFolderOpen, FaFileAlt, FaMapMarkerAlt, FaMicrophone, FaImage, FaCity } from "react-icons/fa";

export default function AbstractSubmissionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("submit");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sucs, setSucs] = useState<any[]>([]);
  const [newCoAuthor, setNewCoAuthor] = useState("");
  const [showCustomAgency, setShowCustomAgency] = useState(false);
  const [customAgency, setCustomAgency] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [pdfViewerUrl, setPdfViewerUrl] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Search state for university/agency
  const [agencySearch, setAgencySearch] = useState("");
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const agencyDropdownRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    selected_track: "",
    specific_track: "",
    research_title: "",
    author: "",
    co_authors: [] as string[],
    presenter: "",
    email_address: "",
    university_agency: "",
    address: "",
    phone_number: "",
    presentation_type: "",
    city_tour_option: "",
    abstract: "",
    keywords: ""
  });

  // Track data with specific sub-tracks
  const trackData = {
    "Track 1 – Agriculture, Animal": [
      "Crop science and sustainable crop production",
      "Animal science and livestock production",
      "Soil science and crop protection",
      "Agricultural and aquatic biotechnology",
      "Sustainable production systems"
    ],
    "Track 2 – Life, Biological, and Biotechnology Sciences": [
      "Molecular biology and biotechnology",
      "Genetics and genomics",
      "Microbiology",
      "Ecology and biodiversity",
      "Plant, animal, and aquatic biology",
      "Genetic resources and conservation"
    ],
    "Track 3 – Bioresource, Fisheries, Marine, and Environmental Sciences": [
      "Marine and coastal ecosystems",
      "Marine biodiversity and conservation",
      "Fisheries resource management",
      "Aquatic and marine bioresources",
      "Natural resource management",
      "Forestry and agroforestry",
      "Climate change and resilience",
      "Environmental science",
      "Circular bioeconomy",
      "Fisheries and aquaculture",
      "Aquatic animal health and nutrition"
    ],
    "Track 4 – Food, Nutrition, and One Health": [
      "Food science and technology",
      "Food safety and quality",
      "Nutrition",
      "One Health",
      "Plant, animal, and aquatic health",
      "Sustainable food systems",
      "Seafood safety and processing"
    ],
    "Track 5 – Innovation, Economics, and Sustainable Development": [
      "Agricultural and fisheries economics",
      "Extension and communication",
      "Rural and coastal community development",
      "Agribusiness and entrepreneurship",
      "Digital and precision agriculture",
      "Smart farming and aquaculture",
      "Artificial intelligence and emerging technologies",
      "Policy, governance, and sustainable development"
    ]
  };

  // Fetch SUCs on mount
  useEffect(() => {
    const fetchSUCs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sucs");
        const data = await res.json();
        setSucs(data);
      } catch (error) {
        console.error("Failed to fetch SUCs", error);
      }
    };
    fetchSUCs();
  }, []);

  // Fetch user's submissions
  const fetchMySubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const userId = user.id;
      
      const res = await fetch(`http://localhost:5000/api/my-submissions/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMySubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions", error);
    } finally {
      setSubmissionsLoading(false);
    }
  }, []);

  // Fetch submissions when tab changes to "submissions"
  useEffect(() => {
    if (activeTab === "submissions") {
      fetchMySubmissions();
    }
  }, [activeTab, fetchMySubmissions]);

  const generatePreview = useCallback(async (data: any) => {
      // Check if all required fields are filled
      const requiredFields = [
        'selected_track', 'specific_track', 'research_title', 'author', 
        'presenter', 'email_address', 'university_agency', 'address',
        'presentation_type', 'city_tour_option', 'abstract', 'keywords'
      ];
      
      const isComplete = requiredFields.every(field => data[field]?.trim());
      
      if (!isComplete) {
        setPreviewUrl("");
        setPreviewGenerated(false);
        return;
      }

      setPreviewLoading(true);

      try {
        // Join co-authors with comma
        const coAuthorsString = data.co_authors.join(", ");

        const submissionData = {
          ...data,
          co_author: coAuthorsString,
          co_authors: undefined
        };

        const res = await fetch("http://localhost:5000/api/abstracts/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // No Authorization header needed
          },
          body: JSON.stringify(submissionData)
        });

        if (res.ok) {
          const result = await res.json();
          setPreviewUrl(result.preview_url);
          setPreviewGenerated(true);
        }
      } catch (error) {
        console.error("Error generating preview", error);
      } finally {
        setPreviewLoading(false);
      }
    }, []);

  // Auto-generate preview when keywords are filled
  useEffect(() => {
    if (formData.keywords.trim() && 
        formData.selected_track && 
        formData.specific_track && 
        formData.research_title && 
        formData.author && 
        formData.presenter && 
        formData.email_address && 
        formData.university_agency &&
        formData.address &&
        formData.presentation_type &&
        formData.city_tour_option &&
        formData.abstract) {
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        generatePreview(formData);
      }, 1500); // Wait 1.5 seconds after typing stops
    }
  }, [formData, generatePreview]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (agencyDropdownRef.current && !agencyDropdownRef.current.contains(event.target as Node)) {
        setAgencyDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter agencies based on search
  const filteredAgencies = sucs.filter(suc => 
    suc.name.toLowerCase().includes(agencySearch.toLowerCase()) ||
    suc.abbreviation?.toLowerCase().includes(agencySearch.toLowerCase()) ||
    suc.region?.toLowerCase().includes(agencySearch.toLowerCase())
  );

  // Input handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    // If selected_track changes, reset specific_track and preview
    if (name === "selected_track") {
      setFormData({ ...formData, selected_track: value, specific_track: "" });
      setPreviewGenerated(false);
      setPreviewUrl("");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Get specific tracks for the selected track
  const getSpecificTracks = () => {
    if (!formData.selected_track) return [];
    return trackData[formData.selected_track as keyof typeof trackData] || [];
  };

  // Co-author management
  const addCoAuthor = () => {
    if (newCoAuthor.trim() === "") return;
    
    // Check if author already exists
    if (formData.co_authors.includes(newCoAuthor.trim())) {
      alert("This co-author is already added.");
      return;
    }
    
    setFormData({
      ...formData,
      co_authors: [...formData.co_authors, newCoAuthor.trim()]
    });
    setNewCoAuthor("");
  };

  const removeCoAuthor = (index: number) => {
    const updatedCoAuthors = formData.co_authors.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      co_authors: updatedCoAuthors
    });
  };

  // Handle Enter key to add co-author
  const handleCoAuthorKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCoAuthor();
    }
  };

  // Agency selection handlers
  const selectAgency = (agencyName: string) => {
    setSelectedAgency(agencyName);
    setFormData({ ...formData, university_agency: agencyName });
    setShowCustomAgency(false);
    setAgencyDropdownOpen(false);
    setAgencySearch("");
  };

  const handleAddCustomAgency = () => {
    setShowCustomAgency(true);
    setAgencyDropdownOpen(false);
    setAgencySearch("");
    setSelectedAgency("");
    setFormData({ ...formData, university_agency: "" });
  };

  // Manual preview generation button handler
  const handleManualPreview = () => {
    generatePreview(formData);
  };

  // View submission details
  const viewSubmission = (submission: any) => {
    setViewingSubmission(submission);
    setShowSubmissionModal(true);
    // If there's a view URL, set it as PDF viewer URL
    if (submission.abstract_drive_view_url) {
      setPdfViewerUrl(submission.abstract_drive_view_url);
    }
  };

  const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Get the JWT token and user from localStorage
        const token = localStorage.getItem("access_token");
        const userStr = localStorage.getItem("user");
        
        if (!token) {
          router.push("/login");
          return;
        }
        
        // Parse user data to get the ID
        let userId = null;
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.id;
          } catch (error) {
            console.error("Error parsing user data", error);
          }
        }

        // Determine the final university_agency value
        let finalAgency = formData.university_agency;
        if (showCustomAgency && customAgency.trim()) {
          finalAgency = customAgency.trim();
        }

        // Join co-authors with comma
        const coAuthorsString = formData.co_authors.join(", ");

        // Prepare data for submission
        const submissionData = {
          ...formData,
          university_agency: finalAgency,
          co_author: coAuthorsString,
          co_authors: undefined,
          sender_id: userId
        };

        const res = await fetch("http://localhost:5000/api/abstracts/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData)
        });

        if (res.ok) {
          const data = await res.json();
          setSubmittedData(data);
          setShowSuccessModal(true);
          setLoading(false); // Stop loading immediately
          
          // Close success modal after 2 seconds
          setTimeout(() => {
            setShowSuccessModal(false);
            setActiveTab("submissions"); // Switch to My Submissions tab
            fetchMySubmissions(); // Refresh submissions list
          }, 2000);
        } else {
          const errorData = await res.json();
          setLoading(false);
          alert(errorData.detail || "Submission failed.");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error submitting abstract", error);
        alert("Failed to connect to the server.");
      }
    };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Google Drive PDF Viewer Component
  const GoogleDriveViewer = ({ url }: { url: string }) => {
      const [embedUrl, setEmbedUrl] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);

      useEffect(() => {
          // Extract file ID from Google Drive URL
          const extractFileId = (driveUrl: string) => {
              const patterns = [
                  /\/d\/([a-zA-Z0-9_-]+)/,
                  /id=([a-zA-Z0-9_-]+)/,
                  /open\?id=([a-zA-Z0-9_-]+)/,
                  /\/file\/d\/([a-zA-Z0-9_-]+)/,
                  /([a-zA-Z0-9_-]{25,})/
              ];

              for (let pattern of patterns) {
                  const match = driveUrl.match(pattern);
                  if (match && match[1]) {
                      return match[1].split('?')[0].split('&')[0];
                  }
              }
              return null;
          };

          if (url) {
              const fileId = extractFileId(url);
              if (fileId) {
                  // Use the preview endpoint for embedding
                  setEmbedUrl(`https://drive.google.com/file/d/${fileId}/preview`);
                  setLoading(false);
                  setError(false);
              } else {
                  setError(true);
                  setLoading(false);
              }
          }
      }, [url]);

      if (loading) {
          return (
              <div className="flex flex-col items-center justify-center h-125 text-center">
                  <FaSpinner className="animate-spin text-3xl text-[#0A2540] mb-4" />
                  <p className="text-zinc-500">Loading PDF...</p>
              </div>
          );
      }

      if (error) {
          return (
              <div className="flex flex-col items-center justify-center h-125 text-center">
                  <FaFilePdf className="text-5xl text-zinc-300 mb-4" />
                  <p className="text-zinc-500">Unable to load PDF</p>
                  <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#143b66]"
                  >
                      <FaEye /> Open in New Tab
                  </a>
              </div>
          );
      }

      return (
          <div className="relative w-full h-125">
              <iframe
                  src={embedUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title="Abstract PDF"
                  allow="autoplay; fullscreen"
                  allowFullScreen
              />
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540] flex flex-col">
      <Header />

      {/* Preview Modal */}
      {showPreviewModal && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#0A2540] flex items-center gap-2">
                <FaFilePdf className="text-red-500" /> PDF Preview
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="bg-zinc-100 rounded-lg p-4 max-h-[70vh] overflow-y-auto">
              <iframe
                src={previewUrl}
                className="w-full h-150 border-0"
                title="PDF Preview"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <a
                href={previewUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#143b66]"
              >
                <FaDownload /> Download PDF
              </a>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal with PDF Viewer */}
      {showSubmissionModal && viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSubmissionModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#0A2540] flex items-center gap-2">
                <FaFolderOpen className="text-[#0A2540]" /> Submission Details
              </h3>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Submission Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Research Title</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.research_title}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Authors</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.author}{viewingSubmission.co_author ? `, ${viewingSubmission.co_author}` : ''}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Presenter</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.presenter}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Email</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.email_address}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">University/Agency</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.university_agency}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Address</h4>
                  <p className="text-[#0A2540] flex items-center gap-2">
                    <FaMapMarkerAlt className="text-zinc-400 text-xs" />
                    {viewingSubmission.address}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Phone Number</h4>
                  <p className="text-[#0A2540] flex items-center gap-2">
                    <FaPhone className="text-zinc-400 text-xs" />
                    {viewingSubmission.phone_number}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Presentation Type</h4>
                  <p className="text-[#0A2540] flex items-center gap-2">
                    {viewingSubmission.presentation_type === 'oral' ? (
                      <FaMicrophone className="text-[#0A2540] text-xs" />
                    ) : (
                      <FaImage className="text-[#0A2540] text-xs" />
                    )}
                    {viewingSubmission.presentation_type === 'oral' ? 'Oral Presentation' : 'Poster Presentation'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">City Tour/Boracay Transfer</h4>
                  <p className="text-[#0A2540] flex items-center gap-2">
                    <FaCity className="text-zinc-400 text-xs" />
                    {viewingSubmission.city_tour_option === 'option1' ? 'Option 1 (City Tour Only)' : 'Option 2 (City tour, and Boracay Transfer)'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Track</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.selected_track}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Sub-Track</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.specific_track}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingSubmission.status)}`}>
                    {viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Abstract</h4>
                  <p className="text-[#0A2540] whitespace-pre-wrap">{viewingSubmission.abstract}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Keywords</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.keywords}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Submission Date</h4>
                  <p className="text-[#0A2540]">{viewingSubmission.created_at}</p>
                </div>
              </div>
              
              {/* Right Column - PDF Viewer */}
              <div className="bg-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-zinc-500 mb-3 flex items-center gap-2">
                      <FaFileAlt className="text-[#0A2540]" /> Abstract PDF
                  </h4>
                  
                  {pdfViewerUrl ? (
                      <GoogleDriveViewer url={pdfViewerUrl} />
                  ) : (
                      <div className="flex flex-col items-center justify-center h-125 text-center">
                          <FaFilePdf className="text-5xl text-zinc-300 mb-4" />
                          <p className="text-zinc-500">No PDF file available for this submission.</p>
                      </div>
                  )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
                {viewingSubmission.abstract_drive_view_url && (
                    <a
                        href={viewingSubmission.abstract_drive_view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#143b66]"
                    >
                        <FaEye /> Open in New Tab
                    </a>
                )}
                {viewingSubmission.abstract_download_url && (
                    <a
                        href={viewingSubmission.abstract_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300"
                    >
                        <FaDownload /> Download PDF
                    </a>
                )}
                <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300"
                >
                    Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-3">Submission Successful!</h2>
            <p className="text-zinc-600 mb-4">Your abstract has been submitted successfully.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Status:</span> {submittedData.status}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <FaSpinner className="animate-spin" />
              Redirecting to My Submissions...
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0A2540] mb-4">Abstract Submission</h1>
          <div className="w-16 h-1 bg-[#D5A54D] mx-auto mb-6"></div>
          <p className="text-zinc-600">Submit your abstract and track your submissions.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-1 flex gap-1">
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "submit"
                  ? "bg-[#0A2540] text-white"
                  : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <FaPaperPlane className="inline-block mr-2" />
              Submit Abstract
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "submissions"
                  ? "bg-[#0A2540] text-white"
                  : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <FaList className="inline-block mr-2" />
              My Submissions
            </button>
          </div>
        </div>

        {activeTab === "submit" ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 space-y-6">
            
            {/* Track Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Selected Track *</label>
                <select name="selected_track" value={formData.selected_track} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]">
                  <option value="">Select a track</option>
                  <option value="Track 1 – Agriculture, Animal">Track 1 – Agriculture, Animal</option>
                  <option value="Track 2 – Life, Biological, and Biotechnology Sciences">Track 2 – Life, Biological, and Biotechnology Sciences</option>
                  <option value="Track 3 – Bioresource, Fisheries, Marine, and Environmental Sciences">Track 3 – Bioresource, Fisheries, Marine, and Environmental Sciences</option>
                  <option value="Track 4 – Food, Nutrition, and One Health">Track 4 – Food, Nutrition, and One Health</option>
                  <option value="Track 5 – Innovation, Economics, and Sustainable Development">Track 5 – Innovation, Economics, and Sustainable Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Specific Track / Sub-theme *</label>
                <select 
                  name="specific_track" 
                  value={formData.specific_track} 
                  onChange={handleChange} 
                  required
                  disabled={!formData.selected_track}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540] disabled:bg-zinc-100 disabled:cursor-not-allowed">
                  <option value="">
                    {formData.selected_track ? "Select a specific track" : "Select a track first"}
                  </option>
                  {getSpecificTracks().map((track, index) => (
                    <option key={index} value={track}>{track}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presentation Type */}
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Presentation Preference *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, presentation_type: "oral" })}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                    formData.presentation_type === "oral"
                      ? "border-[#0A2540] bg-[#0A2540]/5"
                      : "border-zinc-200 hover:border-[#0A2540]/50"
                  }`}
                >
                  <FaMicrophone className={`text-2xl ${formData.presentation_type === "oral" ? "text-[#0A2540]" : "text-zinc-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#0A2540]">Oral Presentation</p>
                    <p className="text-xs text-zinc-500">Present your research through a live presentation</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, presentation_type: "poster" })}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                    formData.presentation_type === "poster"
                      ? "border-[#0A2540] bg-[#0A2540]/5"
                      : "border-zinc-200 hover:border-[#0A2540]/50"
                  }`}
                >
                  <FaImage className={`text-2xl ${formData.presentation_type === "poster" ? "text-[#0A2540]" : "text-zinc-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#0A2540]">Poster Presentation</p>
                    <p className="text-xs text-zinc-500">Present your research through a poster</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Research Title */}
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Research Title *</label>
              <input type="text" name="research_title" value={formData.research_title} onChange={handleChange} required
                placeholder="Enter the full research title"
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]" />
            </div>

            {/* Author Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Author *</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} required
                  placeholder="e.g., Dela Cruz, Juan"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Presenter *</label>
                <input type="text" name="presenter" value={formData.presenter} onChange={handleChange} required
                  placeholder="e.g., Dela Cruz, Juan"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]" />
              </div>
            </div>

            {/* Co-Authors Section */}
            <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaUserPlus className="text-[#0A2540] text-sm" />
                  <label className="text-sm font-semibold text-[#0A2540]">Co-Authors</label>
                </div>
                <span className="text-xs text-zinc-400">
                  {formData.co_authors.length} {formData.co_authors.length === 1 ? 'author' : 'authors'} added
                </span>
              </div>
              
              {/* Single input for adding co-author */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-zinc-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    value={newCoAuthor}
                    onChange={(e) => setNewCoAuthor(e.target.value)}
                    onKeyPress={handleCoAuthorKeyPress}
                    placeholder="Enter co-author name (e.g., Santos, Maria)"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                  />
                </div>
                <button
                  type="button"
                  onClick={addCoAuthor}
                  disabled={!newCoAuthor.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#0A2540] hover:bg-[#143b66] rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  <FaPlus className="text-xs" /> Add
                </button>
              </div>
              
              {/* Display added co-authors as chips */}
              {formData.co_authors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.co_authors.map((coAuthor, index) => (
                    <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full shadow-sm">
                      <FaUser className="text-zinc-400 text-xs" />
                      <span className="text-sm text-[#0A2540]">{coAuthor}</span>
                      <button
                        type="button"
                        onClick={() => removeCoAuthor(index)}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove co-author"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm text-zinc-400">No co-authors added yet</p>
                </div>
              )}
            </div>

            {/* Email & Agency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Email Address *</label>
                <input type="email" name="email_address" value={formData.email_address} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">University / Agency *</label>
                <div className="relative" ref={agencyDropdownRef}>
                  {/* Search input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-zinc-400 text-sm" />
                    </div>
                    <input
                      type="text"
                      value={showCustomAgency ? customAgency : (selectedAgency || agencySearch)}
                      onChange={(e) => {
                        if (showCustomAgency) {
                          setCustomAgency(e.target.value);
                        } else {
                          setAgencySearch(e.target.value);
                          setSelectedAgency("");
                          setFormData({ ...formData, university_agency: "" });
                          setAgencyDropdownOpen(true);
                        }
                      }}
                      onFocus={() => {
                        if (!showCustomAgency) {
                          setAgencyDropdownOpen(true);
                        }
                      }}
                      placeholder={showCustomAgency ? "Enter University/Agency name" : "Search University/Agency..."}
                      required
                      className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                    />
                    <button
                      type="button"
                      onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#0A2540]"
                    >
                      <FaChevronDown className={`transition-transform ${agencyDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Dropdown */}
                  {agencyDropdownOpen && !showCustomAgency && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {/* Search results */}
                      {filteredAgencies.length > 0 ? (
                        filteredAgencies.map((suc) => (
                          <button
                            key={suc.id}
                            type="button"
                            onClick={() => selectAgency(suc.name)}
                            className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="text-sm font-medium text-[#0A2540]">{suc.name}</div>
                              <div className="text-xs text-zinc-500">
                                {suc.abbreviation && <span className="mr-2">{suc.abbreviation}</span>}
                                {suc.region && <span>{suc.region}</span>}
                              </div>
                            </div>
                            <FaCheck className="text-green-500 text-xs" />
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3">
                          <p className="text-sm text-zinc-500 mb-2">No results found for "{agencySearch}"</p>
                          <button
                            type="button"
                            onClick={handleAddCustomAgency}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2540] hover:text-[#143b66]"
                          >
                            <FaPlusCircle className="text-xs" /> Add "{agencySearch}" as new agency
                          </button>
                        </div>
                      )}
                      
                      {/* Add new agency option */}
                      {agencySearch && filteredAgencies.length > 0 && (
                        <div className="border-t border-zinc-200">
                          <button
                            type="button"
                            onClick={handleAddCustomAgency}
                            className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors"
                          >
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2540]">
                              <FaPlusCircle className="text-xs" /> Add "{agencySearch}" as new agency
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show custom agency input */}
                  {showCustomAgency && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-blue-800">Adding new agency</span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomAgency(false);
                            setCustomAgency("");
                            setSelectedAgency("");
                            setFormData({ ...formData, university_agency: "" });
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUniversity className="text-zinc-400 text-sm" />
                        </div>
                        <input
                          type="text"
                          value={customAgency}
                          onChange={(e) => setCustomAgency(e.target.value)}
                          placeholder="Enter full University/Agency name"
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                        />
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        This agency will be saved for future use.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address & Phone Number - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-zinc-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your complete address"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-zinc-400 text-sm" />
                  </div>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => {
                      // Only allow numbers, spaces, and basic phone characters
                      const cleaned = e.target.value.replace(/[^\d+\-()\s]/g, '');
                      setFormData({ ...formData, phone_number: cleaned });
                    }}
                    required
                    placeholder="e.g., 0917-123-4567"
                    pattern="[0-9+\\-()\\s]*"
                    title="Please enter a valid phone number"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                  />
                </div>
              </div>
            </div>

            {/* City Tour/Boracay Transfer */}
            <div className="border border-zinc-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaCity className="text-[#0A2540] text-sm" />
                <label className="text-sm font-semibold text-[#0A2540]">City Tour/Boracay Transfer *</label>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, city_tour_option: "option1" })}
                  className={`w-full text-left p-3 border rounded-lg transition-all ${
                    formData.city_tour_option === "option1"
                      ? "border-[#0A2540] bg-[#0A2540]/5"
                      : "border-zinc-200 hover:border-[#0A2540]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${formData.city_tour_option === "option1" ? "border-[#0A2540] bg-[#0A2540]" : "border-zinc-300"}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#0A2540]">Option 1: City Tour Only</p>
                      <p className="text-xs text-zinc-500">Includes city tour of Roxas City</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, city_tour_option: "option2" })}
                  className={`w-full text-left p-3 border rounded-lg transition-all ${
                    formData.city_tour_option === "option2"
                      ? "border-[#0A2540] bg-[#0A2540]/5"
                      : "border-zinc-200 hover:border-[#0A2540]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${formData.city_tour_option === "option2" ? "border-[#0A2540] bg-[#0A2540]" : "border-zinc-300"}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#0A2540]">Option 2: City Tour & Boracay Transfer</p>
                      <p className="text-xs text-zinc-500">Includes city tour and Boracay transfer</p>
                    </div>
                  </div>
                </button>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  Participants proceeding to Boracay shall be responsible for arranging their own accommodation and return/onward travel. Delegates may arrange their departure at their convenience through Caticlan or Kalibo, depending on their preferred flight or onward travel arrangements. The Organizing Committee may provide general travel information and coordination assistance but shall not be responsible for individual bookings or personal travel expenses.
                </p>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Abstract (not more than 300 words) *</label>
              <textarea name="abstract" value={formData.abstract} onChange={handleChange} required rows={8}
                placeholder="Enter your abstract here..."
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"></textarea>
              <p className="text-xs text-zinc-400 mt-1">{formData.abstract.split(/\s+/).filter(Boolean).length} words</p>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Keywords *</label>
              <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} required
                placeholder="e.g., Agriculture, Sustainability, Biotechnology"
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]" />
            </div>

            {/* Preview Section */}
            <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaFilePdf className="text-red-500" />
                  <span className="text-sm font-semibold text-[#0A2540]">PDF Preview</span>
                </div>
                <button
                  type="button"
                  onClick={handleManualPreview}
                  disabled={previewLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0A2540] hover:bg-[#143b66] rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  {previewLoading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <FaSync /> Generate Preview
                    </>
                  )}
                </button>
              </div>
              
              {previewGenerated && previewUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <FaCheck /> Preview ready
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#0A2540] border border-[#0A2540] hover:bg-[#0A2540] hover:text-white rounded-lg transition-colors"
                  >
                    <FaEye /> View Preview
                  </button>
                </div>
              )}
              
              {previewLoading && (
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                  <FaSpinner className="animate-spin" /> Generating PDF preview...
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              className="w-full bg-[#0A2540] text-white py-4 rounded-lg font-bold hover:bg-[#143b66] transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed">
              {loading ? <><FaSpinner className="animate-spin" /> Generating PDF & Submitting...</> : <><FaPaperPlane /> Submit Abstract</>}
            </button>
          </form>
        ) : (
          /* My Submissions Tab */
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540] flex items-center gap-2">
                <FaList className="text-[#0A2540]" /> My Submissions
              </h2>
              <button
                onClick={fetchMySubmissions}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#0A2540] border border-[#0A2540] hover:bg-[#0A2540] hover:text-white rounded-lg transition-colors"
              >
                <FaSync className="text-xs" /> Refresh
              </button>
            </div>

            {submissionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-3xl text-[#0A2540]" />
              </div>
            ) : mySubmissions.length === 0 ? (
              <div className="text-center py-12">
                <FaExclamationTriangle className="text-4xl text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500">You haven't submitted any abstracts yet.</p>
                <button
                  onClick={() => setActiveTab("submit")}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#143b66]"
                >
                  <FaPaperPlane /> Submit Your First Abstract
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Title</th>
                      <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Type</th>
                      <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Status</th>
                      <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Date</th>
                      <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-[#0A2540] line-clamp-1">{submission.research_title}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                            {submission.presentation_type === 'oral' ? <FaMicrophone /> : <FaImage />}
                            {submission.presentation_type === 'oral' ? 'Oral' : 'Poster'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-zinc-500">{submission.created_at}</p>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => viewSubmission(submission)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[#0A2540] hover:text-[#143b66]"
                          >
                            <FaEye className="text-xs" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}