import {
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from "./actions";
import { prisma } from "@/lib/prisma";
import { StatisticSource } from "@/generated/prisma/client";

export const metadata = {
  title: "Statistiques | BEREM Admin",
};

const sourceLabels: Record<StatisticSource, string> = {
  MANUAL: "Valeur manuelle",
  COMPLETED_PROJECTS: "Projets terminés",
  ONGOING_PROJECTS: "Chantiers en cours",
  ACTIVE_SERVICES: "Services actifs",
  PUBLISHED_SOLUTIONS: "Solutions publiées",
  PUBLISHED_TESTIMONIALS: "Témoignages publiés",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#D59344] focus:ring-2 focus:ring-[#D59344]/20";

const labelClass = "block text-sm font-semibold text-slate-700";

function SourceOptions() {
  return (
    <>
      {Object.values(StatisticSource).map((source) => (
        <option key={source} value={source}>
          {sourceLabels[source]}
        </option>
      ))}
    </>
  );
}

export default async function StatisticsAdminPage() {
  const statistics = await prisma.homeStatistic.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const visibleCount = statistics.filter((item) => item.isVisible).length;
  const automaticCount = statistics.filter(
    (item) => item.source !== StatisticSource.MANUAL,
  ).length;
  const manualCount = statistics.length - automaticCount;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#172033]">
          Statistiques de la page d’accueil
        </h1>
        <p className="mt-2 text-slate-600">
          Gérez les chiffres et indicateurs affichés sur le site BEREM.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#EAE1D7] bg-white p-5">
          <p className="text-sm text-slate-500">Total des statistiques</p>
          <p className="mt-2 text-3xl font-black text-[#172033]">
            {statistics.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE1D7] bg-white p-5">
          <p className="text-sm text-slate-500">Visibles sur le site</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {visibleCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE1D7] bg-white p-5">
          <p className="text-sm text-slate-500">Manuelles / automatiques</p>
          <p className="mt-2 text-3xl font-black text-[#172033]">
            {manualCount}
            <span className="mx-2 text-slate-300">/</span>
            {automaticCount}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-[#EAE1D7] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#BE7D32]">
            Nouvelle statistique
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#172033]">
            Ajouter un indicateur
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choisissez une valeur manuelle ou une donnée calculée depuis la
            base de données.
          </p>
        </div>

        <form action={createStatistic} className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="new-label" className={labelClass}>
              Libellé
            </label>
            <input
              id="new-label"
              name="label"
              required
              maxLength={100}
              placeholder="Ex. Projets réalisés"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="new-source" className={labelClass}>
              Source de la valeur
            </label>
            <select
              id="new-source"
              name="source"
              defaultValue="MANUAL"
              className={inputClass}
            >
              <SourceOptions />
            </select>
          </div>

          <div>
            <label htmlFor="new-value" className={labelClass}>
              Valeur manuelle
            </label>
            <input
              id="new-value"
              name="manualValue"
              placeholder="Ex. 25"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">
              Utilisée uniquement si la source est manuelle.
            </p>
          </div>

          <div>
            <label htmlFor="new-suffix" className={labelClass}>
              Suffixe
            </label>
            <input
              id="new-suffix"
              name="suffix"
              placeholder="Ex. +, %, ans"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="new-description" className={labelClass}>
              Description (facultative)
            </label>
            <input
              id="new-description"
              name="description"
              placeholder="Courte précision sur cet indicateur"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="new-order" className={labelClass}>
              Ordre d’affichage
            </label>
            <input
              id="new-order"
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked
                className="size-4 accent-[#BE7D32]"
              />
              <span className="text-sm font-medium text-slate-700">
                Afficher cette statistique sur la page d’accueil
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-[#10161F] px-6 py-3 font-semibold text-white transition hover:bg-[#26364A]"
            >
              Ajouter la statistique
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">
            Statistiques enregistrées
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Modifiez les informations directement depuis chaque fiche.
          </p>
        </div>

        {statistics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="text-lg font-bold text-[#172033]">
              Aucune statistique enregistrée
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Ajoutez votre premier indicateur avec le formulaire ci-dessus.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {statistics.map((statistic) => (
              <article
                key={statistic.id}
                className="rounded-2xl border border-[#EAE1D7] bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#172033]">
                      {statistic.label}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {sourceLabels[statistic.source]}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statistic.isVisible
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {statistic.isVisible ? "Visible" : "Masquée"}
                  </span>
                </div>

                <form
                  action={updateStatistic}
                  className="grid gap-5 md:grid-cols-2"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={statistic.id}
                  />

                  <div>
                    <label
                      htmlFor={`label-${statistic.id}`}
                      className={labelClass}
                    >
                      Libellé
                    </label>
                    <input
                      id={`label-${statistic.id}`}
                      name="label"
                      required
                      maxLength={100}
                      defaultValue={statistic.label}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`source-${statistic.id}`}
                      className={labelClass}
                    >
                      Source de la valeur
                    </label>
                    <select
                      id={`source-${statistic.id}`}
                      name="source"
                      defaultValue={statistic.source}
                      className={inputClass}
                    >
                      <SourceOptions />
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`value-${statistic.id}`}
                      className={labelClass}
                    >
                      Valeur manuelle
                    </label>
                    <input
                      id={`value-${statistic.id}`}
                      name="manualValue"
                      defaultValue={statistic.manualValue ?? ""}
                      placeholder="Ex. 25"
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Utilisée uniquement pour une source manuelle.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor={`suffix-${statistic.id}`}
                      className={labelClass}
                    >
                      Suffixe
                    </label>
                    <input
                      id={`suffix-${statistic.id}`}
                      name="suffix"
                      defaultValue={statistic.suffix ?? ""}
                      placeholder="Ex. +, %, ans"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`description-${statistic.id}`}
                      className={labelClass}
                    >
                      Description
                    </label>
                    <input
                      id={`description-${statistic.id}`}
                      name="description"
                      defaultValue={statistic.description ?? ""}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`order-${statistic.id}`}
                      className={labelClass}
                    >
                      Ordre d’affichage
                    </label>
                    <input
                      id={`order-${statistic.id}`}
                      name="sortOrder"
                      type="number"
                      min={0}
                      step={1}
                      defaultValue={statistic.sortOrder}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex items-center md:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="isVisible"
                        defaultChecked={statistic.isVisible}
                        className="size-4 accent-[#BE7D32]"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Afficher sur la page d’accueil
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-[#10161F] px-5 py-3 font-semibold text-white transition hover:bg-[#26364A]"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>

                <form
                  action={deleteStatistic}
                  className="mt-3 border-t border-slate-100 pt-4"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={statistic.id}
                  />
                  <button
                    type="submit"
                    className="text-sm font-semibold text-red-600 transition hover:text-red-800"
                  >
                    Supprimer cette statistique
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}