import Link from "next/link";
import AnnouncementForm from "../announcement-form";
import { createAnnouncement } from "../actions";

export default function NewAnnouncementPage() {
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
          Nouvelle annonce
        </h1>

        <p className="mt-2 text-sm text-[#647084]">
          Crée une information à diffuser sur le site de BEREM.
        </p>
      </div>

      <AnnouncementForm
        action={createAnnouncement}
        submitLabel="Créer l'annonce"
      />
    </div>
  );
}