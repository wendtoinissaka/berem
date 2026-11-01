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
      className="relative overflow-hidden border-t border-[#EAE1D7] bg-[#FBF7F1] py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#D59344]/[0.045] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="mb-12 flex flex-col gap-8 border-b border-[#E5DCCE] pb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <MessageSquareQuote className="text-[#BE7D32]" size={21} />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                  La parole à nos clients
                </p>
              </div>

              <h2
                id="testimonials-title"
                className="mt-6 text-4xl font-black tracking-tight text-[#10161F] sm:text-5xl lg:text-6xl"
              >
                La confiance se construit.
                <br />
                <span className="text-[#D59344]">Elle se partage aussi.</span>
              </h2>
            </div>

            <p className="max-w-md text-base leading-8 text-[#647084]">
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