"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaFileAlt, FaCheckCircle, FaClock, FaUsers, FaLaptop, 
  FaMicrophone, FaVideo, FaQuestionCircle, FaDownload,
  FaPrint, FaCalendarAlt, FaBookOpen, FaDesktop, FaMobileAlt,
  FaFilePowerpoint, FaImage, FaRuler, FaPalette, FaShareAlt,
  FaHashtag, FaEnvelope, FaUserGraduate, FaUniversity, FaIdCard
} from "react-icons/fa";

export default function PresentationGuidelinesPage() {
  const oralGuidelines = [
    {
      title: "Talk Duration",
      description: "Each talk is allocated 10 minutes for presentation plus 5 minutes for Q&A, making 15 minutes total.",
      icon: <FaClock />
    },
    {
      title: "Language",
      description: "All talks must be presented in English.",
      icon: <FaMicrophone />
    },
    {
      title: "Slide Management",
      description: "Average of about one slide per minute. Complicated slides take longer.",
      icon: <FaFilePowerpoint />
    },
    {
      title: "File Submission",
      description: "Submit PowerPoint presentations at the registration desk upon check-in. Label your USB with your name.",
      icon: <FaFileAlt />
    },
    {
      title: "Compatibility Check",
      description: "Test your presentation at least 15 minutes before your session. If using Mac, ensure PC compatibility.",
      icon: <FaLaptop />
    },
    {
      title: "Arrival Time",
      description: "Arrive at assigned rooms 30 minutes before the session starts. Introduce yourself to the chairperson.",
      icon: <FaUsers />
    }
  ];

  const posterGuidelines = [
    {
      title: "Poster Size",
      description: "36 inches (width) × 48 inches (height) - Portrait orientation only.",
      icon: <FaRuler />
    },
    {
      title: "Font Requirements",
      description: "Title: 72pt bold uppercase | Authors: 48pt | Headings: 36pt | Body: 24pt | Font: Arial",
      icon: <FaFileAlt />
    },
    {
      title: "Color and Design",
      description: "Use high-contrast colors for readability. Avoid overly bright or dark backgrounds.",
      icon: <FaPalette />
    },
    {
      title: "Required Sections",
      description: "Title, Authors/Affiliations, Abstract (max 300 words), Introduction, Methodology, Results/Discussion, Conclusion, References.",
      icon: <FaBookOpen />
    },
    {
      title: "Setup Time",
      description: "Mount your poster 1 hour before the presentation on allocated boards.",
      icon: <FaClock />
    },
    {
      title: "Poster Removal",
      description: "Remove your poster on the last afternoon. Posters left after will not be the responsibility of organizers.",
      icon: <FaPrint />
    },
    {
      title: "Be Present",
      description: "Stand by your poster during sessions to answer questions and discuss your work.",
      icon: <FaUsers />
    },
    {
      title: "Extra Copies",
      description: "Print 15-20 copies of your poster on bond paper to place beside your mounted poster.",
      icon: <FaShareAlt />
    }
  ];

  const fullPaperStructure = [
    { page: "Page 1", content: "Complete authors' and/or co-authors name, designation, agency/institutional affiliation, mailing addresses, email addresses" },
    { page: "Page 2", content: "Title of Article\nAbstract (at most 200 words in one paragraph)\nKey words (at least two)" },
    { page: "Page 3 onwards", content: "INTRODUCTION (with clearly specified objectives)\nMATERIALS AND METHODS\nRESULTS AND DISCUSSIONS\nCONCLUSIONS AND RECOMMENDATIONS\nACKNOWLEDGMENT (if any)\nREFERENCES" }
  ];

  const posterContent = [
    "Title – Concise and reflective of the study focus",
    "Authors and Affiliations – Full names, institutions, and email addresses",
    "Abstract – Maximum of 300 words",
    "Introduction – Background, problem statement, and objectives",
    "Methodology – Materials, methods, procedures (diagrams encouraged)",
    "Results and Discussion – Key findings with tables, figures, or graphs",
    "Conclusion and Recommendations – Summary and future directions",
    "References – Key references (APA style recommended)",
    "Acknowledgments (Optional) – Funding sources and contributors"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540]">
      <Header />
      
      {/* ================= PAGE HERO WITH IMAGE ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Presentation Guidelines</span>
          </div>

          {/* Content with Image on Right */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left Side - Text Content */}
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Presentation Guidelines</h1>
              <div className="w-16 h-1 bg-[#F5A623] mb-4"></div>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                3rd International Agri-Life and Bioresource Sciences Symposium
              </p>
              <p className="text-sm text-gray-500 mt-1">
                March 10-13, 2027 | Roxas City, Capiz, Philippines – The Seafood Capital of the Philippines
              </p>
            </div>

            {/* Right Side - Image */}
            <Image 
              src="/images/guideline.png" 
              alt="Presentation Guidelines" 
              width={500} 
              height={300} 
              className="shrink-0 rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* ================= GUIDELINES FOR ORAL PRESENTATION ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FaMicrophone className="text-[#F5A623] text-3xl" />
              <h2 className="text-3xl font-bold text-[#0A2540]">Guidelines for Oral Presentation</h2>
            </div>
            <div className="w-16 h-1 bg-[#F5A623] mb-4"></div>
            <p className="text-gray-600">
              If your presentation has already been accepted, please find the appropriate sections below on how to prepare it, and read them carefully.
            </p>
          </div>

          {/* Oral Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {oralGuidelines.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[#F5A623] text-2xl mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A2540] text-sm mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audiovisual Aids Section */}
          <div className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 mb-12">
            <h3 className="font-bold text-[#0A2540] text-lg mb-3">Audiovisual Aids</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#F5A623] mt-1 shrink-0" />
                <span>Speakers should hand over their PowerPoint presentation at the registration desk when they first check in to the conference so that it can be loaded onto our computer's hard disk.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#F5A623] mt-1 shrink-0" />
                <span>Please label your memory stick with your name.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#F5A623] mt-1 shrink-0" />
                <span>Run through your presentation in advance (at least 15 minutes before your oral presentations) to ensure compatibility with local hardware and software.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#F5A623] mt-1 shrink-0" />
                <span>If you have prepared your PowerPoint presentation on an Apple Macintosh computer, we strongly advise you to check that it works correctly on a PC before coming to the conference.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#F5A623] mt-1 shrink-0" />
                <span>All speakers should arrive at the assigned rooms 30 minutes prior to the start of their session.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FULL PAPER SUBMISSIONS ================= */}
      <section className="py-16 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaFileAlt className="text-[#F5A623] text-3xl" />
              <h2 className="text-3xl font-bold text-white">Full Paper Submissions</h2>
            </div>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto"></div>
            <p className="text-gray-300 mt-4">
              Presenters accepted for Oral Presentation are requested to submit their full manuscript to be considered for publication in the Special Issue.
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#0A2540] text-white px-6 py-4">
              <div className="col-span-3 font-bold uppercase text-sm">Page</div>
              <div className="col-span-9 font-bold uppercase text-sm">Content</div>
            </div>

            {/* Table Rows */}
            {fullPaperStructure.map((item, idx) => (
              <div 
                key={idx}
                className={`grid grid-cols-12 px-6 py-4 border-b border-zinc-100 last:border-b-0 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'
                }`}
              >
                <div className="col-span-3">
                  <span className="font-bold text-[#0A2540]">{item.page}</span>
                </div>
                <div className="col-span-9">
                  <span className="text-sm text-gray-700 whitespace-pre-line">{item.content}</span>
                </div>
              </div>
            ))}

            {/* Additional Formatting Info */}
            <div className="bg-gray-50 px-6 py-4 border-t border-zinc-200">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Formatting:</strong> Double-spaced on A4 (210 x 297 mm) paper size, with margins of 2.54 cm on all sides.</p>
                <p><strong>Font:</strong> 12 points Times New Roman.</p>
                <p><strong>Spacing:</strong> Sentences separated by one character space. Paragraphs separated by three (3) line spaces.</p>
                <p><strong>Figures & Tables:</strong> Integrated in the flow of discussion. Mentioned separately in numerical sequence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GUIDELINES FOR POSTER PRESENTORS ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FaImage className="text-[#F5A623] text-3xl" />
              <h2 className="text-3xl font-bold text-[#0A2540]">Guidelines for Poster Presenters</h2>
            </div>
            <div className="w-16 h-1 bg-[#F5A623] mb-4"></div>
            <p className="text-gray-600">
              The Poster Presentation Category provides participants with an opportunity to communicate their research in a concise, visually engaging, and interactive format.
            </p>
          </div>

          {/* Poster Format and Layout */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0A2540] mb-4">A. Poster Format and Layout</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center">
                <div className="text-[#F5A623] text-3xl mb-2"><FaRuler /></div>
                <p className="font-bold text-[#0A2540]">Poster Size</p>
                <p className="text-sm text-gray-600">36" × 48" (Portrait)</p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center">
                <div className="text-[#F5A623] text-3xl mb-2"><FaFileAlt /></div>
                <p className="font-bold text-[#0A2540]">Font</p>
                <p className="text-sm text-gray-600">Arial, Multiple Sizes</p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center">
                <div className="text-[#F5A623] text-3xl mb-2"><FaPalette /></div>
                <p className="font-bold text-[#0A2540]">Design</p>
                <p className="text-sm text-gray-600">High Contrast Colors</p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center">
                <div className="text-[#F5A623] text-3xl mb-2"><FaClock /></div>
                <p className="font-bold text-[#0A2540]">Setup</p>
                <p className="text-sm text-gray-600">1 Hour Before Session</p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 mb-6">
              <h4 className="font-bold text-[#0A2540] mb-2">Font Requirements</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Title:</strong> At least 72 pt, bold, uppercase</li>
                <li>• <strong>Author(s):</strong> At least 48 pt (include affiliation and email address)</li>
                <li>• <strong>Section Headings:</strong> At least 36 pt</li>
                <li>• <strong>Body Text:</strong> At least 24 pt</li>
                <li>• <strong>Font Style:</strong> Arial</li>
              </ul>
            </div>
          </div>

          {/* Poster Content */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0A2540] mb-4">B. Poster Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posterContent.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl border border-zinc-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#F5A623] mt-1 shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Display Requirements */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0A2540] mb-4">C. Display Requirements</h3>
            <div className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6">
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start gap-3">
                  <FaPrint className="text-[#F5A623] mt-1 shrink-0" />
                  <span><strong>Bring a printed poster</strong> for on-site display</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaClock className="text-[#F5A623] mt-1 shrink-0" />
                  <span><strong>Mount the poster</strong> 1 hour before the presentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaUserGraduate className="text-[#F5A623] mt-1 shrink-0" />
                  <span><strong>Include a picture</strong> of yourself so attendees can easily find you</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaUniversity className="text-[#F5A623] mt-1 shrink-0" />
                  <span><strong>Include collaborators' names</strong> and logos of funders or host institution</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaShareAlt className="text-[#F5A623] mt-1 shrink-0" />
                  <span><strong>Share your poster</strong> on social media with #3rdIALSS</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaPrint className="text-[#F5A623] mt-1 shrink-0" />
                  <span><strong>Print 15-20 copies</strong> of your poster on bond paper to place beside your mounted poster</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-[#F5A623]/10 rounded-xl border border-[#F5A623] p-6">
            <h4 className="font-bold text-[#0A2540] text-lg mb-2">💡 Pro Tips</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Consider including a picture of yourself (maybe in the field) so attendees can find you easily.</li>
              <li>• Don't forget to include names of collaborators and logos of funders or your host institution.</li>
              <li>• Include a web or email address, or a sign-up sheet for people to leave their email address.</li>
              <li>• Upload your poster to SlideShare and share on social media with #3rdIALSS.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#0A2540] mb-4">For Additional Concerns</h2>
          <div className="w-16 h-1 bg-[#F5A623] mx-auto mb-6"></div>
          <p className="text-gray-600 mb-4">
            Please contact us through:
          </p>
          <div className="inline-flex items-center gap-3 bg-[#F8FAFC] rounded-lg px-6 py-3 border border-zinc-200">
            <FaEnvelope className="text-[#F5A623] text-xl" />
            <span className="text-[#0A2540] font-medium">rde@capsu.edu.ph</span>
          </div>
        </div>
      </section>

      {/* ================= DOWNLOAD GUIDELINES ================= */}
       <section className="py-16 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c]">
  <div className="max-w-7xl mx-auto px-6">
    <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
      <h2 className="text-2xl font-bold text-[#0A2540] mb-4">
        Download Complete Guidelines
      </h2>
      <p className="text-gray-600 mb-6">
        Get the full presentation guidelines document in PDF format.
      </p>

      {/* Download attribute (Forces download) */}
      <Link 
        href="/documents/presentation-guidelines.pdf" 
        download
        className="inline-flex items-center gap-3 bg-[#F5A623] text-[#0A2540] px-8 py-4 rounded-lg font-bold hover:bg-[#e0950f] transition-colors hover:scale-105 transform duration-200 shadow-md hover:shadow-lg"
      >
        <FaDownload className="text-lg" /> 
        Download Presentation Guidelines (PDF)
      </Link>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
}