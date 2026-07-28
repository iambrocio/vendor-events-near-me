import Link from "next/link";
import { SiteFooter } from "./SiteFooter";

export function Wordmark() {
  return (
    <div className="flex items-baseline gap-[7px]">
      <span className="font-sans text-[22px] font-extrabold tracking-[-0.02em] text-ink">
        Vendor Events
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
        near me
      </span>
    </div>
  );
}

export function Field({
  label,
  type,
  placeholder,
  autoComplete,
  action,
}: {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  action?: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-[7px]">
      {action ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
            {label}
          </span>
          {action}
        </div>
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
          {label}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-[9px] border-[1.5px] border-hairline bg-paper px-[14px] py-[13px] font-sans text-base text-ink outline-none transition-colors placeholder:text-[#A6AFA8] focus:border-market-green focus:bg-surface"
      />
    </label>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-[26px] bg-paper px-6 py-16 text-ink">
        <Wordmark />

        <form className="flex w-full max-w-[420px] flex-col gap-[18px] rounded-2xl border-[1.5px] border-ink bg-surface p-8 shadow-[0_14px_40px_rgba(20,35,28,0.08)]">
          <div className="flex flex-col gap-1">
            <h1 className="font-sans text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em]">
              {title}
            </h1>
            <span className="text-[15px] leading-[1.5] text-sage">
              {subtitle}
            </span>
          </div>
          {children}
          {footer}
        </form>

        <span className="text-sm text-sage">
          Looking for a market to sell at?{" "}
          <Link href="/" className="font-semibold">
            Browse markets
          </Link>
        </span>
      </div>
      <SiteFooter />
    </>
  );
}
