import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FairwayCheck",
  description: "Community golf course condition tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${jakarta.variable} antialiased min-h-screen bg-surface font-body text-on-surface`}>
        <nav className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant/20">
          <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
            <Link
              href="/"
              className="text-xl font-bold tracking-tighter text-primary font-headline"
            >
              FairwayCheck
            </Link>
            <div className="hidden md:flex items-center gap-8 font-headline tracking-tight text-base font-semibold text-primary/60">
              <Link
                href="/"
                className="hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/visits"
                className="hover:text-primary transition-colors duration-200"
              >
                Log Visit
              </Link>
              <Link
                href="/report"
                className="hover:text-primary transition-colors duration-200"
              >
                Explore
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 py-10 gap-4 max-w-7xl mx-auto">
            <span className="text-sm font-black text-primary font-headline uppercase tracking-tighter">
              FairwayCheck
            </span>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60">
              © 2025 FairwayCheck. The Digital Clubhouse.
            </p>
            <div className="flex gap-8 font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant/60">
              <span className="hover:text-secondary transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-secondary transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
