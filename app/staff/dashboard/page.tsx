"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner, FaEye, FaDownload, FaCheck, FaTimes, FaFilePdf, FaList, FaSync, FaSearch, FaUniversity, FaEnvelope, FaPhone, FaUser, FaMapMarkerAlt, FaMicrophone, FaImage, FaCity, FaFolderOpen, FaFileAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

export default function StaffDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [pdfViewerUrl, setPdfViewerUrl] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
                  if (match && match[1]) {
                      return match[1].split('?')[0].split('&')[0];
                  }
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

  // Fetch all submissions with token
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/staff/submissions", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (res.status === 401 || res.status === 422) {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const refreshRes = await fetch("http://localhost:5000/api/refresh", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${refreshToken}`
            }
          });
          
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem("access_token", refreshData.access_token);
            
            // Retry with new token
            const retryRes = await fetch("http://localhost:5000/api/staff/submissions", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${refreshData.access_token}`
              }
            });
            
            if (retryRes.ok) {
              const data = await retryRes.json();
              setSubmissions(data);
              return;
            }
          }
        }
        
        // If refresh fails, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Update submission status with token
  const updateStatus = async (submissionId: number, status: string) => {
    setUpdatingStatus(true);
    setSelectedSubmissionId(submissionId);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/staff/submissions/${submissionId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status })
      });

      if (res.status === 401 || res.status === 422) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const refreshRes = await fetch("http://localhost:5000/api/refresh", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${refreshToken}`
            }
          });
          
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem("access_token", refreshData.access_token);
            
            // Retry with new token
            const retryRes = await fetch(`http://localhost:5000/api/staff/submissions/${submissionId}/status`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshData.access_token}`
              },
              body: JSON.stringify({ status })
            });
            
            if (retryRes.ok) {
              setSubmissions(prev => prev.map(sub => 
                sub.id === submissionId ? { ...sub, status } : sub
              ));
              
              if (viewingSubmission && viewingSubmission.id === submissionId) {
                setViewingSubmission({ ...viewingSubmission, status });
              }
              
              alert(`Submission ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'marked as pending'} successfully!`);
              return;
            }
          }
        }
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (res.ok) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === submissionId ? { ...sub, status } : sub
        ));
        
        if (viewingSubmission && viewingSubmission.id === submissionId) {
          setViewingSubmission({ ...viewingSubmission, status });
        }
        
        alert(`Submission ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'marked as pending'} successfully!`);
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
      setSelectedSubmissionId(null);
    }
  };

  // View submission details
  const viewSubmission = (submission: any) => {
    setViewingSubmission(submission);
    setShowSubmissionModal(true);
    if (submission.abstract_drive_view_url) {
      setPdfViewerUrl(submission.abstract_drive_view_url);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.research_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.presenter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.university_agency?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaHourglassHalf className="text-yellow-600" />;
      case 'accepted':
        return <FaCheckCircle className="text-green-600" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] font-sans flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-[#0A2540]" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540] flex flex-col">
      <Header />

      {/* Submission Detail Modal */}
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
                  <p className="text-[#0A2540] flex items-center gap-2">
                    <FaUser className="text-zinc-400 text-xs" />
                    {viewingSubmission.presenter}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">Email</h4>
                  <p className="text-[#0A2540] flex items-center gap-2">
                    <FaEnvelope className="text-zinc-400 text-xs" />
                    {viewingSubmission.email_address}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500">University/Agency</h4>
                  <p className="text-[#0A2540] flex items-center gap-2">
                    <FaUniversity className="text-zinc-400 text-xs" />
                    {viewingSubmission.university_agency}
                  </p>
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
                    {getStatusIcon(viewingSubmission.status)}
                    <span className="ml-1">{viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}</span>
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
            
            {/* Action Buttons */}
            <div className="mt-6 border-t border-zinc-200 pt-4">
              <h4 className="text-sm font-semibold text-zinc-500 mb-3">Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(viewingSubmission.id, 'accepted')}
                  disabled={updatingStatus || viewingSubmission.status === 'accepted'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus && selectedSubmissionId === viewingSubmission.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheck />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(viewingSubmission.id, 'rejected')}
                  disabled={updatingStatus || viewingSubmission.status === 'rejected'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus && selectedSubmissionId === viewingSubmission.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTimes />
                  )}
                  Reject
                </button>
                <button
                  onClick={() => updateStatus(viewingSubmission.id, 'pending')}
                  disabled={updatingStatus || viewingSubmission.status === 'pending'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaHourglassHalf />
                  Mark as Pending
                </button>
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
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0A2540]">Staff Dashboard</h1>
              <p className="text-zinc-500 mt-1">Manage abstract submissions</p>
            </div>
            <button
              onClick={fetchSubmissions}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#143b66]"
            >
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Submissions</p>
                <p className="text-2xl font-bold text-[#0A2540]">{submissions.length}</p>
              </div>
              <FaList className="text-3xl text-[#0A2540]" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{submissions.filter(s => s.status === 'pending').length}</p>
              </div>
              <FaHourglassHalf className="text-3xl text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === 'accepted').length}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{submissions.filter(s => s.status === 'rejected').length}</p>
              </div>
              <FaTimesCircle className="text-3xl text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by title, author, presenter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
            {error}
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Title</th>
                  <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Author</th>
                  <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Type</th>
                  <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <FaExclamationTriangle className="text-4xl text-zinc-300 mx-auto mb-4" />
                      <p className="text-zinc-500">No submissions found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-[#0A2540] line-clamp-1">{submission.research_title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-zinc-600">{submission.author}</p>
                        <p className="text-xs text-zinc-400">{submission.university_agency}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                          {submission.presentation_type === 'oral' ? <FaMicrophone /> : <FaImage />}
                          {submission.presentation_type === 'oral' ? 'Oral' : 'Poster'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1">{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}