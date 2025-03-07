import React from 'react';

export interface IIconProps {
  width?: string;
  height?: string;
}
/* eslint-disable */
export function DigestGradient({ width = '30px', height = '31px' }: IIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 19.5L12 25.5L23 19.5M1 13.5L12 19.5L23 13.5M12 1.5L1 7.5L12 13.5L23 7.5L12 1.5Z"
        stroke="url(#paint0_linear_1981_26278)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="paint0_linear_1981_26278" x1="12" y1="25.5" x2="12" y2="1.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14DEEB" />
          <stop offset="1" stopColor="#446EDC" />
        </linearGradient>
      </defs>
    </svg>
  );
}
