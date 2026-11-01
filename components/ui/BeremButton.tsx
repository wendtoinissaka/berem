import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type BeremButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
  showArrow?: boolean;
  external?: boolean;
};

export default function BeremButton({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = true,
  external = false,
}: BeremButtonProps) {
  return (
    <Link
      href={href}
      className={`berem-btn berem-btn--${variant} ${className}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="berem-btn__content">{children}</span>

      {showArrow && (
        <span className="berem-btn__icon" aria-hidden="true">
          <ArrowUpRight size={19} strokeWidth={1.8} />
        </span>
      )}

      <span className="berem-btn__shine" aria-hidden="true" />
    </Link>
  );
}