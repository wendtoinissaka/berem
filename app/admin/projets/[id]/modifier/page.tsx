import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/projets/project-form";
import ProjectMediaUpload from "@/components/admin/projets/project-media-upload";
import ProjectMediaManager from "@/components/admin/projets/project-media-manager";

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

{/* Gestionnaire unique de la galerie principale */}
<ProjectMediaManager
  projectId={project.id}
  media={project.media.map((item) => ({
    id: item.id,
    url: item.url,
    type: item.type,
    caption: item.caption,
    sortOrder: item.sortOrder,
  }))}
/>
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