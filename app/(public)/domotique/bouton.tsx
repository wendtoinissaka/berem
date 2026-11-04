import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  variante?: "primary" | "secondary" | "dark";
  externe?: boolean;
};

/** Utilise le système de boutons .berem-btn défini dans globals.css. */
export default function Bouton({ href, children, variante = "primary", externe }: Props) {
  const classe = `berem-btn berem-btn--${variante} group`;
  const contenu = (
    <>
      <span className="berem-btn__content">{children}</span>
      <span className="berem-btn__icon" aria-hidden="true">
        <ArrowUpRight size={18} />
      </span>
      <span className="berem-btn__shine" aria-hidden="true" />
    </>
  );

  return externe ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classe}>
      {contenu}
    </a>
  ) : (
    <Link href={href} className={classe}>
      {contenu}
    </Link>
  );
}
