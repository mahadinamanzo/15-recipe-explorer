import type { Metadata } from "next";
import Link from "next/link";
import { FavoritesLimitProvider } from "@/components/FavoritesLimitProvider";
import HeaderSearch from "@/components/HeaderSearch";
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
        <FavoritesLimitProvider>
          <header className="border-b border-stone-200 bg-white">
            <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
              <Link href="/" className="text-xl font-bold tracking-tight">
                <span className="text-emerald-800">Recipe</span> Explorer
              </Link>
              <HeaderSearch />
              <div className="flex items-center gap-4 text-sm font-semibold">
                <Link
                  href="/random"
                  className="text-stone-600 transition hover:text-emerald-800"
                >
                  Random recipe
                </Link>
                <Link
                  href="/favourites"
                  className="text-rose-700 transition hover:text-rose-900"
                >
                  ♥ Favourites
                </Link>
              </div>
            </nav>
          </header>
          {children}
          <footer className="mt-20 border-t border-stone-200 py-8 text-center text-sm text-stone-500">
            Recipe data provided by TheMealDB
          </footer>
        </FavoritesLimitProvider>
      </body>
    </html>
  );
}
