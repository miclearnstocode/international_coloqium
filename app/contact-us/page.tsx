"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegPaperPlane, 
  FaCheckCircle, FaArrowRight, FaUser, FaBuilding, 
  FaGlobe, FaTag, FaComment, FaSend, FaShieldAlt,
  FaUsers, FaHandshake, FaUniversity, FaRegBuilding,
  FaClipboardList, FaMoneyBillWave, FaTruck, FaPlane,
  FaCalendarAlt, FaFileAlt, FaMicrophone, FaQrcode,
  FaClock, FaInfoCircle, FaUserFriends, FaRegEnvelope
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    country: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        institution: '',
        country: '',
        inquiryType: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  const countries = [
    "Select your country",
    "Philippines",
    "Japan",
    "United States",
    "United Kingdom",
    "Australia",
    "Canada",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "South Korea",
    "China",
    "India",
    "Indonesia",
    "Malaysia",
    "Thailand",
    "Vietnam",
    "Singapore",
    "New Zealand",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark",
    "Switzerland",
    "Belgium",
    "Austria",
    "Greece",
    "Portugal",
    "Ireland",
    "Brazil",
    "Mexico",
    "South Africa",
    "Egypt",
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Oman",
    "Bahrain",
    "Other"
  ];

  const inquiryTypes = [
    "Select inquiry type",
    "General Inquiry",
    "Abstract Submission",
    "Scientific Tracks",
    "Oral Presentation",
    "Poster Presentation",
    "Registration",
    "Payment",
    "International Delegate Assistance",
    "Venue & Travel",
    "Accommodation",
    "Partnership / Sponsorship",
    "Technical Support",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540]">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Contact Us</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Contact Us</h1>
          <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Connect with us for inquiries, assistance, and symposium support.
          </p>
        </div>
      </section>

      {/* ================= INTRO SECTION ================= */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-4">
              Contact the Symposium Secretariat
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Have questions about abstract submission, registration, travel, participation, or institutional collaboration? The 3rd International Agri-Life & Bioresource Sciences Symposium Secretariat is available to assist participants, presenters, partner institutions, and international delegates.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-zinc-100">
              <div className="flex items-center gap-3">
                <FaRegBuilding className="text-[#D5A54D] text-lg" />
                <div>
                  <p className="font-semibold text-[#0A2540] text-sm">Symposium Secretariat</p>
                  <p className="text-xs text-gray-500">3rd International Agri-Life & Bioresource Sciences Symposium</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUniversity className="text-[#D5A54D] text-lg" />
                <div>
                  <p className="font-semibold text-[#0A2540] text-sm">Capiz State University</p>
                  <p className="text-xs text-gray-500">Roxas City, Capiz, Philippines</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#D5A54D] text-lg" />
                <div>
                  <p className="font-semibold text-[#0A2540] text-sm">Email</p>
                  <a href="mailto:rde@capsu.edu.ph" className="text-xs text-[#1D3D6D] hover:text-[#F5A623] transition-colors">
                    rde@capsu.edu.ph
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#D5A54D] text-lg" />
                <div>
                  <p className="font-semibold text-[#0A2540] text-sm">Telephone</p>
                  <p className="text-xs text-gray-500">To be announced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW CAN WE HELP ================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">How Can We Help?</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: General Inquiries */}
            <div className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1D3D6D] rounded-full flex items-center justify-center mb-4">
                <FaInfoCircle className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">General Inquiries</h3>
              <p className="text-sm text-gray-600 mb-4">
                For general questions about the symposium, program, participation, schedules, and other event-related concerns.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-[#D5A54D] text-sm" />
                  <a href="mailto:rde@capsu.edu.ph" className="text-[#1D3D6D] hover:text-[#F5A623] transition-colors">
                    rde@capsu.edu.ph
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-[#D5A54D] text-sm" />
                  <span className="text-gray-500">To be announced</span>
                </div>
              </div>
            </div>

            {/* Card 2: Registration & Payment */}
            <div className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1D3D6D] rounded-full flex items-center justify-center mb-4">
                <FaClipboardList className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Registration & Payment Concerns</h3>
              <p className="text-sm text-gray-600 mb-4">
                For assistance regarding:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Participant & Presenter registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Registration status & fee</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Proof of payment & verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Symposium kit and certificates</span>
                </li>
              </ul>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-[#D5A54D] text-sm" />
                  <span className="text-gray-500">To be announced</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-[#D5A54D] text-sm" />
                  <span className="text-gray-500">To be announced</span>
                </div>
              </div>
            </div>

            {/* Card 3: Partnership & Sponsorship */}
            <div className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1D3D6D] rounded-full flex items-center justify-center mb-4">
                <FaHandshake className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Partnership & Sponsorship</h3>
              <p className="text-sm text-gray-600 mb-4">
                Universities, research institutions, government agencies, professional organizations, industry partners, and other organizations interested in supporting or collaborating with the symposium.
              </p>
              <p className="text-sm font-semibold text-[#0A2540] mb-2">Potential areas:</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Institutional & scientific collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Speaker, reviewer, or session chair nomination</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Sponsorship support & exhibition</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                  <span>Post-symposium research collaboration</span>
                </li>
              </ul>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-[#D5A54D] text-sm" />
                  <span className="text-gray-500">To be announced</span>
                </div>
              </div>
              <Link 
                href="/partner-institutions" 
                className="inline-flex items-center gap-2 text-[#1D3D6D] font-semibold text-sm hover:text-[#F5A623] transition-colors mt-3"
              >
                Explore Our Partners <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#0A2540] to-[#1a3a5c] rounded-2xl p-8 text-white h-full">
                <h3 className="text-2xl font-bold mb-4">Send Us a Message</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Have a specific question? Send your inquiry using the form.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <FaEnvelope className="text-[#D5A54D]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <a href="mailto:rde@capsu.edu.ph" className="text-sm text-gray-300 hover:text-[#D5A54D] transition-colors">
                        rde@capsu.edu.ph
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <FaPhone className="text-[#D5A54D]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Telephone</p>
                      <p className="text-sm text-gray-300">To be announced</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <FaMapMarkerAlt className="text-[#D5A54D]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Address</p>
                      <p className="text-sm text-gray-300">Capiz State University<br />Roxas City, Capiz, Philippines</p>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-green-600 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A2540] mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for your message. We will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-[#1D3D6D] font-semibold hover:text-[#F5A623] transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your complete name"
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter a valid email address"
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Institution / Organization
                        </label>
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          placeholder="Enter your university, agency, company, or organization"
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm appearance-none bg-white"
                        >
                          {countries.map((country, idx) => (
                            <option key={idx} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                        Inquiry Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm appearance-none bg-white"
                      >
                        {inquiryTypes.map((type, idx) => (
                          <option key={idx} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Briefly describe your concern"
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Provide the details of your inquiry"
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6D] focus:border-transparent text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1D3D6D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16305a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          SEND MESSAGE <FaRegPaperPlane className="rotate-[-20deg]" />
                        </>
                      )}
                    </button>

                    <div className="mt-4 p-4 bg-[#F8FAFC] rounded-lg border border-zinc-200">
                      <div className="flex items-start gap-2">
                        <FaShieldAlt className="text-[#D5A54D] text-sm mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-600">
                          By submitting this form, you agree that the information you provide may be used by the Symposium Secretariat to respond to your inquiry and provide relevant symposium-related assistance.
                        </p>
                      </div>
                      <div className="mt-2">
                        <Link 
                          href="#" 
                          className="text-xs text-[#1D3D6D] hover:text-[#F5A623] transition-colors font-semibold"
                        >
                          View Privacy Notice →
                        </Link>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}