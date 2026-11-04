import type { Metadata } from "next";
import Link from "next/link";
import HeroImmersif from "./hero-immersif";
import Composants from "./composants";
import Galerie from "./galerie";
import Configurateur from "./configurateur";


// TODO : remplacer par le nom réel de l’entreprise
const ENTREPRISE = "Nom de l’entreprise";

const DESCRIPTION =
  "Domotique et bâtiment connecté à Ouagadougou et au Burkina Faso : sécurité, énergie, confort et eau, pensés dès le chantier.";

export const metadata: Metadata = {
  title: `Domotique et bâtiment connecté à Ouagadougou | ${ENTREPRISE}`,
  description: DESCRIPTION,
  alternates: { canonical: "/domotique" },
  openGraph: {
    title: `Domotique et bâtiment connecté | ${ENTREPRISE}`,
    description: DESCRIPTION,
    type: "website",
    locale: "fr_BF",
  },
};

const IMPORTANCE = [
  { titre: "Un bâtiment qui veille", texte: "Intrusion, fumée, gaz, fuite d’eau : le système détecte et vous prévient aussitôt, même lorsque vous êtes loin." },
  { titre: "Une énergie mieux utilisée", texte: "L’éclairage et la climatisation suivent la présence et l’heure. Lors d’une coupure, la maison bascule seule sur batterie ou solaire et garde l’essentiel." },
  { titre: "Le confort en un geste", texte: "Un scénario règle lumières, volets et température. C’est aussi une vraie aide pour les personnes âgées ou à mobilité réduite." },
  { titre: "Un bien plus attractif", texte: "Un bâtiment moderne, suivi à distance et facile à entretenir se vend et se loue plus facilement." },
];

const PHASES = [
  { nom: "Gros œuvre", texte: "Nous prévoyons les gaines, les fourreaux et les boîtiers avant le coulage et les cloisons. Rien ne sera à casser plus tard." },
  { nom: "Second œuvre", texte: "Câblage, tableau de commande, capteurs et modules sont posés avec l’électricité, au bon endroit dès la première fois." },
  { nom: "Finitions", texte: "Programmation des scénarios, essais pièce par pièce, puis prise en main avec le propriétaire." },
];

const FAQ = [
  { q: "Peut-on installer la domotique dans une maison déjà construite ?", r: "Oui, avec des équipements sans fil ou en passant de nouveaux câbles. C’est plus simple et moins coûteux quand elle est prévue dès la construction, ce que nous recommandons." },
  { q: "Que se passe-t-il quand internet est coupé ?", r: "Avec un serveur local, les automatismes (éclairage, volets, alarme, scénarios) continuent de fonctionner. Seul le pilotage à distance dépend de la connexion." },
  { q: "Les équipements dépendent-ils d’un seul fabricant ?", r: "Nous privilégions des standards ouverts, pour que votre installation puisse évoluer et être entretenue sans être liée à une seule marque." },
  { q: "Comment obtenir un prix ?", r: "Le chiffrage dépend des plans, du nombre de pièces et des fonctions choisies. Utilisez le configurateur puis envoyez votre sélection : nous revenons vers vous avec un devis." },
];

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function DomotiquePage() {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Domotique et bâtiment connecté",
    serviceType: "Installation de domotique",
    provider: { "@type": "GeneralContractor", name: ENTREPRISE },
    areaServed: { "@type": "Country", name: "Burkina Faso" },
    description: DESCRIPTION,
  };

  return (
    <main className="bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroImmersif />

      {/* Importance de la domotique */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:sticky lg:top-8">
              Pourquoi la domotique change la vie d’un bâtiment
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Elle ne sert pas à impressionner : elle protège, économise et simplifie le quotidien, surtout là où le
              courant et l’eau ne sont pas toujours réguliers.
            </p>
          </div>
          <ul className="lg:col-span-7">
            {IMPORTANCE.map((i) => (
              <li key={i.titre} className="border-t-2 border-primary py-6 first:pt-4">
                <h3 className="text-2xl font-semibold tracking-tight">{i.titre}</h3>
                <p className="mt-2 max-w-xl text-muted-foreground">{i.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Composants et leur utilité */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Les composants et à quoi ils servent</h2>
          <p className="mb-10 mt-3 max-w-2xl text-lg text-muted-foreground">
            Choisissez un élément pour comprendre son rôle, son utilité et un exemple de la vie courante.
          </p>
          <Composants />
        </div>
      </section>

      {/* Carrousel de lieux connectés */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Des lieux connectés</h2>
        <p className="mb-8 mt-3 max-w-2xl text-lg text-muted-foreground">
          Maisons, chambres, appartements, commerces et places : touchez un lieu pour l’agrandir et voir ce qui y est installé.
        </p>
        <Galerie />
      </section>

      {/* Séquence du chantier */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">La domotique, prévue avec la structure</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Parce que nous construisons le bâtiment, nous préparons la domotique à chaque étape du chantier.
          </p>
          <ol className="mt-10 max-w-2xl border-l-2 border-border">
            {PHASES.map((p) => (
              <li key={p.nom} className="relative pb-8 pl-8 last:pb-0">
                <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-background" aria-hidden="true" />
                <h3 className="text-xl font-semibold">{p.nom}</h3>
                <p className="mt-1 text-muted-foreground">{p.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Configurateur */}
      <section id="configurateur" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight">Composez votre projet</h2>
        <p className="mb-10 mt-3 max-w-2xl text-lg text-muted-foreground">
          Choisissez votre type de bien et les fonctions qui comptent pour vous. Votre sélection accompagne ensuite votre demande de devis.
        </p>
        <Configurateur />
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">Questions fréquentes</h2>
          <div className="mt-8 divide-y border-y">
            {FAQ.map((f) => (
              <details key={f.q} className="py-4">
                <summary className={`cursor-pointer rounded-sm font-medium ${focus}`}>{f.q}</summary>
                <p className="mt-3 text-muted-foreground">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Appel final */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight">
            Un projet de construction ou de rénovation ? Parlons de sa domotique.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/devis?service=domotique" className={`inline-flex h-10 items-center rounded-md bg-background px-5 text-sm font-medium text-foreground hover:bg-background/90 ${focus}`}>
              Demander un devis
            </Link>
            {numero && (
              <a
                href={`https://wa.me/${numero}?text=${encodeURIComponent("Bonjour, je souhaite en savoir plus sur vos solutions domotiques.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-10 items-center rounded-md border border-primary-foreground/40 px-5 text-sm font-medium hover:bg-primary-foreground/10 ${focus}`}
              >
                Écrire sur WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
