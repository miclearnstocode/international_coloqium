"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FaPaperPlane, FaPhone, FaSpinner, FaPlus, FaTimes, FaUserPlus, FaUser,
  FaCheck, FaUniversity, FaSearch, FaChevronDown, FaPlusCircle, FaFilePdf,
  FaEye, FaDownload, FaSync, FaList, FaExclamationTriangle, FaFolderOpen,
  FaFileAlt, FaMapMarkerAlt, FaMicrophone, FaImage,
  FaArrowLeft, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaChevronRight
} from "react-icons/fa";
import { apiFetch } from "../lib/api";

export default function AbstractSubmissionPage() {
  const router = useRouter();

  // ===== PAGE VIEW STATE =====
  const [view, setView] = useState<"landing" | "submit" | "submissions">("landing");

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
        const res = await apiFetch("/api/sucs");
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
      
      const res = await apiFetch(`/api/my-submissions/${userId}`);
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

  // Fetch submissions on mount
  useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  useEffect(() => {
    if (view === "submissions") {
      fetchMySubmissions();
    }
  }, [view, fetchMySubmissions]);

  const generatePreview = useCallback(async (data: any) => {
    const requiredFields = [
      'selected_track', 'specific_track', 'research_title', 'author',
      'presenter', 'email_address', 'university_agency', 'address',
      'presentation_type', 'abstract', 'keywords'
    ];

    const isComplete = requiredFields.every(field => data[field]?.trim());

    if (!isComplete) {
      setPreviewUrl("");
      setPreviewGenerated(false);
      return;
    }

    setPreviewLoading(true);

    try {
      const coAuthorsString = data.co_authors.join(", ");

      const submissionData = {
        ...data,
        co_author: coAuthorsString,
        co_authors: undefined
      };

      const res = await apiFetch("/api/abstracts/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Auto-generate preview when all required fields are filled
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
        formData.abstract) {

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        generatePreview(formData);
      }, 1500);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAgencies = sucs.filter(suc =>
    suc.name.toLowerCase().includes(agencySearch.toLowerCase()) ||
    suc.abbreviation?.toLowerCase().includes(agencySearch.toLowerCase()) ||
    suc.region?.toLowerCase().includes(agencySearch.toLowerCase())
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "selected_track") {
      setFormData({ ...formData, selected_track: value, specific_track: "" });
      setPreviewGenerated(false);
      setPreviewUrl("");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getSpecificTracks = () => {
    if (!formData.selected_track) return [];
    return trackData[formData.selected_track as keyof typeof trackData] || [];
  };

  const addCoAuthor = () => {
    if (newCoAuthor.trim() === "") return;
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
    setFormData({ ...formData, co_authors: updatedCoAuthors });
  };

  const handleCoAuthorKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCoAuthor();
    }
  };

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

  const handleManualPreview = () => {
    generatePreview(formData);
  };

  const viewSubmission = (submission: any) => {
    setViewingSubmission(submission);
    setShowSubmissionModal(true);
    if (submission.abstract_drive_view_url) {
      setPdfViewerUrl(submission.abstract_drive_view_url);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");

      if (!token) {
        router.push("/login");
        return;
      }

      let userId = null;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id;
        } catch (error) {
          console.error("Error parsing user data", error);
        }
      }

      let finalAgency = formData.university_agency;
      if (showCustomAgency && customAgency.trim()) {
        finalAgency = customAgency.trim();
      }

      const coAuthorsString = formData.co_authors.join(", ");

      const submissionData = {
        ...formData,
        university_agency: finalAgency,
        co_author: coAuthorsString,
        co_authors: undefined,
        sender_id: userId
      };

      const res = await apiFetch("/api/abstracts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedData(data);
        setShowSuccessModal(true);
        setLoading(false);

        setTimeout(() => {
          setShowSuccessModal(false);
          setView("submissions");
          fetchMySubmissions();
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
      case 'pending': return 'bg-[#FEF9E7] text-yellow-800 border border-[#F0C674]/30';
      case 'accepted': return 'bg-[#E9F5E1] text-[#1b5e20] border border-[#76B947]/30';
      case 'rejected': return 'bg-[#FFF5F5] text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf className="text-[#D5A54D]" />;
      case 'accepted': return <FaCheckCircle className="text-[#76B947]" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      default: return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  // ===== STATS =====
  const stats = {
    total: mySubmissions.length,
    pending: mySubmissions.filter(s => s.status === 'pending').length,
    accepted: mySubmissions.filter(s => s.status === 'accepted').length,
    rejected: mySubmissions.filter(s => s.status === 'rejected').length
  };

  // Google Drive PDF Viewer Component
  const GoogleDriveViewer = ({ url }: { url: string }) => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
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
          if (match && match[1]) return match[1].split('?')[0].split('&')[0];
        }
        return null;
      };

      if (url) {
        const fileId = extractFileId(url);
        if (fileId) {
          setEmbedUrl(`https://drive.google.com/file/d/${fileId}/preview`);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } else {
        setError(true);
        setLoading(false);
      }
    }, [url]);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaSpinner className="animate-spin text-3xl text-[#1D3D6D] mb-4" />
          <p className="text-zinc-500">Loading PDF...</p>
        </div>
      );
    }

    if (error || !url) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaFilePdf className="text-5xl text-zinc-300 mb-4" />
          <p className="text-zinc-500">No PDF file available for this submission.</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
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
    <div className="min-h-screen bg-linear-to-b from-white via-[#F8FBF5] to-white font-sans text-[#0A2540] flex flex-col">
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
              <button onClick={() => setShowPreviewModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="bg-zinc-100 rounded-lg p-4 max-h-[70vh] overflow-y-auto">
              <iframe src={previewUrl} className="w-full h-150 border-0" title="PDF Preview" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <a href={previewUrl} download className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white rounded-lg hover:shadow-lg transition-all">
                <FaDownload /> Download PDF
              </a>
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 font-semibold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal with PDF Viewer */}
      {showSubmissionModal && viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubmissionModal(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0 bg-[#F8FBF5]">
              <h3 className="text-xl font-bold text-[#0A2540] flex items-center gap-2 tracking-tight">
                <FaFolderOpen className="text-[#1D3D6D]" /> Submission Details
              </h3>
              <button onClick={() => setShowSubmissionModal(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors p-2 hover:bg-zinc-100 rounded-full">
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 h-full p-6">

                {/* Left Column - Scrollable Details (Card Layout) */}
                <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  
                  {/* Card 1: General Info */}
                  <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-100 pb-3">
                      <FaFileAlt className="text-[#76B947]" /> General Information
                    </h4>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Research Title</p>
                        <p className="text-[#0A2540] font-bold text-lg leading-snug">
                          {viewingSubmission.research_title || <span className="text-zinc-400 italic font-normal text-base">Not provided</span>}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Presentation Type</p>
                          <p className="text-[#0A2540] flex items-center gap-2 text-base font-medium">
                            {viewingSubmission.presentation_type === 'oral' ? (
                              <><FaMicrophone className="text-[#1D3D6D]" /> Oral</>
                            ) : (
                              <><FaImage className="text-[#1D3D6D]" /> Poster</>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Status</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(viewingSubmission.status)}`}>
                            {getStatusIcon(viewingSubmission.status)}
                            <span className="ml-1.5">{viewingSubmission.status?.charAt(0).toUpperCase() + viewingSubmission.status?.slice(1)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Track</p>
                          <p className="text-[#0A2540] text-base font-medium">{viewingSubmission.selected_track || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Sub-Track</p>
                          <p className="text-[#0A2540] text-base">{viewingSubmission.specific_track || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Authorship & Affiliation */}
                  <div className="bg-[#F8FBF5] border border-[#76B947]/20 rounded-xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-[#1b5e20] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#76B947]/20 pb-3">
                      <FaUser className="text-[#76B947]" /> Authorship
                    </h4>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Author(s)</p>
                        <p className="text-[#0A2540] text-base font-medium leading-relaxed">
                          {viewingSubmission.author || <span className="text-zinc-400 italic font-normal">Not provided</span>}
                          {viewingSubmission.co_author ? `, ${viewingSubmission.co_author}` : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Presenter</p>
                        <p className="text-[#0A2540] text-base">{viewingSubmission.presenter || <span className="text-zinc-400 italic">Not provided</span>}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">University / Agency</p>
                          <p className="text-[#0A2540] text-base flex items-start gap-2">
                            <FaUniversity className="text-zinc-400 text-sm mt-1 shrink-0" />
                            <span>{viewingSubmission.university_agency || <span className="text-zinc-400 italic">Not provided</span>}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Address</p>
                          <p className="text-[#0A2540] text-base flex items-start gap-2">
                            <FaMapMarkerAlt className="text-zinc-400 text-sm mt-1 shrink-0" />
                            <span>{viewingSubmission.address || <span className="text-zinc-400 italic">Not provided</span>}</span>
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email</p>
                            <p className="text-[#0A2540] text-base break-all" title={viewingSubmission.email_address}>
                              {viewingSubmission.email_address || <span className="text-zinc-400 italic">Not provided</span>}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Phone</p>
                            <p className="text-[#0A2540] text-base flex items-center gap-2">
                              <FaPhone className="text-zinc-400 text-sm shrink-0" />
                              {viewingSubmission.phone_number || <span className="text-zinc-400 italic">Not provided</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Abstract & Keywords */}
                  <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-100 pb-3">
                      <FaList className="text-[#1D3D6D]" /> Abstract & Keywords
                    </h4>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Abstract</p>
                        <p className="text-[#0A2540] text-base whitespace-pre-wrap leading-relaxed text-justify">
                          {viewingSubmission.abstract || <span className="text-zinc-400 italic">Not provided</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(viewingSubmission.keywords || '').split(',').map((kw: string, i: number) => {
                            if (!kw.trim()) return null;
                            return (
                              <span key={i} className="inline-block bg-[#F2F9FF] text-[#1D3D6D] text-sm font-medium px-3 py-1 rounded-md border border-[#4FC3F7]/30">
                                {kw.trim()}
                              </span>
                            );
                          })}
                          {(!viewingSubmission.keywords) && <span className="text-zinc-400 italic">Not provided</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Date */}
                  <div className="text-center pt-2 pb-6">
                    <p className="text-sm text-zinc-400 font-medium tracking-wide">
                      Submitted on: {viewingSubmission.created_at || 'Unknown date'}
                    </p>
                  </div>

                </div>

                {/* Right Column - PDF Viewer */}
                <div className="bg-[#F2F9FF] rounded-xl p-5 flex flex-col h-full border border-[#4FC3F7]/30 shadow-sm">
                  <div className="flex items-center justify-between mb-4 shrink-0 border-b border-[#4FC3F7]/20 pb-3">
                    <h4 className="text-sm font-bold text-[#1D3D6D] flex items-center gap-2 tracking-wide uppercase">
                      <FaFileAlt /> Abstract PDF Viewer
                    </h4>
                  </div>
                  <div className="flex-1 min-h-0 bg-white rounded-lg overflow-hidden shadow-inner border border-zinc-200">
                    {pdfViewerUrl ? (
                      <GoogleDriveViewer url={pdfViewerUrl} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <FaFilePdf className="text-5xl text-zinc-300 mb-4" />
                        <p className="text-zinc-500 font-medium text-lg">No PDF file available for this submission.</p>
                        <p className="text-sm text-zinc-400 mt-2">The document may have been removed or failed to upload.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Footer */}
            <div className="shrink-0 border-t border-zinc-200 bg-white px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap items-center justify-end gap-3">
                {viewingSubmission.abstract_drive_view_url && (
                  <a href={viewingSubmission.abstract_drive_view_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B2A4A] text-white font-bold text-sm tracking-wide rounded-lg hover:bg-[#153A61] transition-colors shadow-sm">
                    <FaEye className="text-base" /> OPEN IN NEW TAB
                  </a>
                )}
                {viewingSubmission.abstract_download_url && (
                  <a href={viewingSubmission.abstract_download_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white font-bold text-sm tracking-wide rounded-lg hover:shadow-lg transition-all">
                    <FaDownload className="text-base" /> DOWNLOAD PDF
                  </a>
                )}
                <button onClick={() => setShowSubmissionModal(false)}
                  className="px-6 py-2.5 bg-zinc-100 text-zinc-600 font-bold text-sm tracking-wide rounded-lg hover:bg-zinc-200 transition-colors">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-20 h-20 bg-[#E9F5E1] rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-[#0A5C0A] text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-3">Submission Successful!</h2>
            <p className="text-zinc-600 mb-4">Your abstract has been submitted successfully.</p>
            <div className="bg-[#F2F9FF] border border-[#4FC3F7]/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#0A2540]">
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

      <div className="max-w-5xl mx-auto w-full px-6 py-12">

        {/* ============ LANDING VIEW ============ */}
        {view === "landing" && (
          <div className="space-y-8">
            {/* Hero Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#0A2540] mb-4">Abstract Submission Portal</h1>
              <div className="w-16 h-1 bg-linear-to-r from-[#76B947] via-[#F0C674] to-[#D5A54D] mx-auto mb-6 rounded-full"></div>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Submit your research abstract or track the status of your existing submissions.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Total</p>
                    <p className="text-3xl font-bold text-[#0A2540] mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#F2F9FF] rounded-lg flex items-center justify-center border border-[#4FC3F7]/20">
                    <FaList className="text-xl text-[#1D3D6D]" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FEF9E7] rounded-lg flex items-center justify-center border border-[#F0C674]/30">
                    <FaHourglassHalf className="text-xl text-[#D5A54D]" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Accepted</p>
                    <p className="text-3xl font-bold text-green-700 mt-1">{stats.accepted}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#E9F5E1] rounded-lg flex items-center justify-center border border-[#76B947]/30">
                    <FaCheckCircle className="text-xl text-[#0A5C0A]" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Rejected</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF5F5] rounded-lg flex items-center justify-center border border-red-200">
                    <FaTimesCircle className="text-xl text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submit Abstract Card */}
              <button
                onClick={() => setView("submit")}
                className="group bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-left hover:shadow-xl hover:border-[#76B947]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-linear-to-br from-[#0A5C0A] to-[#76B947] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-[#0A5C0A]/20">
                    <FaPaperPlane className="text-2xl text-white" />
                  </div>
                  <FaChevronRight className="text-zinc-300 group-hover:text-[#76B947] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-2">Submit Abstract</h3>
                <p className="text-sm text-zinc-500">
                  Fill out the submission form and upload your research abstract for review.
                </p>
              </button>

              {/* My Submissions Card */}
              <button
                onClick={() => setView("submissions")}
                className="group bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-left hover:shadow-xl hover:border-[#4FC3F7]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-linear-to-br from-[#0B2A4A] to-[#1D3D6D] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-[#0B2A4A]/20">
                    <FaFolderOpen className="text-2xl text-white" />
                  </div>
                  <FaChevronRight className="text-zinc-300 group-hover:text-[#4FC3F7] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-2">My Submissions</h3>
                <p className="text-sm text-zinc-500">
                  View and track the status of all your previously submitted abstracts.
                </p>
              </button>
            </div>

            {/* Recent Submissions Preview */}
            {mySubmissions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0A2540]">Recent Submissions</h3>
                  <button
                    onClick={() => setView("submissions")}
                    className="text-sm font-semibold text-[#1b5e20] hover:text-[#76B947] inline-flex items-center gap-1 transition-colors"
                  >
                    View All <FaChevronRight className="text-xs" />
                  </button>
                </div>
                <div className="space-y-3">
                  {mySubmissions.slice(0, 3).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:bg-[#F8FBF5] transition-colors">
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-medium text-[#0A2540] truncate">{sub.research_title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{sub.created_at}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        <span className="ml-1">{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ SUBMIT VIEW ============ */}
        {view === "submit" && (
          <div className="space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("landing")}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-600 hover:text-[#0A2540] hover:bg-[#F8FBF5] rounded-lg transition-colors"
              >
                <FaArrowLeft /> Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#0A2540]">Submit Abstract</h1>
                <p className="text-sm text-zinc-500">Fill out the form to submit your research abstract</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 space-y-6">

              {/* Track Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Selected Track *</label>
                  <select name="selected_track" value={formData.selected_track} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] bg-white transition-all">
                    <option value="">Select a track</option>
                    {Object.keys(trackData).map((track) => (
                      <option key={track} value={track}>{track}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Specific Track / Sub-theme *</label>
                  <select name="specific_track" value={formData.specific_track} onChange={handleChange} required
                    disabled={!formData.selected_track}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] disabled:bg-zinc-100 disabled:cursor-not-allowed bg-white transition-all">
                    <option value="">{formData.selected_track ? "Select a specific track" : "Select a track first"}</option>
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
                  <button type="button" onClick={() => setFormData({ ...formData, presentation_type: "oral" })}
                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${formData.presentation_type === "oral" ? "border-[#76B947] bg-[#F2F9FF] ring-1 ring-[#76B947]" : "border-zinc-200 hover:border-[#76B947]/50"}`}>
                    <FaMicrophone className={`text-2xl ${formData.presentation_type === "oral" ? "text-[#1b5e20]" : "text-zinc-400"}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#0A2540]">Oral Presentation</p>
                      <p className="text-xs text-zinc-500">Present your research through a live presentation</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, presentation_type: "poster" })}
                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${formData.presentation_type === "poster" ? "border-[#76B947] bg-[#F2F9FF] ring-1 ring-[#76B947]" : "border-zinc-200 hover:border-[#76B947]/50"}`}>
                    <FaImage className={`text-2xl ${formData.presentation_type === "poster" ? "text-[#1b5e20]" : "text-zinc-400"}`} />
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
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
              </div>

              {/* Author Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Author *</label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} required
                    placeholder="e.g., Dela Cruz, Juan"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Presenter *</label>
                  <input type="text" name="presenter" value={formData.presenter} onChange={handleChange} required
                    placeholder="e.g., Dela Cruz, Juan"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
                </div>
              </div>

              {/* Co-Authors Section */}
              <div className="border border-zinc-200 rounded-lg p-4 bg-[#F8FBF5]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaUserPlus className="text-[#1D3D6D] text-sm" />
                    <label className="text-sm font-semibold text-[#0A2540]">Co-Authors</label>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {formData.co_authors.length} {formData.co_authors.length === 1 ? 'author' : 'authors'} added
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-zinc-400 text-sm" />
                    </div>
                    <input type="text" value={newCoAuthor} onChange={(e) => setNewCoAuthor(e.target.value)}
                      onKeyPress={handleCoAuthorKeyPress}
                      placeholder="Enter co-author name (e.g., Santos, Maria)"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] bg-white" />
                  </div>
                  <button type="button" onClick={addCoAuthor} disabled={!newCoAuthor.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#0A5C0A] hover:bg-[#0d6b0d] rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed shadow-md">
                    <FaPlus className="text-xs" /> Add
                  </button>
                </div>
                {formData.co_authors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.co_authors.map((coAuthor, index) => (
                      <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#76B947]/30 rounded-full shadow-sm">
                        <FaUser className="text-[#1b5e20] text-xs" />
                        <span className="text-sm text-[#0A2540]">{coAuthor}</span>
                        <button type="button" onClick={() => removeCoAuthor(index)}
                          className="shrink-0 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
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
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">University / Agency *</label>
                  <div className="relative" ref={agencyDropdownRef}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUniversity className="text-zinc-400 text-sm" />
                      </div>
                      <input type="text"
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
                        onFocus={() => { if (!showCustomAgency) setAgencyDropdownOpen(true); }}
                        placeholder={showCustomAgency ? "Enter University/Agency name" : "Search University/Agency..."}
                        required
                        className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
                      <button type="button" onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#0A2540]">
                        <FaChevronDown className={`transition-transform ${agencyDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {agencyDropdownOpen && !showCustomAgency && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredAgencies.length > 0 ? (
                          filteredAgencies.map((suc) => (
                            <button key={suc.id} type="button" onClick={() => selectAgency(suc.name)}
                              className="w-full text-left px-4 py-2.5 hover:bg-[#F8FBF5] transition-colors flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-[#0A2540]">{suc.name}</div>
                                <div className="text-xs text-zinc-500">
                                  {suc.abbreviation && <span className="mr-2">{suc.abbreviation}</span>}
                                  {suc.region && <span>{suc.region}</span>}
                                </div>
                              </div>
                              <FaCheck className="text-[#76B947] text-xs" />
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3">
                            <p className="text-sm text-zinc-500 mb-2">No results found for "{agencySearch}"</p>
                            <button type="button" onClick={handleAddCustomAgency}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b5e20] hover:text-[#76B947] transition-colors">
                              <FaPlusCircle className="text-xs" /> Add "{agencySearch}" as new agency
                            </button>
                          </div>
                        )}
                        {agencySearch && filteredAgencies.length > 0 && (
                          <div className="border-t border-zinc-200">
                            <button type="button" onClick={handleAddCustomAgency}
                              className="w-full text-left px-4 py-3 hover:bg-[#F8FBF5] transition-colors">
                              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b5e20]">
                                <FaPlusCircle className="text-xs" /> Add "{agencySearch}" as new agency
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {showCustomAgency && (
                      <div className="mt-2 p-3 bg-[#F2F9FF] border border-[#4FC3F7]/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#1D3D6D]">Adding new agency</span>
                          <button type="button" onClick={() => {
                            setShowCustomAgency(false);
                            setCustomAgency("");
                            setSelectedAgency("");
                            setFormData({ ...formData, university_agency: "" });
                          }} className="text-xs text-[#1D3D6D] hover:text-[#4FC3F7] transition-colors">
                            Cancel
                          </button>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUniversity className="text-zinc-400 text-sm" />
                          </div>
                          <input type="text" value={customAgency} onChange={(e) => setCustomAgency(e.target.value)}
                            placeholder="Enter full University/Agency name"
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#4FC3F7]/50 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] bg-white" />
                        </div>
                        <p className="text-xs text-[#1D3D6D]/70 mt-2">This agency will be saved for future use.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address & Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-zinc-400 text-sm" />
                    </div>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required
                      placeholder="Enter your complete address"
                      className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A2540] mb-2">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-zinc-400 text-sm" />
                    </div>
                    <input type="tel" name="phone_number" value={formData.phone_number}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^\d+\-()\s]/g, '');
                        setFormData({ ...formData, phone_number: cleaned });
                      }}
                      required placeholder="e.g., 0917-123-4567" pattern="[0-9+\-()\s]*"
                      className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Abstract (not more than 300 words) *</label>
                <textarea name="abstract" value={formData.abstract} onChange={handleChange} required rows={8}
                  placeholder="Enter your abstract here..."
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all"></textarea>
                <p className="text-xs text-zinc-400 mt-1">{formData.abstract.split(/\s+/).filter(Boolean).length} words</p>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Keywords *</label>
                <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} required
                  placeholder="e.g., Agriculture, Sustainability, Biotechnology"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#76B947] focus:ring-1 focus:ring-[#76B947] transition-all" />
              </div>

              {/* Preview Section */}
              <div className="border border-zinc-200 rounded-lg p-4 bg-[#F8FBF5]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaFilePdf className="text-red-500" />
                    <span className="text-sm font-semibold text-[#0A2540]">PDF Preview</span>
                  </div>
                  <button type="button" onClick={handleManualPreview} disabled={previewLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] hover:shadow-lg rounded-lg transition-all disabled:bg-zinc-300 disabled:cursor-not-allowed">
                    {previewLoading ? (<><FaSpinner className="animate-spin" /> Generating...</>) : (<><FaSync /> Generate Preview</>)}
                  </button>
                </div>
                {previewGenerated && previewUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-[#0A5C0A] font-semibold flex items-center gap-1"><FaCheck /> Preview ready</span>
                    <button type="button" onClick={() => setShowPreviewModal(true)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#1b5e20] border border-[#76B947] hover:bg-[#76B947] hover:text-white rounded-lg transition-colors">
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
                className="w-full bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white py-4 rounded-lg font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed">
                {loading ? <><FaSpinner className="animate-spin" /> Generating PDF & Submitting...</> : <><FaPaperPlane /> Submit Abstract</>}
              </button>
            </form>
          </div>
        )}

        {/* ============ MY SUBMISSIONS VIEW ============ */}
        {view === "submissions" && (
          <div className="space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setView("landing")}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-600 hover:text-[#0A2540] hover:bg-[#F8FBF5] rounded-lg transition-colors">
                  <FaArrowLeft /> Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-[#0A2540]">My Submissions</h1>
                  <p className="text-sm text-zinc-500">Track the status of your submitted abstracts</p>
                </div>
              </div>
              <button onClick={fetchMySubmissions}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#0B2A4A] border border-[#0B2A4A] hover:bg-[#0B2A4A] hover:text-white rounded-lg transition-colors">
                <FaSync className="text-xs" /> Refresh
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8">
              {submissionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-3xl text-[#1D3D6D]" />
                </div>
              ) : mySubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <FaExclamationTriangle className="text-4xl text-zinc-300 mx-auto mb-4" />
                  <p className="text-zinc-500">You haven't submitted any abstracts yet.</p>
                  <button onClick={() => setView("submit")}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white rounded-lg hover:shadow-lg transition-all">
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
                        <tr key={submission.id} className="border-b border-zinc-100 hover:bg-[#F8FBF5] transition-colors">
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-[#0A2540] line-clamp-1">{submission.research_title}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                              {submission.presentation_type === 'oral' ? <FaMicrophone className="text-[#1D3D6D]" /> : <FaImage className="text-[#1D3D6D]" />}
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
                            <button onClick={() => viewSubmission(submission)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[#1b5e20] hover:text-[#76B947] transition-colors">
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
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}