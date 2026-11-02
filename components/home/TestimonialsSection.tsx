import { MessageSquareQuote } from "lucide-react";

import { prisma } from "@/lib/prisma";
import TestimonialsList from "@/components/home/TestimonialsList";
import ScrollReveal from "@/components/ui/ScrollReveal";

const MAX_TESTIMONIALS = 24;

export default async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: MAX_TESTIMONIALS,
    select: {
      id: true,
      clientName: true,
      company: true,
      role: true,
      content: true,
      projectName: true,
      photoUrl: true,
    },
  });

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="temoignages"
      aria-labelledby="testimonials-title"
      className="relative overflow-hidden border-t border-[#EAE1D7] bg-[#FBF7F1] py-12 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#D59344]/[0.045] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-5 border-b border-[#E5DCCE] pb-7 sm:mb-10 sm:gap-7 sm:pb-9 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <MessageSquareQuote
                  aria-hidden="true"
                  className="shrink-0 text-[#BE7D32]"
                  size={18}
                  strokeWidth={1.8}
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BE7D32] sm:text-xs sm:tracking-[0.22em]">
                  La parole à nos clients
                </p>
              </div>

              <h2
                id="testimonials-title"
                className="mt-4 text-[30px] font-black leading-[1.1] tracking-tight text-[#10161F] sm:mt-5 sm:text-5xl sm:leading-[1.08] lg:text-6xl"
              >
                La confiance
                <br />
                se construit.
                <br className="sm:hidden" />
                <span className="text-[#D59344]">
                  {" "}Elle se partage aussi.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#647084] sm:text-base sm:leading-8">
              La satisfaction de nos clients est au cœur de notre engagement.
              Découvrez leurs retours d'expérience avec BEREM.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <TestimonialsList testimonials={testimonials} />
        </ScrollReveal>
      </div>
    </section>
  );
}