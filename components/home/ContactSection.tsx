import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-[#F59E0B] px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-[#102A43]/10" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#102A43]/70">
              Parlons de votre projet
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-[#102A43] sm:text-4xl lg:text-5xl">
              Construisons ensemble la suite.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#102A43]/80">
              Décrivez-nous votre projet et échangeons sur vos besoins,
              vos objectifs et les solutions envisageables.
            </p>
          </div>

          <Link
            href="/devis"
            className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#102A43] px-7 py-5 font-bold text-white transition hover:bg-[#193C5A]"
          >
            Demander un devis
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}