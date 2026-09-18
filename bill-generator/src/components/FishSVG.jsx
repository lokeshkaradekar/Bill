export default function FishSVG({ color = '#0d5c8c', accent = '#3aa0d4', className = '', flip = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 60"
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <g>
        <path
          d="M5 30 C 5 20, 15 14, 28 12 C 35 8, 60 4, 82 6 C 102 8, 114 16, 115 28 C 115 33, 112 37, 106 39 C 100 41, 92 40, 84 41 C 70 42, 50 44, 40 45 C 28 47, 14 44, 8 38 C 5 35, 4 32, 5 30 Z"
          fill={color}
        />
        <path
          d="M112 26 C 116 24, 118 28, 116 30 C 118 32, 116 36, 112 34 C 110 33, 110 28, 112 26 Z"
          fill={color}
        />
        <path
          d="M30 14 C 42 14, 52 17, 58 24 C 52 31, 42 34, 30 32 C 42 32, 52 29, 58 24 C 52 20, 42 16, 30 14 Z"
          fill={accent}
          opacity="0.85"
        />
        <circle cx="24" cy="26" r="2" fill="#fff" />
        <circle cx="25" cy="26" r="0.8" fill="#0d5c8c" />
        <path d="M82 6 C 86 12, 88 18, 88 22" stroke="#fff" strokeWidth="1.2" opacity="0.5" fill="none" />
        <path d="M78 9 C 84 15, 87 22, 88 28" stroke="#fff" strokeWidth="1" opacity="0.35" fill="none" />
      </g>
    </svg>
  );
}