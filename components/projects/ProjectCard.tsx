import Link from "next/link";

type ProjectCardProps = {
  project: {
    title: string;
    slug: string;
    description: string;
    location: string;
    status: string;
    progress: number;
    media: {
      url: string;
      type: string;
      caption: string | null;
    }[];
  };
};

const statusConfig: Record<
  string,
  { label: string; className: string; dotClassName: string }
> = {
  PLANNED: {
    label: "À venir",
    className: "bg-white text-[#26364A]",
    dotClassName: "bg-[#647084]",
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-[#D59344] text-[#10161F]",
    dotClassName: "bg-[#10161F]",
  },
  COMPLETED: {
    label: "Terminé",
    className: "bg-[#E5F2E9] text-[#245C37]",
    dotClassName: "bg-[#31834D]",
  },
  ON_HOLD: {
    label: "En pause",
    className: "bg-[#FCE9E5] text-[#963D2C]",
    dotClassName: "bg-[#C45B45]",
  },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const cover = project.media.find((item) => item.type === "IMAGE");

  const status = statusConfig[project.status] ?? {
    label: "Projet",
    className: "bg-white text-[#26364A]",
    dotClassName: "bg-[#647084]",
  };

  const progress =
    project.status === "COMPLETED"
      ? 100
      : Math.min(100, Math.max(0, Number(project.progress) || 0));

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#EAE1D7] bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#D59344]/60 hover:shadow-[0_24px_60px_rgba(16,22,31,0.12)]">
      <Link
        href={`/realisations/${project.slug}`}
        className="flex h-full flex-col"
        aria-label={`Découvrir le projet ${project.title}`}
      >
        {/* Image du projet */}
        <div className="relative h-64 shrink-0 overflow-hidden bg-[#26364A] sm:h-72">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover.url}
              alt={cover.caption || project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#10161F] to-[#26364A] text-white">
              <span className="text-6xl font-light text-[#D59344]" aria-hidden="true">
                ◈
              </span>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                BEREM · Génie civil
              </p>

              <p className="mt-2 text-sm font-medium text-white/80">
                Visuel à venir
              </p>
            </div>
          )}

          {/* Voile sur l'image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10161F]/65 via-transparent to-[#10161F]/10 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Statut */}
          <div className="absolute left-5 top-5">
            <span
              className={`inline-flex items-center gap-2 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] shadow-lg ${status.className}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
              />
              {status.label}
            </span>
          </div>

          {/* Localisation */}
          <div className="absolute bottom-5 left-5 flex items-center gap-2 text-xs font-semibold text-white">
            <span className="text-[#D59344]" aria-hidden="true">
              ◆
            </span>
            <span>{project.location}</span>
          </div>

          {/* Flèche au survol */}
          <div className="absolute bottom-5 right-5 flex h-10 w-10 translate-y-3 items-center justify-center bg-[#D59344] text-xl text-[#10161F] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            ↗
          </div>
        </div>

        {/* Informations */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#D59344]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#647084]">
                Projet BEREM
              </span>
            </div>

            <h2 className="text-xl font-black leading-snug tracking-tight text-[#10161F] transition-colors duration-300 group-hover:text-[#BE7D32] sm:text-2xl">
              {project.title}
            </h2>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#647084]">
              {project.description}
            </p>
          </div>

          {/* Avancement */}
          {(project.status === "IN_PROGRESS" ||
            project.status === "COMPLETED") && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#647084]">
                  Avancement des travaux
                </span>

                <span className="text-sm font-black text-[#10161F]">
                  {progress}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden bg-[#F0EAE2]"
                role="progressbar"
                aria-label={`Avancement du projet ${project.title}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full bg-[#D59344] transition-[width] duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {project.status === "COMPLETED" && (
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#31834D]">
                  Projet achevé
                </p>
              )}
            </div>
          )}

          {/* Pied de carte */}
          <div className="mt-auto flex items-center justify-between border-t border-[#EAE1D7] pt-5 mt-7">
            <span className="text-xs font-bold text-[#26364A] transition-colors group-hover:text-[#BE7D32] sm:text-sm">
              Découvrir le projet
            </span>

            <span className="flex h-9 w-9 items-center justify-center border border-[#EAE1D7] text-lg text-[#26364A] transition-all duration-300 group-hover:border-[#D59344] group-hover:bg-[#D59344] group-hover:text-[#10161F]">
              ↗
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}