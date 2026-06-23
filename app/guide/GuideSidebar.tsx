"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GUIDE_MENU, GUIDE_TOC, GuideCategoryId } from "@/features/portal";

export function GuideSidebar({ activeId }: { activeId: GuideCategoryId }) {
  const toc = GUIDE_TOC[activeId] || [];
  const [activeTocId, setActiveTocId] = useState<string>("");

  useEffect(() => {
    const tocIds = toc
      .filter((item) => !item.isHeader)
      .map((item) => item.id);

    if (tocIds.length === 0) return;

    setActiveTocId(tocIds[0]);

    const THRESHOLD = 96;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let current = tocIds[0];
        for (const id of tocIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < THRESHOLD) {
            current = id;
          }
        }
        setActiveTocId(current);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId, toc]);

  return (
    <aside className="guide-panel">
      <div className="guide-panel__section">
        <p className="guide-panel__label">서비스 가이드</p>
        <nav className="guide-service-list">
          {GUIDE_MENU.map((item) => (
            <Link
              key={item.id}
              href={`/guide?service=${item.id}`}
              className={`guide-service-item guide-service-item--${item.id}${activeId === item.id ? " is-active" : ""}`}
            >
              <span className={`guide-service-icon guide-service-icon--${item.id}`}>
                <GuideServiceIcon id={item.id} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {toc.length > 0 && (
        <>
          <div className="guide-panel__divider" />
          <div className="guide-panel__section">
            <p className="guide-panel__label">목차</p>
            <nav className="guide-toc-list">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={item.isHeader ? undefined : `#${item.id}`}
                  onClick={!item.isHeader ? () => setActiveTocId(item.id) : undefined}
                  className={[
                    "guide-toc-item",
                    item.isHeader ? "is-header" : "",
                    !item.isHeader && activeTocId === item.id ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </aside>
  );
}

function GuideServiceIcon({ id }: { id: GuideCategoryId }) {
  switch (id) {
    case "newsletter":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "meeting":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      );
    case "fairytale":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "ppt":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      );
  }
}
