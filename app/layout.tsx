import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduALLab 통합 플랫폼",
  description: "에듀올랩 통합 업무 포탈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
