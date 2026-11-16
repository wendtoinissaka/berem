import { Suspense } from "react";

import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ChantiersSection from "@/components/home/ChantiersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HomeSolutionsSection from "@/components/home/HomeSolutionsSection";

function SectionFallback() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[300px] animate-pulse bg-[#FBF7F1]"
    />
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <ServicesSection />

      <Suspense fallback={<SectionFallback />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ChantiersSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <HomeSolutionsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>

      <SolutionsSection />
    </>
  );
}


// import { Suspense } from "react";

// import Hero from "@/components/home/Hero"; 
// import ServicesSection from "@/components/home/ServicesSection"; 
// import ProjectsSection from "@/components/home/ProjectsSection"; 
// import ChantiersSection from "@/components/home/ChantiersSection"; 
// import TestimonialsSection from "@/components/home/TestimonialsSection"; 
// import SolutionsSection from "@/components/home/SolutionsSection"; 
// import HomeSolutionsSection from "@/components/home/HomeSolutionsSection";

// export const instant = false;

// export default function Home() { return ( <> <Hero />

//   <ServicesSection />

//   <ProjectsSection />

//   <ChantiersSection />

//   <Suspense fallback={null}>
//     <HomeSolutionsSection />
//   </Suspense>

//   <Suspense fallback={null}>
//     <TestimonialsSection />
//   </Suspense>

//   <SolutionsSection />
// </>


// ); }


// export const instant = false;

// import Hero from "@/components/home/Hero";
// import ServicesSection from "@/components/home/ServicesSection";
// import SolutionsSection from "@/components/home/SolutionsSection";
// import ProjectsSection from "@/components/home/ProjectsSection";
// import ChantiersSection from "@/components/home/ChantiersSection";
// import TestimonialsSection from "@/components/home/TestimonialsSection";
// import StatsSection from "@/components/home/StatsSection";
// import ContactSection from "@/components/home/ContactSection";
// import HomeSolutionsSection from "@/components/home/HomeSolutionsSection";

// export default function Home() {
//   return (
//     <>
//       <Hero />

//       <ServicesSection />

//       <ProjectsSection />

//       <ChantiersSection />

//       <HomeSolutionsSection/>
//       <TestimonialsSection />

//       <SolutionsSection />

//       {/* <StatsSection /> */}

//       {/* <ContactSection /> */}
//     </>
//   );
// }
