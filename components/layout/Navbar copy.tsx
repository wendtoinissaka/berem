"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Entreprise", href: "/entreprise" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Chantiers", href: "/chantiers" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="BEREM - Accueil"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#102A43] text-xl font-black text-white">
            B<span className="text-[#F59E0B]">.</span>
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-black tracking-[0.16em] text-[#102A43]">
              BEREM
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Génie civil & BTP
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-6 lg:flex xl:gap-7"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#F59E0B]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 rounded-md bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#102A43] transition hover:bg-amber-400"
          >
            Demander un devis
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-2xl text-[#102A43] lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigation mobile"
          className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#F59E0B]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/devis"
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-md bg-[#F59E0B] px-4 py-3 text-center font-bold text-[#102A43]"
            >
              Demander un devis
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}


// "use client";

// import Link from "next/link";
// import { useState } from "react";

// const navigation = [
//   { label: "Accueil", href: "/" },
//   { label: "Entreprise", href: "/entreprise" },
//   { label: "Services", href: "/services" },
//   { label: "Réalisations", href: "/realisations" },
//   { label: "Chantiers", href: "/chantiers" },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
//       <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
//         <Link
//           href="/"
//           className="group flex items-center gap-3"
//           aria-label="BEREM - Accueil"
//           onClick={() => setMenuOpen(false)}
//         >
//           <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#102A43] text-xl font-black text-white">
//             B<span className="text-[#F59E0B]">.</span>
//           </span>

//           <span className="flex flex-col">
//             <span className="text-xl font-black tracking-[0.16em] text-[#102A43]">
//               BEREM
//             </span>
//             <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
//               Génie civil & BTP
//             </span>
//           </span>
//         </Link>

//         <nav className="hidden items-center gap-7 lg:flex">
//           {navigation.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#F59E0B]"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="hidden lg:block">
//           <Link
//             href="/devis"
//             className="inline-flex items-center gap-2 rounded-md bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#102A43] transition hover:bg-amber-400"
//           >
//             Demander un devis
//             <span aria-hidden="true">↗</span>
//           </Link>
//         </div>

//         <button
//           type="button"
//           aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
//           aria-expanded={menuOpen}
//           aria-controls="mobile-navigation"
//           onClick={() => setMenuOpen((open) => !open)}
//           className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-2xl text-[#102A43] lg:hidden"
//         >
//           {menuOpen ? "×" : "☰"}
//         </button>
//       </div>

//       {menuOpen && (
//         <nav
//           id="mobile-navigation"
//           className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden"
//         >
//           <div className="mx-auto flex max-w-7xl flex-col gap-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setMenuOpen(false)}
//                 className="rounded-md px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#F59E0B]"
//               >
//                 {item.label}
//               </Link>
//             ))}

//             <Link
//               href="/devis"
//               onClick={() => setMenuOpen(false)}
//               className="mt-3 rounded-md bg-[#F59E0B] px-4 py-3 text-center font-bold text-[#102A43]"
//             >
//               Demander un devis
//             </Link>
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// }