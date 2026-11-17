import { Suspense } from "react";
import { connection } from "next/server";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import FloatingActions from "@/components/layout/FloatingActions";


export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* FLASH INFO */}
      <AnnouncementBar />

      {/* NAVIGATION */}
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <PublicNavbar />
      </Suspense>

      {/* CONTENU */}
      <main className="flex-1">{children}</main>

      {/* ACTIONS FLOTTANTES */}
      <FloatingActions />

      {/* PIED DE PAGE */}
      <Footer />

    </>
  );
}

async function PublicNavbar() {
  await connection();

  const solutions = await prisma.solution.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { isFeatured: "desc" },
      { sortOrder: "asc" },
      { publishedAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return <Navbar solutions={solutions} />;
}



// import { connection } from "next/server";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { prisma } from "@/lib/prisma";
// import AnnouncementBar from "@/components/layout/AnnouncementBar";

// export default async function PublicLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   await connection();

//   const solutions = await prisma.solution.findMany({
//     where: {
//       status: "PUBLISHED",
//     },
//     orderBy: [
//       { isFeatured: "desc" },
//       { sortOrder: "asc" },
//       { publishedAt: "desc" },
//     ],
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//     },
//   });

//   return (
//     <>
//       <AnnouncementBar />
//       <Navbar solutions={solutions} />
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </>
//   );
// }