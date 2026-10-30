"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import MediaDeleteDialog from "@/components/admin/projets/media-delete-dialog";
import {
  deleteProjectMedia,
  moveProjectMedia,
} from "@/app/admin/projets/media-actions";

type MediaItem = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  caption: string | null;
  sortOrder: number;
};

type Props = {
  projectId: string;
  media: MediaItem[];
};

type Filter = "ALL" | "IMAGE" | "VIDEO";

export default function ProjectMediaManager({
  projectId,
  media,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [filter, setFilter] = useState<Filter>("ALL");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState<MediaItem | null>(null);

  const orderedMedia = useMemo(
    () =>
      [...media].sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.id.localeCompare(b.id)
      ),
    [media]
  );

  const images = orderedMedia.filter((item) => item.type === "IMAGE");
  const videos = orderedMedia.filter((item) => item.type === "VIDEO");

  // La couverture reste la première image de la galerie complète.
  const coverId = images[0]?.id;

  const visibleMedia = orderedMedia.filter((item) => {
    if (filter === "IMAGE") return item.type === "IMAGE";
    if (filter === "VIDEO") return item.type === "VIDEO";
    return true;
  });

  function executeMove(
    mediaId: string,
    direction: "up" | "down" | "cover"
  ) {
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("projectId", projectId);
        formData.set("mediaId", mediaId);
        formData.set("direction", direction);

        await moveProjectMedia(formData);

        setNotice(
          direction === "cover"
            ? "La photo de couverture a été mise à jour."
            : "L'ordre de la galerie a été mis à jour."
        );

        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de modifier la galerie."
        );
      }
    });
  }

function executeDelete(item: MediaItem) {
  setError("");
  setNotice("");
  setDeleteCandidate(item);
}

