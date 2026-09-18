export default function WaveSVG({ className = '', color = '#0d5c8c' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 30 Q 60 5, 120 25 T 240 30 T 360 25 T 480 30 T 600 25 T 720 30 T 840 25 T 960 30 T 1080 25 T 1200 30 V 60 H 0 Z"
        fill={color}
      />
      <path
        d="M0 40 Q 60 20, 120 35 T 240 40 T 360 35 T 480 40 T 600 35 T 720 40 T 840 35 T 960 40 T 1080 35 T 1200 40 V 60 H 0 Z"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}