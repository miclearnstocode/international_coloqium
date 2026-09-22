export const getCategoryColor = (category: string) => {
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