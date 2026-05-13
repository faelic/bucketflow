import type { SVGProps } from "react";

export type IconName =
  | "wallet"
  | "deposit"
  | "withdraw"
  | "sliders"
  | "lock"
  | "spark"
  | "clock";

type AppIconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

export function AppIcon({ name, className, ...props }: AppIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": true,
    ...props,
  };

  switch (name) {
    case "wallet":
      return (
        <svg {...common}>
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5z" />
          <path d="M15 12h6v4.5A2.5 2.5 0 0 1 18.5 19H15z" />
          <circle cx="16.5" cy="14" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "deposit":
      return (
        <svg {...common}>
          <path d="M12 4v12" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 19h14" />
        </svg>
      );
    case "withdraw":
      return (
        <svg {...common}>
          <path d="M12 20V8" />
          <path d="m17 15-5 5-5-5" />
          <path d="M5 5h14" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <path d="M5 6h14" />
          <path d="M5 12h14" />
          <path d="M5 18h14" />
          <circle cx="9" cy="6" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="11" cy="18" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="6" y="11" width="12" height="9" rx="2.2" />
          <path d="M8.5 11V8.6A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 3.5 3.6V11" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    default:
      return null;
  }
}
