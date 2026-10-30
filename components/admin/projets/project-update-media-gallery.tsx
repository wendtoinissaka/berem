"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProjectUpdateMedia } from "@/app/admin/projets/media-actions";

type ProjectUpdateMedia = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  caption: string | null;
  publicId?: string | null;
};

type Props = {
  projectId: string;
  updateId: string;
  updateTitle: string;
  media: ProjectUpdateMedia[];
  canDelete: boolean;
};

export default function ProjectUpdateMediaGallery({
  projectId,
  updateId,
  updateTitle,
  media,
  canDelete,
}: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ProjectUpdateMedia | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeMedia =
    activeIndex === null ? null : media[activeIndex] ?? null;

  function closeViewer() {
    setActiveIndex(null);
  }

  function showPrevious() {
    if (activeIndex === null || media.length < 2) return;

    setActiveIndex((activeIndex - 1 + media.length) % media.length);
  }

  function showNext() {
    if (activeIndex === null || media.length < 2) return;

    setActiveIndex((activeIndex + 1) % media.length);
  }

  useEffect(() => {
    if (activeIndex === null && !deleteTarget) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (deleteTarget) {
          setDeleteTarget(null);
        } else {
          closeViewer();
        }
      }

      if (activeIndex !== null && !deleteTarget) {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, deleteTarget, media.length]);

  useEffect(() => {
    if (!activeMedia && !deleteTarget) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeMedia, deleteTarget]);

  function handleDelete() {
    if (!deleteTarget || !canDelete || isPending) return;

    setError("");
    setMessage("");

    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("updateId", updateId);
    formData.set("mediaId", deleteTarget.id);

    startTransition(async () => {
      try {
        await deleteProjectUpdateMedia(formData);

        setMessage("Le média a été supprimé.");
        setDeleteTarget(null);
        setActiveIndex(null);

        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de supprimer ce média."
        );
        setDeleteTarget(null);
      }
    });
  }

  if (media.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
        Aucun média enregistré pour ce compte rendu.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-bold text-[#392319]">
            Galerie du compte rendu
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Clique sur une image pour l’agrandir.
          </p>
        </div>

        <span className="rounded-full bg-[#eee7e2] px-3 py-1 text-xs font-bold text-[#392319]">
          {media.length} média{media.length > 1 ? "s" : ""}
        </span>
      </div>

      {(message || error) && (
        <div
          role="status"
          className={`rounded-xl border p-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((item, index) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => {
                setError("");
                setActiveIndex(index);
              }}
              aria-label={
                item.type === "IMAGE"
                  ? `Agrandir l’image ${index + 1}`
                  : `Visionner la vidéo ${index + 1}`
              }
              className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left"
            >
              {item.type === "IMAGE" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.caption || updateTitle}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-[#30251f]">
                  <video
                    src={item.url}
                    preload="metadata"
                    muted
                    playsInline
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-black/65 text-2xl text-white">
                    ▶
                  </span>
                </div>
              )}

              <span className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                {item.type === "IMAGE" ? "Agrandir ↗" : "Lire ▶"}
              </span>
            </button>

            <div className="space-y-3 p-3">
              <p className="min-h-5 break-words text-sm text-slate-600">
                {item.caption || "Sans légende"}
              </p>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  {item.type === "IMAGE" ? "Photo" : "Vidéo"}
                </span>

                {canDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setDeleteTarget(item);
                    }}
                    disabled={isPending}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Visionneuse plein écran */}
      {activeMedia && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse des médias du chantier"
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <header className="flex items-center justify-between gap-4 border-b border-white/15 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {activeMedia.caption || updateTitle}
              </p>
              <p className="mt-1 text-xs text-white/60">
                {(activeIndex ?? 0) + 1} / {media.length}
              </p>
            </div>

            <button
              type="button"
              onClick={closeViewer}
              aria-label="Fermer la visionneuse"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20"
            >
              ×
            </button>
          </header>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-8">
            {media.length > 1 && (
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Média précédent"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20 sm:left-5"
              >
                ‹
              </button>
            )}

            {activeMedia.type === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeMedia.url}
                alt={activeMedia.caption || updateTitle}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                key={activeMedia.id}
                src={activeMedia.url}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full"
              />
            )}

            {media.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Média suivant"
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20 sm:right-5"
              >
                ›
              </button>
            )}
          </div>

          {activeMedia.caption && (
            <footer className="border-t border-white/15 px-4 py-3 text-center text-sm text-white/80">
              {activeMedia.caption}
            </footer>
          )}
        </div>
      )}

      {/* Confirmation de suppression intégrée */}
      {deleteTarget && (
        <div
          role="presentation"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-media-title"
            aria-describedby="delete-media-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-700">
              !
            </div>

            <h3
              id="delete-media-title"
              className="mt-4 text-xl font-black text-[#392319]"
            >
              Supprimer ce média ?
            </h3>

            <p
              id="delete-media-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              Cette action supprimera le média du compte rendu et tentera
              également de supprimer son fichier sur Cloudinary. Elle ne peut
              pas être annulée.
            </p>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Suppression…" : "Confirmer la suppression"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}