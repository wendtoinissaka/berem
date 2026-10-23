export const instant = false;
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import StatsSection from "@/components/home/StatsSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <StatsSection />
      <ContactSection />
    </>
  );
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <h1 className="text-5xl font-bold text-black dark:text-white sm:text-6xl">
//           Welcome to{" "}
//           <a
//             className="text-blue-600 dark:text-blue-400"
//             href="https://berem.onrender.com/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             BEREM WEB SITE
//           </a>
//         </h1>

//       </main>
//     </div>
//   );
// }
