import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = 'Back', className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary bg-white hover:bg-teal-50 px-4 py-2 rounded-xl border border-gray-200 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
