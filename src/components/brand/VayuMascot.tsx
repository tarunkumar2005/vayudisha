import React from 'react';

export type MascotPose =
  | 'greeting'
  | 'explaining'
  | 'celebrating'
  | 'cautious'
  | 'thinking'
  | 'alert'
  | 'peeking';

export interface VayuMascotProps {
  pose?: MascotPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  className?: string;
}

export function VayuMascot({
  pose = 'greeting',
  size = 'md',
  speechBubble,
  className = '',
}: VayuMascotProps) {
  const reactId = React.useId().replace(/:/g, '');
  const bodyGradId = `vayuBodyGrad-${reactId}`;
  const breezeGradId = `vayuBreezeGrad-${reactId}`;
  const saffronGradId = `vayuSaffronGrad-${reactId}`;

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  const dim = sizeMap[size] || 'w-24 h-24';

  const altTexts: Record<MascotPose, string> = {
    greeting: 'Vayu, your friendly air-quality companion, waving hello',
    explaining: 'Vayu pointing to explain clean-air guidance',
    celebrating: 'Vayu celebrating sustainable choices and clean air',
    cautious: 'Vayu carefully holding a safety shield for high-pollution conditions',
    thinking: 'Vayu thoughtfully analyzing air quality telemetry',
    alert: 'Vayu warning about severe air pollution conditions',
    peeking: 'Vayu peeking over the edge with curious eyes',
  };

  // Map aliases
  const effectivePose: MascotPose =
    pose === 'thinking' ? 'explaining' : pose === 'alert' ? 'cautious' : pose;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`${dim} flex-shrink-0 relative select-none`} title="Vayu — Air Companion">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
          role="img"
          aria-label={altTexts[pose] || altTexts.greeting}
        >
          <defs>
            <linearGradient id={bodyGradId} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#A7C5A0" />
              <stop offset="60%" stopColor="#159C89" />
              <stop offset="100%" stopColor="#174B36" />
            </linearGradient>
            <linearGradient id={breezeGradId} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#F6F4EB" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#159C89" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id={saffronGradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E07A18" />
              <stop offset="100%" stopColor="#EBA347" />
            </linearGradient>
          </defs>

          {/* Ambient Breeze Rings around Vayu */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#A7C5A0"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.3"
          />

          {/* Whimsical tail / breeze swirl */}
          <path
            d="M 34 88 C 22 96, 12 88, 16 78 C 20 68, 36 74, 46 80"
            stroke={`url(#${breezeGradId})`}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Main Leaf Body */}
          <path
            d="M 60 14 C 84 14, 98 42, 94 72 C 90 98, 66 106, 50 104 C 32 102, 24 84, 26 62 C 28 34, 44 14, 60 14 Z"
            fill={`url(#${bodyGradId})`}
          />

          {/* Soft Leaf Sprout on top */}
          <path d="M 60 14 C 58 4, 68 -2, 74 2 C 78 6, 74 16, 60 14 Z" fill="#A7C5A0" />
          <path d="M 60 14 C 54 6, 46 2, 42 6 C 38 10, 46 16, 60 14 Z" fill="#159C89" />

          {/* Leaf central curve / chest shine */}
          <path
            d="M 58 22 C 64 45, 60 75, 48 94"
            stroke="#F6F4EB"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Friendly Rosy Cheeks */}
          <ellipse cx="44" cy="58" rx="5" ry="3.5" fill="#EBA347" opacity="0.45" />
          <ellipse cx="76" cy="58" rx="5" ry="3.5" fill="#EBA347" opacity="0.45" />

          {/* Expressive Eyes & Mouth based on Pose */}
          {effectivePose === 'cautious' ? (
            <>
              {/* Thoughtful, careful eyes */}
              <ellipse cx="46" cy="50" rx="3.5" ry="4" fill="#174B36" />
              <ellipse cx="74" cy="50" rx="3.5" ry="4" fill="#174B36" />
              <circle cx="47" cy="48" r="1.2" fill="#FFFFFF" />
              <circle cx="75" cy="48" r="1.2" fill="#FFFFFF" />
              {/* Worried / focused eyebrows */}
              <path
                d="M 42 43 C 46 45, 50 46, 51 46"
                stroke="#174B36"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M 78 43 C 74 45, 70 46, 69 46"
                stroke="#174B36"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Small protective mask on Vayu */}
              <path
                d="M 46 56 C 52 54, 68 54, 74 56 C 76 68, 66 74, 60 74 C 54 74, 44 68, 46 56 Z"
                fill="#F6F4EB"
                stroke="#174B36"
                strokeWidth="1.5"
              />
              <path d="M 46 59 L 34 56" stroke="#174B36" strokeWidth="1" strokeLinecap="round" />
              <path d="M 74 59 L 86 56" stroke="#174B36" strokeWidth="1" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Cheerful big eyes */}
              <ellipse cx="46" cy="48" rx="4" ry="5.5" fill="#174B36" />
              <ellipse cx="74" cy="48" rx="4" ry="5.5" fill="#174B36" />
              <circle cx="48" cy="45" r="1.8" fill="#FFFFFF" />
              <circle cx="76" cy="45" r="1.8" fill="#FFFFFF" />
              <circle cx="44" cy="51" r="0.9" fill="#FFFFFF" />
              <circle cx="72" cy="51" r="0.9" fill="#FFFFFF" />

              {/* Gentle smile */}
              <path
                d="M 52 60 C 56 65, 64 65, 68 60"
                stroke="#174B36"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Pose-specific Accessories and Arms */}
          {effectivePose === 'greeting' && (
            <>
              {/* Waving right arm */}
              <path
                d="M 88 58 C 96 52, 104 42, 102 34 C 100 30, 95 32, 92 38 C 89 44, 85 52, 84 56"
                fill="#159C89"
                stroke="#174B36"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Motion lines near wave */}
              <path
                d="M 104 26 C 108 28, 110 32, 110 36"
                stroke="#EBA347"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 98 22 C 102 24, 105 28, 105 30"
                stroke="#EBA347"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Rest left arm */}
              <path
                d="M 28 62 C 22 66, 20 74, 24 78"
                stroke="#174B36"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {effectivePose === 'explaining' && (
            <>
              {/* Left arm holding compass/disha pointer */}
              <path
                d="M 30 64 C 20 62, 16 54, 20 48"
                stroke="#174B36"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Direction pointer in right hand */}
              <path
                d="M 86 64 C 94 60, 100 52, 104 42"
                stroke="#174B36"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M 100 42 L 108 38 L 108 48 Z" fill={`url(#${saffronGradId})`} />
            </>
          )}

          {effectivePose === 'celebrating' && (
            <>
              {/* Both arms up in celebration */}
              <path
                d="M 28 54 C 18 42, 16 32, 22 28 C 26 26, 28 34, 32 44"
                stroke="#174B36"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 90 54 C 100 42, 102 32, 96 28 C 92 26, 90 34, 86 44"
                stroke="#174B36"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Sparkle clean air stars */}
              <path
                d="M 16 20 L 18 24 L 22 26 L 18 28 L 16 32 L 14 28 L 10 26 L 14 24 Z"
                fill="#EBA347"
              />
              <path
                d="M 100 16 L 102 20 L 106 21 L 102 23 L 100 27 L 98 23 L 94 21 L 98 20 Z"
                fill="#159C89"
              />
            </>
          )}

          {effectivePose === 'cautious' && (
            <>
              {/* Left hand steady, right hand holding mini AQI badge */}
              <rect
                x="84"
                y="60"
                width="22"
                height="22"
                rx="6"
                fill="#FFFFFF"
                stroke="#EF4444"
                strokeWidth="1.5"
              />
              <text
                x="95"
                y="75"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                fontSize="9"
                fontWeight="800"
                fill="#EF4444"
              >
                AQI
              </text>
            </>
          )}

          {effectivePose === 'peeking' && (
            <>
              {/* Little leafy paws resting on bottom edge */}
              <ellipse cx="40" cy="100" rx="6" ry="4" fill="#A7C5A0" stroke="#174B36" strokeWidth="1.5" />
              <ellipse cx="78" cy="100" rx="6" ry="4" fill="#A7C5A0" stroke="#174B36" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </div>

      {speechBubble && (
        <div className="relative bg-white border border-[#E2DDD1] rounded-2xl px-4 py-2.5 shadow-soft text-sm text-[#174B36] max-w-xs font-semibold">
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-white border-b-6 border-b-transparent" />
          {speechBubble}
        </div>
      )}
    </div>
  );
}
export default VayuMascot;
