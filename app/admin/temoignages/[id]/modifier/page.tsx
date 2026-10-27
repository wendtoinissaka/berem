import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/admin/temoignages/testimonial-form";

type ModifierTestimonialPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierTestimonialPage({
  params,
}: ModifierTestimonialPageProps) {
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: {
      id: true,
      clientName: true,
      company: true,
      role: true,
      content: true,
      projectName: true,
      photoUrl: true,
      isPublished: true,
    },
  });

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Administration BEREM
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#102A43]">
            Modifier le témoignage
          </h1>

          <p className="mt-2 text-slate-500">
            Modifiez les informations du client, son témoignage et sa photo.
          </p>
        </div>

        <Link
          href="/admin/temoignages"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Retour aux témoignages
        </Link>
      </div>

      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}