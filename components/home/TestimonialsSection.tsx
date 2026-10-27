import { prisma } from "@/lib/prisma";
import TestimonialsList from "@/components/home/TestimonialsList";

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
      className="relative overflow-hidden bg-slate-50 py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* En-tête */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-amber-600"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                Témoignages clients
              </p>
            </div>

            <h2
              id="testimonials-title"
              className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
            >
              Ils nous font{" "}
              <span className="text-amber-600">confiance.</span>
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-6 text-slate-600">
            Découvrez les retours de nos clients sur leur expérience avec
            BEREM.
          </p>
        </div>

        {/* Liste interactive */}
        <TestimonialsList testimonials={testimonials} />
      </div>
    </section>
  );
}