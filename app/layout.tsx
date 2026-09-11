import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { getLocale } from "next-intl/server";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "CauLongVL",
  description: "Badminton court management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}
