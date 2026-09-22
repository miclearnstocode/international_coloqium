"use client";

import React, { useState } from 'react';
import { 
  FaHome, FaFileAlt, FaCalendarAlt, FaFlask, FaUserPlus, FaFilePdf, 
  FaMapMarkedAlt, FaUniversity, FaImages, FaUsers, FaCog, FaBell, 
  FaSearch, FaPlus, FaFilter, FaEllipsisH, FaEdit, FaEye, FaCopy, 
  FaArchive, FaChevronRight, FaChevronLeft, FaBars, FaLeaf, FaUser, FaChevronDown, FaInfoCircle, FaBullhorn, FaImage
} from 'react-icons/fa';

// --- Mock Data based on the image ---
const pagesData = [
  { id: 1, title: 'Home', slug: '/', category: 'Home', status: 'Published', updated: 'Sep 16, 2025 10:24 AM' },
  { id: 2, title: 'About', slug: '/about-us', category: 'About', status: 'Published', updated: 'Sep 15, 2025 04:12 PM' },
  { id: 3, title: 'Program', slug: '/program', category: 'Program', status: 'Published', updated: 'Sep 15, 2025 03:45 PM' },
  { id: 4, title: 'Scientific Tracks', slug: '/scientific-tracks', category: 'Scientific Tracks', status: 'Published', updated: 'Sep 14, 2025 11:20 AM' },
  { id: 5, title: 'Abstract Submission', slug: '/abstract-submission', category: 'Abstract Submission', status: 'Published', updated: 'Sep 14, 2025 09:32 AM' },
  { id: 6, title: 'Registration', slug: '/registration', category: 'Registration', status: 'Published', updated: 'Sep 13, 2025 05:17 PM' },
  { id: 7, title: 'Guidelines', slug: '/presentation-guidelines', category: 'Guidelines', status: 'Published', updated: 'Sep 12, 2025 02:41 PM' },
  { id: 8, title: 'Partner Institutions', slug: '/partner-institutions', category: 'Partner Institutions', status: 'Published', updated: 'Sep 12, 2025 11:06 AM' },
  { id: 9, title: 'Hotel & Mapping', slug: '/hotel-mapping', category: 'Hotel & Mapping', status: 'Published', updated: 'Sep 11, 2025 03:22 PM' },
  { id: 10, title: 'Contact Us', slug: '/contact-us', category: 'Contact Us', status: 'Draft', updated: 'Sep 10, 2025 01:14 PM' }
];

