import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { 
  FaUser, FaFileAlt, FaCheckCircle, FaRegPaperPlane, FaTachometerAlt, 
  FaLanguage, FaDownload, FaPencilAlt, FaSearch, FaRegCalendarAlt, 
  FaInfoCircle, FaEnvelope, FaQuestionCircle, FaUserPlus,
  FaSignInAlt, FaChevronDown, FaArrowRight, FaBullhorn
} from "react-icons/fa";

export default function FullabstractSubmission() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540]">
      
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Abstract Submission</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Abstract Submission</h1>
              <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
              
              <p className="text-zinc-600 mb-8 leading-relaxed">
                We welcome original, unpublished abstracts that contribute to the advancement of knowledge and practice aligned with the conference themes. All submissions will undergo a rigorous peer-review process.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="inline-flex items-center gap-2 bg-[#0A2540] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#143b66] transition-colors shadow-md">
                  Submit Your Abstract <FaRegPaperPlane className="rotate-[-20deg]" />
                </Link>
              </div>
            </div>

            {/* Right Image (Laptop) */}
            <div className="hidden md:block relative w-full h-125 z-0">
                <img 
                    src="/images/laptop2.png" 
                    alt="Laptop Submission" 
                    className="absolute -right-22.5 top-1/2 -translate-y-1/2 w-175 max-w-none h-auto object-contain pointer-events-none z-5" 
                />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SUBMISSION PROCESS ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Submission Process</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <FaUser />, num: "1", title: "Create an Account", desc: "Register or log in to your account to get started." },
              { icon: <FaFileAlt />, num: "2", title: "Start Submission", desc: "Fill in the abstract details and upload your abstract." },
              { icon: <FaCheckCircle />, num: "3", title: "Review & Confirm", desc: "Review all information and confirm your submission." },
              { icon: <FaRegPaperPlane />, num: "4", title: "Submit", desc: "Submit your abstract and receive a confirmation." },
              { icon: <FaTachometerAlt />, num: "5", title: "Track Status", desc: "Monitor your abstract status through your dashboard." },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative">
                {idx !== 4 && (
                  <div className="absolute top-8 left-[60%] w-[80%] h-px bg-zinc-200 hidden md:block"></div>
                )}
                
                <div className="w-16 h-16 bg-white border border-zinc-100 rounded-full flex items-center justify-center text-2xl text-[#0A2540] mb-4 shadow-sm relative z-10">
                  {item.icon}
                </div>
                <div className="w-6 h-6 bg-[#0A2540] rounded-full text-white flex items-center justify-center text-xs font-bold mb-4">
                  {item.num}
                </div>
                <h3 className="font-bold text-[#0A2540] mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GUIDELINES & SUBMIT ================= */}
      <section className="bg-white py-16 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Guidelines */}
          <div>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-2">SUBMISSION GUIDELINES</h2>
            <div className="w-12 h-1 bg-[#F5A623] mb-6"></div>
            <p className="text-zinc-600 mb-8">Please read the guidelines carefully before submitting your abstract.</p>

            <div className="space-y-6">
              {/* Eligibility */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaUser />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2540] mb-1">Eligibility</h4>
                  <p className="text-sm text-zinc-600">The abstract must be original, unpublished, and not currently under review or consideration elsewhere.</p>
                </div>
              </div>

              {/* Language */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaLanguage />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2540] mb-1">Language</h4>
                  <p className="text-sm text-zinc-600">All abstracts must be written in English.</p>
                </div>
              </div>

              {/* File Format */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaFileAlt />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2540] mb-1">File Format</h4>
                  <p className="text-sm text-zinc-600">Submit your abstract in Microsoft Word (.docx) or PDF (.pdf) format.</p>
                </div>
              </div>

              {/* Template */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaFileAlt />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2540] mb-1">Template</h4>
                  <p className="text-sm text-zinc-600">Use the official conference template for formatting your abstract.</p>
                  <button className="mt-2 text-[#0A2540] font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm">
                    Download Template <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* Length */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaPencilAlt />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2540] mb-1">Length</h4>
                  <p className="text-sm text-zinc-600">The abstract must be between 200 and 300 words, including references and appendices.</p>
                </div>
              </div>

              {/* Review Process */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaSearch />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2540] mb-1">Review Process</h4>
                  <p className="text-sm text-zinc-600">All submissions will undergo a double-blind peer review.</p>
                </div>
              </div>

              {/* Important Dates */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaRegCalendarAlt />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#0A2540] mb-2">Important Dates</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="border border-zinc-200 rounded-lg p-4 flex-1 min-w-35">
                      <p className="text-xs font-semibold text-[#0A2540] uppercase mb-1">Submission Deadline</p>
                      <p className="font-bold text-[#0A2540]">June 15, 2025</p>
                    </div>
                    <div className="border border-zinc-200 rounded-lg p-4 flex-1 min-w-35">
                      <p className="text-xs font-semibold text-[#0A2540] uppercase mb-1">Notification of Acceptance</p>
                      <p className="font-bold text-[#0A2540]">July 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="mt-10 bg-[#F0F6FF] border border-blue-100 rounded-lg p-4 flex gap-4 items-start">
              <FaInfoCircle className="text-[#0A2540] text-xl mt-0.5 shrink-0" />
              <p className="text-sm text-zinc-600">
                <span className="font-bold text-[#0A2540]">Incomplete or non-compliant submissions</span> may be desk rejected. Please ensure your abstract follows all guidelines.
              </p>
            </div>
          </div>

          {/* Right: Submit Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-2">SUBMIT YOUR ABSTRACT</h2>
            <div className="w-12 h-1 bg-[#F5A623] mb-6"></div>
            <p className="text-zinc-600 mb-6">Ready to submit? Log in to your account and complete the submission form.</p>

            <div className="space-y-4 mb-10">
              <Link href="/login" className="w-full bg-[#0A2540] text-white py-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-[#143b66] transition-colors">
                <FaSignInAlt /> Login to Your Account
              </Link>
              
              <div className="relative flex py-2 items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative bg-white px-4 text-xs font-bold text-zinc-400 uppercase">or</div>
              </div>

              <Link href="/register" className="w-full border border-[#0A2540] text-[#0A2540] py-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-[#0A2540] hover:text-white transition-colors">
                <FaUserPlus /> Create a New Account
              </Link>
            </div>

            {/* What You Will Need */}
            <div className="bg-[#F9FAFC] border border-zinc-200 rounded-xl p-8 mb-8">
              <h3 className="font-bold text-[#0A2540] uppercase mb-4">What You Will Need</h3>
              <ul className="space-y-3">
                {[
                  "Abstract Title",
                  "Abstract (150 - 250 words)",
                  "Keywords (3-5)",
                  "Author Information",
                  "Abstract File",
                  "Supplementary Files (if any)"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-zinc-600">
                    <FaCheckCircle className="text-[#0A2540]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help? */}
            <div className="bg-[#F9FAFC] border border-zinc-200 rounded-xl p-8">
              <h3 className="font-bold text-[#0A2540] uppercase mb-4">Need Help?</h3>
              <p className="text-sm text-zinc-600 mb-6">If you have any questions or encounter issues during the submission process, we're here to help.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <FaEnvelope className="text-[#0A2540] text-lg" />
                  <span>Email us at <span className="font-semibold text-[#0A2540]">info@icolloquium2025.org</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <FaQuestionCircle className="text-[#0A2540] text-lg" />
                  <span>Visit our FAQ</span>
                </div>
              </div>
              
              <button className="mt-4 text-[#0A2540] font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm">
                Frequently Asked Questions <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#0A2540] text-center mb-12">FREQUENTLY ASKED QUESTIONS</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Who can submit an abstract?",
              "What topics are suitable for submission?",
              "Is there a submission fee?",
              "Can I submit more than one abstract?",
              "How will I know if my abstract is accepted?",
              "Can I make changes after submission?"
            ].map((q, idx) => (
              <div key={idx} className="bg-[#F9FAFC] border border-zinc-200 rounded-lg p-5 flex items-center justify-between cursor-pointer hover:border-[#0A2540] transition-colors">
                <span className="font-semibold text-[#0A2540]">{q}</span>
                <FaChevronDown className="text-[#0A2540]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="bg-[#F0F6FF] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <FaBullhorn className="text-[#0A2540] text-5xl" />
              <div>
                <h3 className="text-xl font-bold text-[#0A2540]">Have a great abstract to share?</h3>
                <p className="text-zinc-500">Join researchers, academics, and professionals from around the world.</p>
              </div>
            </div>
            <Link href="/login" className="bg-[#0A2540] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#143b66] transition-colors flex items-center gap-2">
              Submit Your Abstract Now <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}