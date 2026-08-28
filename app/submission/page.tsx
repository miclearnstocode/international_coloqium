"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaSpinner, FaPlus, FaTimes, FaUserPlus, FaUser, FaCheck, FaUniversity, FaSearch, FaChevronDown, FaPlusCircle } from "react-icons/fa";

export default function AbstractSubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sucs, setSucs] = useState<any[]>([]);
  const [newCoAuthor, setNewCoAuthor] = useState("");
  const [showCustomAgency, setShowCustomAgency] = useState(false);
  const [customAgency, setCustomAgency] = useState("");
  
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
    
    // If selected_track changes, reset specific_track
    if (name === "selected_track") {
      setFormData({ ...formData, selected_track: value, specific_track: "" });
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

  // Submit handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the JWT token from localStorage (stored during login)
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
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
        co_authors: undefined
      };

      const res = await fetch("http://localhost:5000/api/abstracts/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Abstract submitted successfully!\nView here: ${data.view_url}`);
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting abstract", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540] flex flex-col">
      <Header />
      
      <div className="max-w-4xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#0A2540] mb-4">Submit Abstract</h1>
          <div className="w-16 h-1 bg-[#D5A54D] mx-auto mb-6"></div>
          <p className="text-zinc-600">Fill out the form below. The system will automatically generate your PDF and submit it for review.</p>
        </div>

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

          {/* Abstract */}
          <div>
            <label className="block text-sm font-semibold text-[#0A2540] mb-2">Abstract (200-500 words) *</label>
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

          {/* Submit Button */}
          <button type="submit" disabled={loading}
            className="w-full bg-[#0A2540] text-white py-4 rounded-lg font-bold hover:bg-[#143b66] transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed">
            {loading ? <><FaSpinner className="animate-spin" /> Generating PDF & Submitting...</> : <><FaPaperPlane /> Submit Abstract</>}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}