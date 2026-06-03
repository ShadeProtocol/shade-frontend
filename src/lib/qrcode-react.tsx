"use client";

import * as React from "react";

type QRCodeSVGProps = {
  value: string;
  size?: number;
  className?: string;
};

export function QRCodeSVG({ value, size = 160, className }: QRCodeSVGProps) {
  const src = React.useMemo(() => {
    const encoded = encodeURIComponent(value);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
  }, [size, value]);

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="QR code"
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
