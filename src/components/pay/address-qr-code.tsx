"use client";

import { QRCodeSVG } from "qrcode.react";

interface AddressQRCodeProps {
  walletAddress: string;
}

export function AddressQRCode({ walletAddress }: AddressQRCodeProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4">
      <div className="rounded-md bg-white p-2">
        <QRCodeSVG value={walletAddress} size={160} />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Scan to copy address
      </p>
    </div>
  );
}
