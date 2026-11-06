import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnnouncementForm from "../../announcement-form";
import { updateAnnouncement } from "../../actions";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/annonces"
          className="text-sm font-semibold text-[#647084] transition hover:text-[#D59344]"
        >
          ← Retour aux annonces
        </Link>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-[#D59344]">
          Communication
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#172033]">
          Modifier l'annonce
        </h1>

        <p className="mt-2 text-sm text-[#647084]">
          Mets à jour le contenu et les paramètres de diffusion.
        </p>
      </div>

      <AnnouncementForm
        action={updateAnnouncement}
        announcement={announcement}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}