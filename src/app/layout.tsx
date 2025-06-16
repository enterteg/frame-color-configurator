import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAL Color Palette Composer",
  description: "Create beautiful color palettes using RAL Classic colors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
