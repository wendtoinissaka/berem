import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/projets/project-form";
import ProjectMediaUpload from "@/components/admin/projets/project-media-upload";

export const metadata = {
  title: "Modifier un chantier | BEREM Admin",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      media: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* En-tête */}
      <div>
        <Link
          href="/admin/projets"
          className="text-sm font-semibold text-slate-500 transition hover:text-[#102A43]"
        >
          ← Retour aux chantiers
        </Link>

        <h1 className="mt-4 text-3xl font-black text-[#102A43]">
          Modifier le chantier
        </h1>

        <p className="mt-2 text-slate-600">{project.title}</p>
      </div>

      {/* Formulaire des informations du chantier */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-xl font-extrabold text-[#102A43]">
          Informations générales
        </h2>

        <ProjectForm project={project} />
      </section>

      {/* Galerie principale du chantier */}
      <ProjectMediaUpload projectId={project.id} />

      {/* Aperçu des médias déjà enregistrés */}
      {project.media.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#102A43]">
              Médias enregistrés
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {project.media.length} média
              {project.media.length > 1 ? "s" : ""} dans la galerie.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.media.map((media) => (
              <article
                key={media.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                {media.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.url}
                    alt={media.caption || project.title}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    preload="metadata"
                    className="h-52 w-full bg-black object-contain"
                  >
                    Ton navigateur ne prend pas en charge la lecture vidéo.
                  </video>
                )}

                <div className="p-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-amber-700">
                    {media.type === "IMAGE" ? "Photo" : "Vidéo"}
                  </span>

                  <p className="mt-1 break-words text-sm text-slate-600">
                    {media.caption || "Aucune légende"}
                  </p>

                  {media.sortOrder ===
                    Math.min(
                      ...project.media
                        .filter((item) => item.type === "IMAGE")
                        .map((item) => item.sortOrder),
                      Infinity
                    ) &&
                    media.type === "IMAGE" && (
                      <span className="mt-2 inline-block rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                        Couverture actuelle
                      </span>
                    )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}



// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import ProjectForm from "@/components/admin/projets/project-form";

// export const metadata = {
//   title: "Modifier un chantier | BEREM Admin",
// };

// export default async function EditProjectPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const project = await prisma.project.findUnique({
//     where: { id },
//   });

//   if (!project) {
//     notFound();
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-8">
//       <div>
//         <Link
//           href="/admin/projets"
//           className="text-sm font-semibold text-slate-500 hover:text-[#102A43]"
//         >
//           ← Retour aux chantiers
//         </Link>

//         <h1 className="mt-4 text-3xl font-black text-[#102A43]">
//           Modifier le chantier
//         </h1>

//         <p className="mt-2 text-slate-600">{project.title}</p>
//       </div>

//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//         <ProjectForm project={project} />
//       </div>
//     </div>
//   );
// }