import React from 'react';

interface UmbrellaProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function GaanBristyUmbrella({ className = '', style }: UmbrellaProps) {
  return (
    <div className={`inline-block filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${className}`} style={style}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue segment gradient */}
          <linearGradient id="blueSeg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C3FF" />
            <stop offset="50%" stopColor="#0072FF" />
            <stop offset="100%" stopColor="#0038A8" />
          </linearGradient>

          {/* Magenta segment gradient */}
          <linearGradient id="magentaSeg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0007B" />
            <stop offset="60%" stopColor="#A0005C" />
            <stop offset="100%" stopColor="#700040" />
          </linearGradient>

          {/* Yellow segment gradient */}
          <linearGradient id="yellowSeg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF200" />
            <stop offset="70%" stopColor="#FFC700" />
            <stop offset="100%" stopColor="#E6A100" />
          </linearGradient>

          {/* Orange segment gradient */}
          <linearGradient id="orangeSeg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9000" />
            <stop offset="70%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#CC3300" />
          </linearGradient>

          {/* Green shaft gradient */}
          <linearGradient id="shaftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7CB342" />
            <stop offset="20%" stopColor="#388E3C" />
            <stop offset="80%" stopColor="#1B5E20" />
            <stop offset="100%" stopColor="#C0CA33" />
          </linearGradient>
        </defs>

        {/* 1. Green Umbrella Shaft / Handle */}
        <path
          d="M 160 80 L 390 380 L 405 370 L 170 70 Z"
          fill="url(#shaftGrad)"
        />

        {/* Top Tip of Shaft */}
        <polygon
          points="152,75 162,50 172,68"
          fill="#7CB342"
        />

        {/* Bottom Ferrule/Tip near logo */}
        <polygon
          points="385,385 418,410 405,370"
          fill="#C0CA33"
        />

        {/* 2. Umbrella Canopy Sections */}

        {/* Far Left Sky-Blue Canopy Segment */}
        <path
          d="M 162 72 C 100 130 30 220 0 350 C 40 320 80 280 118 280 C 105 200 125 120 162 72 Z"
          fill="url(#blueSeg)"
        />

        {/* Second Segment - Magenta / Pink */}
        <path
          d="M 162 72 C 125 120 105 200 118 280 C 180 280 210 210 250 260 C 210 170 185 110 162 72 Z"
          fill="url(#magentaSeg)"
        />

        {/* Third Segment - Top Right Yellow */}
        <path
          d="M 162 72 C 185 110 210 170 250 260 C 300 210 330 180 350 135 C 270 85 210 70 162 72 Z"
          fill="url(#yellowSeg)"
        />

        {/* Fourth Segment - Far Right Orange */}
        <path
          d="M 162 72 C 210 70 270 85 350 135 C 420 80 470 40 498 30 C 430 10 340 0 162 72 Z"
          fill="url(#orangeSeg)"
        />

        {/* Scallop Curves at Canopy Base */}
        <path
          d="M 0 350 Q 60 300 118 280 Q 180 280 250 260 Q 310 210 350 135 Q 430 75 498 30"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          fill="none"
        />

        {/* 3. Logo at Bottom Right End (White character G with Eyes + Red B Box) */}
        <g id="gb-logo-footer" transform="translate(280, 360)">
          {/* Red Box for 'B' */}
          <rect
            x="70"
            y="50"
            width="90"
            height="90"
            rx="18"
            fill="#FF0022"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          {/* White 'B' Letter */}
          <text
            x="115"
            y="118"
            fill="#FFFFFF"
            fontSize="72"
            fontWeight="900"
            fontFamily="Arial, Helvetica, sans-serif"
            textAnchor="middle"
          >
            B
          </text>

          {/* White Character 'G' Body */}
          <path
            d="M 75 80 C 75 40 50 25 25 25 C -5 25 -25 45 -25 75 C -25 105 -5 125 25 125 C 55 125 72 105 72 80 L 40 80 L 40 62 L 90 62 C 92 72 93 82 93 92 C 93 125 65 142 25 142 C -20 142 -45 115 -45 75 C -45 30 -15 8 25 8 C 60 8 90 28 92 60 Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="4"
          />

          {/* Character Eyes on top of 'G' */}
          {/* Left Eye Outer */}
          <ellipse
            cx="10"
            cy="15"
            rx="12"
            ry="15"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="3"
          />
          {/* Left Pupil */}
          <circle cx="10" cy="15" r="7" fill="#111111" />
          <circle cx="8" cy="12" r="2.5" fill="#FFFFFF" />

          {/* Right Eye Outer */}
          <ellipse
            cx="32"
            cy="15"
            rx="12"
            ry="15"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="3"
          />
          {/* Right Pupil */}
          <circle cx="32" cy="15" r="7" fill="#111111" />
          <circle cx="30" cy="12" r="2.5" fill="#FFFFFF" />

          {/* Smile mouth on G */}
          <path
            d="M 12 38 Q 21 46 30 38"
            stroke="#111111"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
