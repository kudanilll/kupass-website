import type { Metadata } from "next";
import { googleSansFlex, heming } from "@/common/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kupass, Open Source Password Manager",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${googleSansFlex.className} ${googleSansFlex.variable} ${heming.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-security-950">
        {children}
      </body>
    </html>
  );
}
