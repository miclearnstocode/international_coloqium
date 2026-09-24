"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaFileAlt,
  FaCalendarAlt,
  FaFlask,
  FaUserPlus,
  FaFilePdf,
  FaMapMarkedAlt,
  FaUniversity,
  FaImages,
  FaUsers,
  FaCog,
  FaLeaf,
} from "react-icons/fa";


const NavItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const pathname = usePathname();

  const active =
    pathname === href ||
    (href !== "/admin" && pathname?.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className={`text-lg ${active ? "text-blue-600" : "text-gray-400"}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
};

export const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
    {/* Logo / Brand */}
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
        <FaLeaf className="text-xl" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-green-800 leading-tight">
          Agri-Life &amp; Bioresource Sciences International Symposium 
        </h2>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
      <NavItem icon={<FaHome />} label="Dashboard" href="/dashboard" />
      <NavItem icon={<FaFileAlt />} label="Pages" href="/admin" />
      <NavItem icon={<FaCalendarAlt />} label="News & Events" href="/admin/news-events" />
      <NavItem icon={<FaUsers />} label="Users & Roles" href="/admin/users-roles" />
    </nav>

    {/* Bottom info card */}
    <div className="p-4 mt-auto">
      <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
        <div className="w-12 h-12 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center text-green-600">
          <FaLeaf className="text-2xl" />
        </div>
        <p className="text-xs text-gray-600 mb-2">
          Manage your symposium website content, event details, and logistics — all in one place.
        </p>
        <div className="w-8 h-1 bg-green-500 mx-auto rounded-full mb-2"></div>
        <p className="text-[10px] text-gray-400">
          Keep your audience informed and engaged.
        </p>
      </div>
    </div>
  </aside>
);