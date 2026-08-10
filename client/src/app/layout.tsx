import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BatalaBandi | Premium Handcrafted Fashion & Streetwear",
  description: "Handcrafted Indian Streetwear, Hand-Painted Hoodies, Kurtas & Apparel",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${playfair.variable} ${plusJakarta.className}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-[#faf9f6] text-stone-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
