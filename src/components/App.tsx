"use client";
import { ScrollProvider } from "@/lib/scroll";
import { Navigation } from "./Navigation";
import { RevealObserver } from "./ui/RevealObserver";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <a href="#about" className="skip">
        Skip to content
      </a>
      <RevealObserver />
      <Navigation />
      <main>{children}</main>
    </ScrollProvider>
  );
}
