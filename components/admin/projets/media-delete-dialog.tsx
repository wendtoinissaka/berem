"use client";

import { useEffect, useRef } from "react";

type MediaDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  previewUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function MediaDeleteDialog({
  open,
  title,
  description,
  previewUrl,
  mediaType,
  isPending,
  onCancel,
  onConfirm,
}: MediaDeleteDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isPending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="media-delete-title"
        aria-describedby="media-delete-description"
        className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-slate-950/25 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h2
                id="media-delete-title"
                className="text-lg font-bold tracking-tight text-[#102A43]"
              >
                {title}
              </h2>

              <p
                id="media-delete-description"
                className="mt-2 text-sm leading-6 text-slate-500"
              >
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              aria-label="Fermer la fenêtre"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ×
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {mediaType === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={description}
                className="h-48 w-full object-cover"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                preload="metadata"
                className="h-48 w-full bg-slate-950 object-contain"
              >
                Ton navigateur ne prend pas en charge la lecture vidéo.
              </video>
            )}

            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                {mediaType === "IMAGE" ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m21 15-5-5L5 21"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="m10 9 5 3-5 3V9Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </span>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {mediaType === "IMAGE" ? "Photo du chantier" : "Vidéo du chantier"}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/80 p-3.5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
            >
              <path
                d="M12 8v5m0 3h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-xs leading-5 text-red-800">
              Cette suppression peut retirer le média de la galerie publique.
              Vérifie que tu souhaites réellement continuer avant de confirmer.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 animate-spin"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeOpacity=".25"
                    strokeWidth="3"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Suppression…
              </>
            ) : (
              "Supprimer définitivement"
            )}
          </button>
        </div>
      </section>
    </div>
  );
}