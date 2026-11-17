import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Recipe Explorer",
    template: "%s | Recipe Explorer",
  },
  description: "Explore recipes from around the world, powered by TheMealDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-stone-200 bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-emerald-800">Recipe</span> Explorer
            </Link>
            <span className="text-sm text-stone-500">
              Find something delicious
            </span>
          </nav>
        </header>
        {children}
        <footer className="mt-20 border-t border-stone-200 py-8 text-center text-sm text-stone-500">
          Recipe data provided by TheMealDB
        </footer>
      </body>
    </html>
  );
}
