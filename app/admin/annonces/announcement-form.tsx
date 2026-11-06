import Link from "next/link";

const announcementTypes = [
  { value: "GENERAL", label: "Information générale" },
  { value: "NEWS", label: "Actualité" },
  { value: "BLOG", label: "Article de blog" },
  { value: "PROJECT", label: "Projet / Réalisation" },
  { value: "CONSTRUCTION", label: "Suivi de chantier" },
  { value: "REAL_ESTATE", label: "Immobilier" },
  { value: "DOMOTICS", label: "Domotique" },
  { value: "PROMOTION", label: "Promotion" },
];

type AnnouncementValues = {
  id?: string;
  title?: string | null;
  message?: string;
  type?: string;
  targetUrl?: string | null;
  linkLabel?: string | null;
  openInNewTab?: boolean;
  isPublished?: boolean;
  showInTicker?: boolean;
  sortOrder?: number;
  priority?: number;
  startsAt?: Date | null;
  endsAt?: Date | null;
};

type AnnouncementAction = (formData: FormData) => void | Promise<void>;

function toLocalDateTime(value?: Date | null) {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[#EAE1D7] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#9AA2AE] focus:border-[#D59344] focus:ring-2 focus:ring-[#D59344]/15";

const labelClass = "text-sm font-semibold text-[#26364A]";

export default function AnnouncementForm({
  action,
  announcement,
  submitLabel,
}: {
  action: AnnouncementAction;
  announcement?: AnnouncementValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-7">
      {announcement?.id && (
        <input type="hidden" name="id" value={announcement.id} />
      )}

      <section className="rounded-2xl border border-[#EAE1D7] bg-white p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Contenu de l'annonce
          </h2>
          <p className="mt-1 text-sm text-[#647084]">
            Définis le message qui sera présenté aux visiteurs.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className={labelClass}>
              Titre
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={announcement?.title ?? ""}
              placeholder="Ex. : Nouveau projet immobilier à Ouagadougou"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              defaultValue={announcement?.message ?? ""}
              placeholder="Rédige le message à communiquer aux visiteurs..."
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#647084]">
              Privilégie un message court et clair pour la barre Flash Info.
            </p>
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Catégorie
            </label>
            <select
              id="type"
              name="type"
              defaultValue={announcement?.type ?? "GENERAL"}
              className={inputClass}
            >
              {announcementTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAE1D7] bg-white p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Lien associé
          </h2>
          <p className="mt-1 text-sm text-[#647084]">
            Oriente les visiteurs vers une page ou un contenu complémentaire.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="targetUrl" className={labelClass}>
              Adresse du lien
            </label>
            <input
              id="targetUrl"
              name="targetUrl"
              type="text"
              defaultValue={announcement?.targetUrl ?? ""}
              placeholder="/realisations ou https://exemple.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="linkLabel" className={labelClass}>
              Texte du lien
            </label>
            <input
              id="linkLabel"
              name="linkLabel"
              type="text"
              defaultValue={announcement?.linkLabel ?? ""}
              placeholder="En savoir plus"
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-3 self-end rounded-xl bg-[#F7F5F1] p-4 text-sm text-[#26364A]">
            <input
              type="checkbox"
              name="openInNewTab"
              defaultChecked={announcement?.openInNewTab ?? false}
              className="size-4 accent-[#D59344]"
            />
            Ouvrir le lien dans un nouvel onglet
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAE1D7] bg-white p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Diffusion et programmation
          </h2>
          <p className="mt-1 text-sm text-[#647084]">
            Contrôle la visibilité et la période de diffusion de l'annonce.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startsAt" className={labelClass}>
              Début de diffusion
            </label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              defaultValue={toLocalDateTime(announcement?.startsAt)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="endsAt" className={labelClass}>
              Fin de diffusion
            </label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              defaultValue={toLocalDateTime(announcement?.endsAt)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="priority" className={labelClass}>
              Priorité
            </label>
            <input
              id="priority"
              name="priority"
              type="number"
              defaultValue={announcement?.priority ?? 0}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-[#647084]">
              Une priorité élevée favorise l'affichage de l'annonce.
            </p>
          </div>

          <div>
            <label htmlFor="sortOrder" className={labelClass}>
              Ordre d'affichage
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={announcement?.sortOrder ?? 0}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-[#647084]">
              Utilisé pour organiser les annonces de même priorité.
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-4 border-t border-[#EAE1D7] pt-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={announcement?.isPublished ?? false}
              className="mt-1 size-4 accent-[#D59344]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#172033]">
                Publier cette annonce
              </span>
              <span className="mt-1 block text-xs text-[#647084]">
                L'annonce pourra être visible sur le site pendant sa période
                de diffusion.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="showInTicker"
              defaultChecked={announcement?.showInTicker ?? true}
              className="mt-1 size-4 accent-[#D59344]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#172033]">
                Afficher dans la barre Flash Info
              </span>
              <span className="mt-1 block text-xs text-[#647084]">
                L'annonce défilera dans le bandeau situé en haut du site.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/admin/annonces"
          className="rounded-xl border border-[#EAE1D7] px-5 py-3 text-sm font-semibold text-[#647084] transition hover:bg-white"
        >
          Annuler
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-[#D59344] px-6 py-3 text-sm font-bold text-[#10161F] transition hover:bg-[#BE7D32]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}