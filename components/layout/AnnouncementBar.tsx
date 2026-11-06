"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Announcement = {
  id: string;
  title: string | null;
  message: string;
  type: string;
  targetUrl: string | null;
  linkLabel: string | null;
  openInNewTab: boolean;
};

const typeLabels: Record<string, string> = {
  GENERAL: "INFORMATION",
  NEWS: "ACTUALITÉ",
  BLOG: "BLOG",
  PROJECT: "RÉALISATION",
  CONSTRUCTION: "CHANTIER",
  REAL_ESTATE: "IMMOBILIER",
  DOMOTICS: "DOMOTIQUE",
  PROMOTION: "OFFRE",
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnnouncements() {
      try {
        const response = await fetch("/api/announcements", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data: Announcement[] = await response.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erreur AnnouncementBar :", error);
        }
      }
    }

    fetchAnnouncements();

    return () => controller.abort();
  }, []);

  if (announcements.length === 0) return null;

  const renderAnnouncements = (isClone = false) =>
    announcements.map((announcement) => {
      const content = (
        <>
          <span className="announcement-bar__category">
            {typeLabels[announcement.type] ?? "INFORMATION"}
          </span>

          <span className="announcement-bar__message">
            {announcement.message}
          </span>

          {announcement.targetUrl && (
            <span className="announcement-bar__link">
              {announcement.linkLabel || "En savoir plus"}
              <ArrowUpRight size={12} strokeWidth={2} />
            </span>
          )}
        </>
      );

      const className = "announcement-bar__item";
      const key = `${announcement.id}-${isClone ? "clone" : "original"}`;

      if (!announcement.targetUrl) {
        return (
          <div className={className} key={key}>
            {content}
          </div>
        );
      }

      if (isExternalUrl(announcement.targetUrl)) {
        return (
          <a
            key={key}
            href={announcement.targetUrl}
            className={className}
            target={announcement.openInNewTab ? "_blank" : undefined}
            rel={
              announcement.openInNewTab
                ? "noopener noreferrer"
                : undefined
            }
            tabIndex={isClone ? -1 : undefined}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          key={key}
          href={announcement.targetUrl}
          className={className}
          target={announcement.openInNewTab ? "_blank" : undefined}
          tabIndex={isClone ? -1 : undefined}
        >
          {content}
        </Link>
      );
    });

  return (
    <section
      className="announcement-bar"
      aria-label="Informations et actualités BEREM"
    >
      <div className="announcement-bar__brand">
        <span className="announcement-bar__brand-indicator" />
        <span>BEREM</span>
        <span className="announcement-bar__brand-separator">/</span>
        <span className="announcement-bar__brand-label">FLASH INFO</span>
      </div>

      <div className="announcement-bar__viewport">
        <div className="announcement-bar__track">
          <div className="announcement-bar__group">
            {renderAnnouncements()}
          </div>

          <div className="announcement-bar__group" aria-hidden="true">
            {renderAnnouncements(true)}
          </div>
        </div>
      </div>

      <div className="announcement-bar__right">
        <span>ACTUALITÉS</span>
      </div>
    </section>
  );
}