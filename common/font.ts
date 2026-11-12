import localFont from "next/font/local";

const googleSansFlex = localFont({
  src: "./fonts/googlesansflex.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-google-sans-flex",
});

const heming = localFont({
  src: "./fonts/heming.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-heming",
});
export { googleSansFlex, heming };
