import { App } from "@/components/App";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Impact } from "@/components/sections/Impact";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <App>
      <Hero />
      <About />
      <Skills />
      <Work />
      <Experience />
      <Impact />
      <Contact />
    </App>
  );
}
