/**
 * Maison Hygia monogram emblem — a circular MH mark in antique gold.
 */
export function MHEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="22"
        fontWeight="500"
        letterSpacing="1"
        fill="currentColor"
      >
        MH
      </text>
    </svg>
  );
}
