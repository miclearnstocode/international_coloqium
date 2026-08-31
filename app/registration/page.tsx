import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { 
  FaRegListAlt, FaUsers, FaGlobeAsia, FaUserTie, FaUserGraduate, FaUserCircle,
  FaRegCalendarAlt, FaInfoCircle, FaDollarSign, FaRegUser, FaMobileAlt,
  FaRegPaperPlane, FaBullseye, FaUniversity, FaRegFileAlt, FaChevronRight,
  FaRegCheckCircle, FaPaperPlane
} from "react-icons/fa";

export default function RegistrationPage() {
  const fees = [
    { icon: <FaGlobeAsia />, text: "International participants" },
    { icon: <FaUsers />, text: "Local professionals/researchers" },
    { icon: <FaUserTie />, text: "Faculty" },
    { icon: <FaUserGraduate />, text: "Graduate students" },
    { icon: <FaUserCircle />, text: "Undergraduate students" },
  ];

  const importantDates = [
    { icon: <FaRegPaperPlane />, title: "Call for Papers Open", date: "April 15, 2025" },
    { icon: <FaRegFileAlt />, title: "Full Paper Submission Deadline", date: "June 30, 2025" },
    { icon: <FaRegCheckCircle />, title: "Notification of Acceptance", date: "July 25, 2025" },
    { icon: <FaDollarSign />, title: "Early Bird Payment Deadline", date: "July 31, 2025" },
    { icon: <FaRegUser />, title: "Regular Payment Deadline", date: "August 31, 2025" },
    { icon: <FaRegCalendarAlt />, title: "Colloquium Dates", date: "October 15-17, 2025" },
  ];

  const steps = [
    { icon: <FaRegFileAlt />, title: "Fill out the Online Registration Form", desc: "Provide all required information in the registration form." },
    { icon: <FaRegPaperPlane />, title: "Receive Confirmation Email", desc: "You will receive a confirmation email with payment instructions." },
    { icon: <FaUniversity />, title: "Pay the Registration Fee", desc: "Pay the registration fee through bank transfer." },
    { icon: <FaRegPaperPlane />, title: "Submit Proof of Payment", desc: "Upload or email your proof of payment." },
    { icon: <FaRegCheckCircle />, title: "Registration Confirmation", desc: "Your registration will be confirmed and a receipt will be sent to you." },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540] flex flex-col">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-350 mx-auto px-8 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Registration</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Registration</h1>
              <div className="w-16 h-1 bg-[#D5A54D] mb-6"></div>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Join researchers, innovators, and professionals from around the world and be part of the International Colloquium 2025.
              </p>
            </div>
            
            {/* Registration Image (Requires /images/registration-clipboard.png) */}
            <div className="hidden md:flex justify-end items-center">
              <img src="/images/registration-clipboard.png" alt="Registration" className="w-100 object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEES & INFORMATION ================= */}
      <section className="py-16">
        <div className="max-w-350 mx-auto px-8">
          
          {/* Changed to items-start so the left card does NOT stretch to match the table's massive height */}
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            
            {/* Left: Fees */}
            <div className="w-full md:w-1/2">
              <div className="bg-[#0A2540] text-white p-5 flex items-center gap-3 rounded-t-xl">
                <FaRegListAlt className="text-xl" />
                <h2 className="text-lg font-bold uppercase">Registration Fees</h2>
              </div>
              
              <div className="bg-white border border-t-0 border-zinc-200 rounded-b-xl p-9 flex flex-col h-[530]">
                <h3 className="text-sm font-bold text-[#0A2540] uppercase mb-6">A. Registration fees:</h3>
                <p className="text-5xl font-bold text-[#0A2540] mb-8">P 4,500.00</p>
                
                <ul className="space-y-4 mb-8">
                  {fees.map((fee, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-zinc-600">
                      <span className="text-[#0A2540] text-lg">{fee.icon}</span>
                      <span className="text-sm">{fee.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto bg-[#F0F6FF] border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
                  <FaInfoCircle className="text-[#0A2540] mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-600">The registration fee covers participation in all sessions, conference materials, certificates, and meals during the event.</p>
                </div>
              </div>
            </div>

            {/* Right: Table */}
            <div className="w-full md:w-1/2">
              <div className="bg-[#0A2540] text-white p-5 flex items-center gap-3 rounded-t-xl">
                <FaUsers className="text-xl" />
                <h2 className="text-lg font-bold uppercase">Registration Information by Participant</h2>
              </div>

              <div className="bg-white border border-t-0 border-zinc-200 rounded-b-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#1D3D6D] text-white uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Participant Category</th>
                      <th className="px-6 py-3">Description / Eligibility</th>
                      <th className="px-6 py-3">Registration Fee (PHP)</th>
                      <th className="px-6 py-3">Inclusions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-600">
                    {[
                      { cat: "International Participants", desc: "Participants from other countries", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Local Professionals / Researchers", desc: "Professionals and researchers in the field", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Faculty", desc: "Full-time faculty members", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Graduate Students", desc: "Currently enrolled graduate students", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Undergraduate Students", desc: "Currently enrolled undergraduate students", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="px-6 py-2 font-semibold text-[#0A2540]">{row.cat}</td>
                        <td className="px-6 py-2">{row.desc}</td>
                        <td className="px-6 py-2 font-medium">4,500.00</td>
                        <td className="px-6 py-2">
                          <ul className="space-y-0.5">
                            {row.inc.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs whitespace-nowrap">
                                <span className="text-[#F5A623] mt-0.5">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= DATES, STEPS & POLICY ================= */}
      <section className="bg-white py-16 border-t border-zinc-100">
        <div className="max-w-350 mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Important Dates */}
          <div>
            <div className="bg-[#0A2540] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaRegCalendarAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Important Dates</h2>
            </div>
            
            <div className="bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 relative">
              
              {/* The Vertical Connecting Line */}
              <div className="absolute left-9.75 top-12 bottom-12 w-0.5 bg-zinc-200"></div>

              <div className="space-y-6 relative">
                {importantDates.map((date, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    
                    {/* Icon Container (Added z-10 and bg-white to sit on top of the line) */}
                    <div className="w-10 h-10 rounded-full bg-[#F0F6FF] border-2 border-white text-[#1D3D6D] flex items-center justify-center text-lg shrink-0 relative z-10">
                      {date.icon}
                    </div>
                    
                    <div>
                      <p className="font-semibold text-[#0A2540] text-sm mb-0.5">{date.title}</p>
                      <p className="text-sm text-zinc-500">{date.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps for Registration */}
          <div>
            <div className="bg-[#0A2540] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaBullseye className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Steps for Registration</h2>
            </div>
            
            <div className="bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 relative">
              
              {/* The Vertical Connecting Line */}
              <div className="absolute left-9.75 top-12 bottom-12 w-0.5 bg-zinc-200"></div>

              <div className="space-y-6 relative">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    
                    {/* Numbered Icon Container */}
                    <div className="w-10 h-10 rounded-full bg-[#F0F6FF] border-2 border-white text-[#1D3D6D] flex items-center justify-center text-lg shrink-0 relative z-10 font-bold">
                      {/* The Step Number */}
                      <span className="text-sm">{idx + 1}</span>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-[#0A2540] text-sm mb-0.5">{step.title}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancel Policy */}
          <div>
            <div className="bg-[#0A2540] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaRegListAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Cancel Policy</h2>
            </div>
            <div className="bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 h-full flex flex-col">
              <p className="text-sm text-zinc-600 mb-6">Cancellations must be sent in writing to the Secretariat.</p>
              
              <ul className="space-y-4 text-sm text-zinc-600 mb-8">
                <li className="flex gap-2">
                  <span className="font-bold text-[#0A2540]">•</span> On or before June 30, 2025 <br /> – 50% refund
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#0A2540]">•</span> On or before July 31, 2025 <br /> – 25% refund
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#0A2540]">•</span> After July 31, 2025 <br /> – No refund
                </li>
              </ul>

              <div className="mt-auto bg-[#FFF5F5] border border-red-100 rounded-lg p-4 flex gap-3 items-start">
                <FaInfoCircle className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-600">
                  <span className="font-bold text-[#0A2540]">Substitutions are allowed</span> at any time by notifying the Secretariat.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PAYMENT INFO ================= */}
      <section className="py-16">
        <div className="max-w-350 mx-auto px-8">
          
          {/* Centered block to prevent it from stretching too wide */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0A2540] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaRegListAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Paying Registration Account</h2>
            </div>
            
            <div className="bg-white border border-t-0 border-zinc-200 rounded-b-xl p-8">
              {/* Main 3-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                
                {/* Left: Account Info (Fixed labels) */}
                <div className="space-y-6">
                  <div className="grid grid-cols-[160px_1fr] gap-4 text-sm">
                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Name</span>
                    <span className="text-zinc-600">IC2025 Organizing Committee</span>
                    
                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Bank Name</span>
                    <span className="text-zinc-600">Banco de Oro (BDO)</span>
                    
                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Number</span>
                    <span className="text-zinc-600">0123 4567 8901</span>
                    
                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Type</span>
                    <span className="text-zinc-600">Savings Account</span>
                    
                    <span className="font-bold text-[#0A2540] whitespace-nowrap">SWIFT/BIC</span>
                    <span className="text-zinc-600">BNORPHMM</span>
                  </div>
                </div>

                {/* Center: Bank Graphic (Dedicated Column) */}
                <div className="flex justify-center items-center h-full py-4 md:py-0">
                  <FaUniversity className="text-[#1D3D6D] text-8xl drop-shadow-sm" />
                </div>

                {/* Right: Email Instructions (Stretched) */}
                <div className="bg-[#F0F6FF] border border-blue-100 rounded-lg p-6 h-full flex flex-col justify-center">
                  <div className="flex items-start gap-3">
                    <FaRegFileAlt className="text-[#0A2540] mt-1 text-xl shrink-0" />
                    <div>
                      <p className="font-bold text-[#0A2540] text-sm mb-2">Please email or upload your proof of payment</p>
                      <div className="text-xs text-zinc-600 space-y-1">
                        <p>Email: <span className="font-semibold text-[#0A2540]">ic2025.secretariat@example.com</span></p>
                        <p>Subject: <span className="font-semibold text-[#0A2540]">IC2025 Payment – [Your Name]</span></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
      {/* ================= BOTTOM CTA ================= */}
      <section className="pb-20">
        <div className="max-w-350 mx-auto px-8">
          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <FaPaperPlane className="text-[#1D3D6D] text-3xl rotate-[-20deg]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1">Be Part of Global Discussions</h3>
                <p className="text-zinc-500">Secure your slot today and join us in shaping a sustainable future through research, innovation, and collaboration.</p>
              </div>
            </div>
            <button className="bg-[#1D3D6D] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#143b66] transition-colors flex items-center gap-2 shrink-0">
              Register Now <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}