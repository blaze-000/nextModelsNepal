"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface SmoothLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any; // Allow other props to be passed through
}

export default function SmoothLink({ href, children, className, ...props }: SmoothLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if href starts with # (anchor link)
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetId = href.substring(1); // Remove the # from href
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Optional: Add offset for sticky navbar if needed
        const offset = 80; // Adjust this value based on your navbar height

        const elementPosition = targetElement.offsetTop - offset;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth"
        });
      }
    }
    // For regular links (not starting with #), let Link handle it normally
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
