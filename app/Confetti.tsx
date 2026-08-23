/**
 * A scatter of small shapes behind the hero. Decorative only — hidden from
 * assistive tech and immune to clicks, so it can never sit between someone and
 * the form it surrounds.
 *
 * Positions are fixed rather than random: a random scatter re-rolls on every
 * render and would land pieces on the headline as often as not.
 */
const PIECES = [
  { left: "4%", top: "14%", rotate: -18, w: 10, h: 4, className: "bg-accent/45" },
  { left: "11%", top: "46%", rotate: 24, w: 7, h: 7, className: "rounded-full bg-sun" },
  { left: "17%", top: "8%", rotate: 42, w: 9, h: 4, className: "bg-mint" },
  { left: "8%", top: "74%", rotate: -8, w: 6, h: 6, className: "rounded-full bg-peach" },
  { left: "24%", top: "84%", rotate: 32, w: 10, h: 4, className: "bg-accent/30" },
  { right: "5%", top: "10%", rotate: 16, w: 10, h: 4, className: "bg-mint" },
  { right: "12%", top: "40%", rotate: -30, w: 7, h: 7, className: "rounded-full bg-accent/40" },
  { right: "19%", top: "6%", rotate: -12, w: 6, h: 6, className: "rounded-full bg-sun" },
  { right: "7%", top: "70%", rotate: 38, w: 9, h: 4, className: "bg-peach" },
  { right: "26%", top: "88%", rotate: -22, w: 8, h: 4, className: "bg-accent/25" },
];

export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      {PIECES.map((piece, i) => (
        <span
          key={i}
          style={{
            left: piece.left,
            right: piece.right,
            top: piece.top,
            width: piece.w,
            height: piece.h,
            transform: `rotate(${piece.rotate}deg)`,
          }}
          className={`absolute rounded-[2px] ${piece.className}`}
        />
      ))}
    </div>
  );
}
