import React from 'react';

export interface VayuDishaLogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function VayuDishaLogo({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  showTagline = false,
  className = '',
}: VayuDishaLogoProps) {
  const isDark = theme === 'dark';

  // Sizing maps
  const heightClasses = {
    sm: variant === 'stacked' ? 'h-14' : 'h-7',
    md: variant === 'stacked' ? 'h-20' : 'h-9',
    lg: variant === 'stacked' ? 'h-28' : 'h-12',
    xl: variant === 'stacked' ? 'h-36' : 'h-16',
  };

  const currentHeight = heightClasses[size] || 'h-9';

  // Mark only
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentHeight} w-auto inline-block ${className}`}
        aria-label="VayuDisha Mark"
        role="img"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={isDark ? 'rgba(23, 75, 54, 0.4)' : '#F6F4EB'}
          stroke={isDark ? '#159C89' : '#A7C5A0'}
          strokeWidth="1.5"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={isDark ? '#1FAF96' : '#A7C5A0'}
          strokeWidth="1.5"
          strokeDasharray="4 5"
          opacity="0.6"
        />
        <path
          d="M 14 66 C 26 66, 34 78, 50 76 C 66 74, 78 60, 86 46"
          stroke="#159C89"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 20 42 C 30 32, 44 34, 56 38 C 68 42, 76 36, 88 24"
          stroke={isDark ? '#5EEAD4' : '#159C89'}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 28 72 C 24 50, 42 26, 76 18 C 78 44, 60 76, 28 72 Z"
          fill={isDark ? '#159C89' : '#174B36'}
        />
        <path
          d="M 30 70 C 44 58, 58 42, 74 20"
          stroke="#F6F4EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M 50 48 L 78 16 L 68 40 L 58 44 Z"
          fill="#EBA347"
        />
        <circle cx="78" cy="16" r="3.5" fill="#EBA347" />
      </svg>
    );
  }

  // Stacked variant
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-2"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill={isDark ? 'rgba(23, 75, 54, 0.4)' : '#F6F4EB'}
            stroke={isDark ? '#159C89' : '#A7C5A0'}
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isDark ? '#1FAF96' : '#A7C5A0'}
            strokeWidth="1.5"
            strokeDasharray="4 5"
            opacity="0.6"
          />
          <path
            d="M 14 66 C 26 66, 34 78, 50 76 C 66 74, 78 60, 86 46"
            stroke="#159C89"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 20 42 C 30 32, 44 34, 56 38 C 68 42, 76 36, 88 24"
            stroke={isDark ? '#5EEAD4' : '#159C89'}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 28 72 C 24 50, 42 26, 76 18 C 78 44, 60 76, 28 72 Z"
            fill={isDark ? '#159C89' : '#174B36'}
          />
          <path
            d="M 30 70 C 44 58, 58 42, 74 20"
            stroke="#F6F4EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M 50 48 L 78 16 L 68 40 L 58 44 Z"
            fill="#EBA347"
          />
          <circle cx="78" cy="16" r="3.5" fill="#EBA347" />
        </svg>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-2xl font-black tracking-tight ${
              isDark ? 'text-[#F6F4EB]' : 'text-[#174B36]'
            }`}
          >
            Vayu<span className={isDark ? 'text-[#5EEAD4]' : 'text-[#0F766E]'}>Disha</span>
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isDark
                ? 'bg-[#159C89]/20 text-[#5EEAD4] border border-[#159C89]/30'
                : 'bg-[#174B36]/10 text-[#174B36]'
            }`}
          >
            वायुदिशा
          </span>
        </div>
        {showTagline && (
          <p
            className={`text-[11px] font-semibold tracking-wider uppercase mt-1 ${
              isDark ? 'text-[#A7C5A0]' : 'text-[#587668]'
            }`}
          >
            Know your air · Choose a better direction
          </p>
        )}
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Mark */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentHeight} w-auto flex-shrink-0`}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={isDark ? 'rgba(23, 75, 54, 0.4)' : '#F6F4EB'}
          stroke={isDark ? '#159C89' : '#A7C5A0'}
          strokeWidth="1.5"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={isDark ? '#1FAF96' : '#A7C5A0'}
          strokeWidth="1.5"
          strokeDasharray="4 5"
          opacity="0.6"
        />
        <path
          d="M 14 66 C 26 66, 34 78, 50 76 C 66 74, 78 60, 86 46"
          stroke="#159C89"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 20 42 C 30 32, 44 34, 56 38 C 68 42, 76 36, 88 24"
          stroke={isDark ? '#5EEAD4' : '#159C89'}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 28 72 C 24 50, 42 26, 76 18 C 78 44, 60 76, 28 72 Z"
          fill={isDark ? '#159C89' : '#174B36'}
        />
        <path
          d="M 30 70 C 44 58, 58 42, 74 20"
          stroke="#F6F4EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M 50 48 L 78 16 L 68 40 L 58 44 Z"
          fill="#EBA347"
        />
        <circle cx="78" cy="16" r="3.5" fill="#EBA347" />
      </svg>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-tight leading-none ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-xl'
            } ${isDark ? 'text-[#F6F4EB]' : 'text-[#174B36]'}`}
          >
            Vayu<span className={isDark ? 'text-[#5EEAD4]' : 'text-[#0F766E]'}>Disha</span>
          </span>
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded leading-none ${
              isDark
                ? 'bg-[#159C89]/20 text-[#5EEAD4] border border-[#159C89]/30'
                : 'bg-[#174B36]/10 text-[#174B36]'
            }`}
          >
            वायुदिशा
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-1 leading-none ${
              isDark ? 'text-[#A7C5A0]' : 'text-[#587668]'
            }`}
          >
            Know your air · Choose a better direction
          </span>
        )}
      </div>
    </div>
  );
}
export default VayuDishaLogo;