function confirmDelete() {
  if (!deleteCandidate || isPending) return;

  const item = deleteCandidate;

  setError("");
  setNotice("");

  startTransition(async () => {
    try {
      const formData = new FormData();
      formData.set("projectId", projectId);
      formData.set("mediaId", item.id);

      await deleteProjectMedia(formData);

      setDeleteCandidate(null);
      setNotice("Le média a été supprimé avec succès.");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer ce média."
      );
    }
  });
}

  function reorderByDrag(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    const sourceIndex = orderedMedia.findIndex(
      (item) => item.id === sourceId
    );
    const targetIndex = orderedMedia.findIndex(
      (item) => item.id === targetId
    );

    if (sourceIndex < 0 || targetIndex < 0) return;

    // Le déplacement complet n'est pas encore enregistré côté serveur.
    setError(
      "Le glisser-déposer n'est pas encore activé. Utilise les actions de déplacement du menu."
    );
  }

  function handleKeyboardMove(
    event: React.KeyboardEvent<HTMLButtonElement>,
    item: MediaItem
  ) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    event.preventDefault();

    executeMove(item.id, event.key === "ArrowUp" ? "up" : "down");
  }

  return (
    <section
      aria-labelledby="project-gallery-title"
      className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_45px_-30px_rgba(15,23,42,0.25)]"
    >
      {/* En-tête */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Présentation du chantier
              </p>
            </div>

            <h2
              id="project-gallery-title"
              className="mt-3 text-2xl font-bold tracking-tight text-[#102A43] sm:text-3xl"
            >
              Galerie des médias
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Organisez les visuels du projet. La première photo détermine
              la couverture visible sur le site public.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50">
            <Stat label="Médias" value={orderedMedia.length} />
            <Stat label="Photos" value={images.length} />
            <Stat label="Vidéos" value={videos.length} />
          </div>
        </div>

        {/* Filtres */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex rounded-xl bg-slate-100 p-1"
            role="group"
            aria-label="Filtrer les médias"
          >
            {(
              [
                ["ALL", "Tout"],
                ["IMAGE", "Photos"],
                ["VIDEO", "Vidéos"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-white text-[#102A43] shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            {filter === "ALL"
              ? "Ordre de présentation du site"
              : `${visibleMedia.length} média${visibleMedia.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Messages */}
      {(error || notice || isPending) && (
        <div className="space-y-2 px-5 pt-5 sm:px-8">
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {notice && !error && (
            <p
              role="status"
              className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              {notice}
            </p>
          )}

          {isPending && (
            <p role="status" className="text-sm text-slate-500">
              Enregistrement des modifications…
            </p>
          )}
        </div>
      )}

      {/* Galerie */}
      {visibleMedia.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
          {visibleMedia.map((item) => {
            const isCover = item.id === coverId;
            const globalIndex = orderedMedia.findIndex(
              (mediaItem) => mediaItem.id === item.id
            );

            return (
              <article
                key={item.id}
                onDragOver={(event) => {
                  if (draggedId) event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  const sourceId =
                    event.dataTransfer.getData("text/plain") || draggedId;

                  if (sourceId) {
                    reorderByDrag(sourceId, item.id);
                  }

                  setDraggedId(null);
                }}
                className={`group min-w-0 overflow-hidden rounded-2xl border bg-white transition duration-200 ${
                  draggedId === item.id
                    ? "border-amber-400 opacity-60"
                    : isCover
                      ? "border-emerald-200 shadow-[0_8px_30px_-22px_rgba(5,150,105,0.5)]"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
                }`}
              >
                {/* Aperçu */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {item.type === "IMAGE" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.caption || "Photo du chantier BEREM"}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                      className="h-full w-full bg-slate-950 object-contain"
                    >
                      Ton navigateur ne prend pas en charge la lecture vidéo.
                    </video>
                  )}

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {isCover && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        <span aria-hidden="true">★</span>
                        Couverture
                      </span>
                    )}

                    <span className="rounded-lg border border-white/60 bg-white/95 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                      {item.type === "IMAGE" ? "Photo" : "Vidéo"}
                    </span>
                  </div>

                  {/* Bouton de suppression rapide : croix en haut à droite */}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => executeDelete(item)}
                    aria-label={`Supprimer ${
                      item.caption ||
                      (item.type === "IMAGE" ? "cette photo" : "cette vidéo")
                    }`}
                    title="Supprimer ce média"
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-slate-950/80 text-2xl font-medium leading-none text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span aria-hidden="true">×</span>
                  </button>

                  {/* Poignée de déplacement */}
                  <button
                    type="button"
                    draggable
                    disabled={isPending}
                    onDragStart={(event) => {
                      setDraggedId(item.id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", item.id);
                    }}
                    onDragEnd={() => setDraggedId(null)}
                    onKeyDown={(event) => handleKeyboardMove(event, item)}
                    aria-label={`Déplacer ${
                      item.caption || "ce média"
                    }. Utilise les flèches haut et bas pour changer sa position.`}
                    title="Glisser pour réorganiser · Flèches ↑ et ↓ au clavier"
                    className="absolute bottom-3 left-3 flex h-10 items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <span aria-hidden="true" className="text-base">
                      ⠿
                    </span>
                    Réorganiser
                  </button>
                </div>

                {/* Informations et actions */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Média {String(globalIndex + 1).padStart(2, "0")}
                      </p>

                      <p className="mt-1.5 line-clamp-2 min-h-10 break-words text-sm font-semibold leading-5 text-slate-800">
                        {item.caption || "Sans légende"}
                      </p>
                    </div>

                    <details className="relative shrink-0">
                      <summary
                        aria-label="Actions du média"
                        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 [&::-webkit-details-marker]:hidden"
                      >
                        ⋯
                      </summary>

                      <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                        {item.type === "IMAGE" && !isCover && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => executeMove(item.id, "cover")}
                            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50"
                          >
                            Définir comme couverture
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isPending || globalIndex === 0}
                          onClick={() => executeMove(item.id, "up")}
                          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                          ↑ Déplacer vers le haut
                        </button>

                        <button
                          type="button"
                          disabled={
                            isPending ||
                            globalIndex === orderedMedia.length - 1
                          }
                          onClick={() => executeMove(item.id, "down")}
                          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                          ↓ Déplacer vers le bas
                        </button>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => executeDelete(item)}
                          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          Supprimer le média
                        </button>
                      </div>
                    </details>
                  </div>

                  {isCover && (
                    <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-800">
                      Cette photo représente le chantier sur le site public.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="px-5 py-16 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
            ▧
          </div>

          <h3 className="mt-4 text-base font-bold text-[#102A43]">
            Aucun média dans cette catégorie
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Essaie un autre filtre ou ajoute des médias à ce chantier.
          </p>
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-8">
        <p className="text-xs leading-5 text-slate-500">
          <strong className="text-slate-700">Conseil :</strong> privilégie
          une photo nette et représentative comme couverture. Les changements
          d'ordre sont destinés à modifier la présentation de la galerie
          publique.
        </p>
      </div>
      <MediaDeleteDialog
  open={deleteCandidate !== null}
  title="Supprimer ce média ?"
  description={
    deleteCandidate?.caption?.trim() ||
    (deleteCandidate?.type === "IMAGE"
      ? "Cette photo du chantier"
      : "Cette vidéo du chantier")
  }
  previewUrl={deleteCandidate?.url ?? ""}
  mediaType={deleteCandidate?.type ?? "IMAGE"}
  isPending={isPending}
  onCancel={() => setDeleteCandidate(null)}
  onConfirm={confirmDelete}
/>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-3 py-3 text-center sm:px-4">
      <p className="text-xl font-bold tracking-tight text-[#102A43]">
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  );
}