import React from 'react';

/**
 * Precision vector SVG icon for authentic artisanal chili pepper / Shito sauce.
 * Replaces generic OS emojis with high-resolution, scalable dual-tone vector artwork.
 */
export default function PepperIcon({ size = 16, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: '-2px', display: 'inline-block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {/* Curved Emerald Stem */}
      <path
        d="M13 2.5C13.8 1.5 15.2 1.2 16.5 1.8"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Emerald Calyx Crown */}
      <path
        d="M9.8 5.2C11 4.5 12.8 4.5 14 5.2C14.8 5.7 15 6.4 14.8 7C13.5 6.5 10.8 6.5 9.6 7C9.2 6.3 9.4 5.6 9.8 5.2Z"
        fill="#10b981"
      />
      {/* Fiery Chili Pod Body */}
      <path
        d="M9.8 6.5C11.5 6 13.5 6.2 14.8 7C16.2 8 16.5 9.8 16 11.5C15.2 14 13.5 17 12 19.5C11 21.2 9.5 22 8 22C6.8 22 5.8 21.2 5.5 20C5 18 6.2 16.5 7.5 15C9.2 13 10.2 10.5 9.8 6.5Z"
        fill="#ef4444"
      />
      {/* Specular Highlight Sheen */}
      <path
        d="M11.5 8.5C12.5 8.5 13.8 9.5 13.5 11.5C13.2 13 12 15 11 16.5"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
