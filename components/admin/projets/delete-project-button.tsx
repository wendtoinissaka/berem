  "use client";

  import { useActionState, useState } from "react";
  import { deleteProject } from "@/app/admin/projets/actions";

  type DeleteState = {
    error?: string;
  };

  const initialState: DeleteState = {};

  export default function DeleteProjectButton({
    projectId,
    projectTitle,
  }: {
    projectId: string;
    projectTitle: string;
  }) {
    const [confirmation, setConfirmation] = useState(false);
    const [typedValue, setTypedValue] = useState("");

    const [state, formAction, isPending] = useActionState(
      async (_previousState: DeleteState, formData: FormData) => {
        try {
          await deleteProject(formData);
          return {};
        } catch (error) {
          return {
            error:
              error instanceof Error
                ? error.message
                : "La suppression a échoué.",
          };
        }
      },
      initialState,
    );

    if (!confirmation) {
      return (
        <button
          type="button"
          onClick={() => setConfirmation(true)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Supprimer
        </button>
      );
    }

    return (
      <div className="w-full max-w-sm rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-bold text-red-800">
          Supprimer définitivement ce chantier ?
        </p>

        <p className="mt-1 text-sm text-red-700">
          « {projectTitle} » et ses médias et mises à jour associés seront supprimés.
        </p>

        <form action={formAction} className="mt-3 space-y-3">
          <input type="hidden" name="id" value={projectId} />

          <label
            htmlFor={`confirmation-${projectId}`}
            className="block text-xs font-semibold text-red-800"
          >
            Tapez SUPPRIMER pour confirmer.
          </label>

          <input
            id={`confirmation-${projectId}`}
            name="confirmation"
            type="text"
            required
            value={typedValue}
            onChange={(event) => setTypedValue(event.target.value)}
            autoComplete="off"
            className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm"
          />

          {state.error && (
            <p role="alert" className="text-sm font-semibold text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isPending || typedValue !== "SUPPRIMER"}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? "Suppression..." : "Confirmer la suppression"}
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setConfirmation(false);
                setTypedValue("");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    );
  }