/**
 * Shared theming for Clerk's prebuilt components (`<SignIn>`, `<SignUp>`,
 * `<UserButton>`), so they read as part of the site rather than a bolted-on
 * third-party widget.
 *
 * Colors mirror the `@theme` block in globals.css. They're written as literals
 * rather than `var(--color-*)` because Clerk renders some surfaces (the
 * `<UserButton>` popover) in a portal where the Tailwind theme layer's
 * custom properties aren't guaranteed to be in scope. The font variables come
 * from next/font on <html>, which every portal target inherits from.
 *
 * Variable names are the v7 set (`colorForeground`, `colorInput`,
 * `colorMutedForeground`) — the v5-era `colorText`/`colorInputText` names are
 * gone and fail typecheck.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#1b5e43", // market-green
    colorPrimaryForeground: "#ffffff",
    colorBackground: "#ffffff", // surface
    colorForeground: "#14231c", // ink
    colorMutedForeground: "#5f6b63", // sage
    colorInput: "#fbf7f0", // paper
    colorInputForeground: "#14231c", // ink
    colorBorder: "#e4dccf", // hairline
    fontFamily: "var(--font-dm-sans), sans-serif",
    borderRadius: "9px",
  },
  elements: {
    // The site's card treatment: hard ink outline over a warm drop shadow.
    //
    // `cardBox`, not `card` — `card` is only the upper panel, so bordering it
    // draws a rule across the middle and leaves Clerk's footer ("Don't have an
    // account?", "Secured by Clerk") hanging outside the outline. `cardBox`
    // wraps both.
    cardBox: {
      borderWidth: "1.5px",
      borderColor: "#14231c",
      boxShadow: "0 14px 40px rgba(20, 35, 28, 0.08)",
    },
  },
};
