import { connection } from "next/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <>
      <AnnouncementBar />
      <Navbar solutions={solutions} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}