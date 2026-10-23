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

const statusLabels: Record<string, string> = {
  PLANNED: "À venir",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  ON_HOLD: "En pause",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const cover = project.media.find((item) => item.type === "IMAGE");

  return (
    <article className="group overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
      <Link
        href={`/realisations/${project.slug}`}
        className="block"
        aria-label={`Découvrir le projet ${project.title}`}
      >
        <div className="relative h-64 overflow-hidden bg-slate-100">
          {cover ? (
            // Les URL des médias sont gérées par le système de stockage.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover.url}
              alt={cover.caption || project.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#102A43] p-8 text-center text-white">
              <div>
                <span className="text-4xl text-[#F59E0B]" aria-hidden="true">
                  ▥
                </span>
                <p className="mt-3 text-sm font-semibold">
                  Visuel à venir
                </p>
              </div>
            </div>
          )}

          <span className="absolute left-5 top-5 bg-[#F59E0B] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#102A43]">
            {statusLabels[project.status] ?? "Projet"}
          </span>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {project.location}
          </p>

          <h2 className="mt-3 text-xl font-extrabold text-[#102A43] transition-colors group-hover:text-amber-600">
            {project.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {project.description}
          </p>

          {project.status === "IN_PROGRESS" && (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
                <span>Avancement</span>
                <span>{project.progress}%</span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`Avancement du projet ${project.title}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.max(0, project.progress))}
              >
                <div
                  className="h-full rounded-full bg-[#F59E0B]"
                  style={{
                    width: `${Math.min(100, Math.max(0, project.progress))}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-sm font-semibold text-[#102A43]">
              Découvrir le projet
            </span>

            <span className="text-xl text-amber-600" aria-hidden="true">
              ↗
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}