"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({
  height = 36,
  className = "",
  priority = true,
}: LogoProps) {
  // Original aspect ratio: 1494 / 346 = ~4.318
  const width = Math.round(height * (1494 / 346));

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Light mode logo */}
      <Image
        src="/images/logo-light.png"
        alt="TestingHub - Global Testing Community"
        width={width}
        height={height}
        priority={priority}
        className="block dark:hidden object-contain w-auto"
        style={{ height: `${height}px` }}
      />
      {/* Dark mode logo */}
      <Image
        src="/images/logo-dark.png"
        alt="TestingHub - Global Testing Community"
        width={width}
        height={height}
        priority={priority}
        className="hidden dark:block object-contain w-auto"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({
  size = 32,
  className = "",
}: LogoIconProps) {
  // Original icon aspect ratio: 370 / 345 = ~1.072
  const width = Math.round(size * (370 / 345));

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <Image
        src="/images/icon-light.png"
        alt="TestingHub Icon"
        width={width}
        height={size}
        className="block dark:hidden object-contain"
        style={{ height: `${size}px`, width: `${width}px` }}
      />
      <Image
        src="/images/icon-dark.png"
        alt="TestingHub Icon"
        width={width}
        height={size}
        className="hidden dark:block object-contain"
        style={{ height: `${size}px`, width: `${width}px` }}
      />
    </div>
  );
}
