"use client";

import * as React from "react";

export type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type IconProps = React.SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children?: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Loader2(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12a9 9 0 1 1-9-9" />
    </IconBase>
  );
}

export function AlertTriangle(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10.3 3.3 1.7 18.2A2 2 0 0 0 3.4 21h17.2a2 2 0 0 0 1.7-2.8L13.7 3.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

export function Check(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 6 9 17l-5-5" />
    </IconBase>
  );
}

export function Copy(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </IconBase>
  );
}

export function X(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </IconBase>
  );
}

export function Search(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </IconBase>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function ClipboardCopy(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </IconBase>
  );
}

export function TrendingUp(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </IconBase>
  );
}

export function TrendingDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7l6 6 4-4 7 7" />
      <path d="M20 10v6h-6" />
    </IconBase>
  );
}

export function Wallet(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7h18v10H3z" />
      <path d="M17 11h4" />
    </IconBase>
  );
}

export function WalletCards(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10" />
    </IconBase>
  );
}

export function CheckCircle2(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </IconBase>
  );
}

export function Send(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </IconBase>
  );
}

export function Key(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
      <path d="M13 7H2v4h3v3h3v3h3v-3h3" />
    </IconBase>
  );
}

export function KeyRound(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="8" cy="8" r="4" />
      <path d="M12 8h10v4h-3v3h-3v3h-4" />
    </IconBase>
  );
}

export function UserCircle(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 19a6 6 0 0 1 11 0" />
    </IconBase>
  );
}

export function Trash2(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 16h10l1-16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  );
}

export function ImagePlus(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 10h.01" />
      <path d="M21 15l-5-5L5 21" />
      <path d="M12 7v6" />
      <path d="M9 10h6" />
    </IconBase>
  );
}

export function Moon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3 7 7 0 1 0 21 12.8Z" />
    </IconBase>
  );
}

export function Sun(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.9 4.9l1.4 1.4" />
      <path d="M17.7 17.7l1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.9 19.1l1.4-1.4" />
      <path d="M17.7 6.3l1.4-1.4" />
    </IconBase>
  );
}

export function CalendarClock(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 2v2" />
      <path d="M16 2v2" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 14v3l2 1" />
      <circle cx="16" cy="16" r="4" />
    </IconBase>
  );
}

export function Users(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 11a4 4 0 1 0-8 0" />
      <path d="M6 20a6 6 0 0 1 12 0" />
      <path d="M19 20a4 4 0 0 0-2-3.4" />
      <path d="M5 20a4 4 0 0 1 2-3.4" />
    </IconBase>
  );
}

export function BadgeCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2l3 2 3 1-1 3 1 3-3 1-3 2-3-2-3-1 1-3-1-3 3-1 3-2Z" />
      <path d="M8.5 12.5 11 15l4.5-5" />
    </IconBase>
  );
}

export function DollarSign(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
    </IconBase>
  );
}

export function FileText(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </IconBase>
  );
}

export function Share2(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17.5" />
      <path d="M15.4 6.5 8.6 10.5" />
    </IconBase>
  );
}
