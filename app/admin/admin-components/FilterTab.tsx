export const FilterTab = ({ label, count, active = false, color = 'blue', onClick }: {
  label: string; count: number; active?: boolean; color?: string; onClick: () => void;
}) => {
  const cls = active
    ? 'bg-blue-600 text-white'
    : color === 'green'
      ? 'bg-green-100 text-green-700 hover:bg-green-200'
      : color === 'yellow'
        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cls}`}>
      {label}
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-50'}`}>{count}</span>
    </button>
  );
};