export default function AdminPages() {
  const [selectedPage, setSelectedPage] = useState(pagesData[0]);
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
            {/* Logo Placeholder */}
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <FaLeaf className="text-xl" />
            </div>
            <div>
                <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">3rd International</h1>
                <h2 className="text-sm font-bold text-green-800 leading-tight">Agri-Life & BioresourceScience Symposium</h2>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem icon={<FaHome />} label="Dashboard" />
          <NavItem icon={<FaFileAlt />} label="Pages" active />
          <NavItem icon={<FaCalendarAlt />} label="News & Events" />
          <NavItem icon={<FaFlask />} label="Scientific Program" />
          <NavItem icon={<FaUserPlus />} label="Registration Details" />
          <NavItem icon={<FaFilePdf />} label="Presentation Guidelines" />
          <NavItem icon={<FaMapMarkedAlt />} label="Venue Map" />
          <NavItem icon={<FaUniversity />} label="Partner Institutions" />
          <NavItem icon={<FaImages />} label="Media Library" />
          <NavItem icon={<FaUsers />} label="Users & Roles" />
          <NavItem icon={<FaCog />} label="Settings" />
        </nav>

        <div className="p-4 mt-auto">
            <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <FaLeaf className="text-2xl" />
                </div>
                <p className="text-xs text-gray-600 mb-2">Manage your symposium website content, event details, and logistics — all in one place.</p>
                <div className="w-8 h-1 bg-green-500 mx-auto rounded-full mb-2"></div>
                <p className="text-[10px] text-gray-400">Keep your audience informed and engaged.</p>
            </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 ml-64 flex flex-col">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="relative w-96">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search pages, content, or menu..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative">
                    <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="flex items-center gap-3 border-l pl-6">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <FaUser className="text-lg" />
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-gray-800">Admin</p>
                        <p className="text-xs text-gray-500">System Administrator</p>
                    </div>
                    <FaChevronDown className="text-gray-400 text-xs" />
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden">
            
            {/* Left Column: Pages List */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Breadcrumb & Title */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <FaHome />
                        <FaChevronRight className="text-xs" />
                        <span>Pages</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">Pages</h1>
                            <p className="text-sm text-gray-500">Manage the content of the 3rd International Agri-Life & BioresourceScience Symposium website.</p>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                            <FaPlus /> Add New Page
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FilterTab label="All Pages" count={11} active />
                        <FilterTab label="Published" count={9} color="green" />
                        <FilterTab label="Draft" count={2} color="yellow" />
                        <FilterTab label="Archived" count={0} />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                            <input type="text" placeholder="Search pages..." className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50">
                            <FaFilter className="text-xs" /> All Categories <FaChevronDown className="text-xs" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                                    <th className="px-6 py-4">Page Title</th>
                                    <th className="px-6 py-4">URL Slug</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Updated</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {pagesData.map((page) => (
                                    <tr 
                                        key={page.id} 
                                        onClick={() => setSelectedPage(page)}
                                        className={`cursor-pointer transition-colors ${selectedPage.id === page.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedPage.id === page.id}
                                                onChange={() => setSelectedPage(page)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{page.slug}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(page.category)}`}>
                                                {page.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {page.updated.split(' ').slice(0, 3).join(' ')}<br/>
                                            <span className="text-gray-400">{page.updated.split(' ').slice(3).join(' ')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <FaEllipsisH />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Footer */}
                    <div className="mt-auto border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
                        <span className="text-xs text-gray-500">Showing 1–11 of 11 pages</span>
                        <div className="flex items-center gap-2">
                            <button className="p-1 rounded border border-gray-300 text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled><FaChevronLeft className="text-xs" /></button>
                            <button className="w-6 h-6 rounded bg-blue-600 text-white text-xs flex items-center justify-center">1</button>
                            <button className="p-1 rounded border border-gray-300 text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled><FaChevronRight className="text-xs" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Details Panel */}
            <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Page Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('editor')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Content Editor
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            {/* Image Placeholder */}
                            <div className="w-full h-32 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                                <FaImage className="text-blue-300 text-4xl" />
                            </div>

                            {/* Title & Status */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{selectedPage.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">{selectedPage.slug}</p>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    {selectedPage.status}
                                </span>
                            </div>

                            {/* Meta Info */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Category</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedPage.category)}`}>{selectedPage.category}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="text-gray-800 text-xs">{selectedPage.updated}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-gray-800 text-xs">Sep 01, 2025 09:12 AM</span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* SEO Settings */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3">SEO Settings</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
                                        <input type="text" defaultValue="3rd International Agri-Life & BioresourceScience Symposium" className="w-full p-2 border border-gray-300 rounded text-xs text-gray-600 focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                                        <textarea rows={3} defaultValue="Join the 3rd International Agri-Life & BioresourceScience Symposium. Advancing sustainable agriculture, life sciences, and bioresource innovation for a better tomorrow." className="w-full p-2 border border-gray-300 rounded text-xs text-gray-600 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Visibility */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Page Visibility</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                                    </div>
                                    <span className="text-xs text-gray-600">Visible on website</span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Quick Actions */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded text-xs font-medium hover:bg-blue-700">
                                        <FaEdit /> Edit Page
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded text-xs font-medium hover:bg-green-100 border border-green-200">
                                        <FaEye /> View Page
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-orange-50 text-orange-700 py-2 rounded text-xs font-medium hover:bg-orange-100 border border-orange-200">
                                        <FaCopy /> Duplicate
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-red-50 text-red-700 py-2 rounded text-xs font-medium hover:bg-red-100 border border-red-200">
                                        <FaArchive /> Archive
                                    </button>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Content Blocks */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-bold text-gray-800">Page Content Blocks</h4>
                                    <a href="#" className="text-xs text-blue-600 hover:underline">Manage Blocks</a>
                                </div>
                                <div className="space-y-2">
                                    <ContentBlockItem icon={<FaFileAlt />} title="Hero Section" desc="Main banner with event title and CTA" />
                                    <ContentBlockItem icon={<FaInfoCircle />} title="About Symposium" desc="Overview and key highlights" />
                                    <ContentBlockItem icon={<FaCalendarAlt />} title="Important Dates" desc="Schedule and deadlines" />
                                    <ContentBlockItem icon={<FaFlask />} title="Scientific Tracks" desc="Research areas and themes" />
                                    <ContentBlockItem icon={<FaBullhorn />} title="Announcements" desc="Latest news and updates" />
                                    <ContentBlockItem icon={<FaBullhorn />} title="Call-to-Action" desc="Register and get involved" />
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Content Editor Placeholder
                        </div>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
        <span className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
        {label}
    </a>
);

const FilterTab = ({ label, count, active = false, color = 'blue' }: { label: string, count: number, active?: boolean, color?: string }) => {
    let colorClasses = '';
    if (active) {
        colorClasses = 'bg-blue-600 text-white';
    } else {
        if (color === 'green') colorClasses = 'bg-green-100 text-green-700 hover:bg-green-200';
        else if (color === 'yellow') colorClasses = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        else colorClasses = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }

    return (
        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${colorClasses}`}>
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-50'}`}>{count}</span>
        </button>
    );
};

const ContentBlockItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 cursor-pointer group">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-sm">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{title}</p>
            <p className="text-[10px] text-gray-500 truncate">{desc}</p>
        </div>
        <FaChevronRight className="text-gray-300 text-xs group-hover:text-blue-500" />
    </div>
);

// --- Utility Functions ---

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Home': return 'bg-blue-100 text-blue-700';
        case 'Submission': return 'bg-purple-100 text-purple-700';
        case 'About': return 'bg-cyan-100 text-cyan-700';
        case 'Registration': return 'bg-green-100 text-green-700';
        case 'Guidelines': return 'bg-orange-100 text-orange-700';
        case 'Logistics': return 'bg-teal-100 text-teal-700';
        case 'Program': return 'bg-indigo-100 text-indigo-700';
        case 'Contact': return 'bg-gray-100 text-gray-700';
        case 'Partners': return 'bg-pink-100 text-pink-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};