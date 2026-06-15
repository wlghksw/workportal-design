import Link from "next/link";
import { GUIDE_MENU, GuideCategoryId } from "@/features/portal";
import { Card, Stack } from "@/components";

interface GuideSidebarProps {
  activeId?: GuideCategoryId;
}

export function GuideSidebar({ activeId }: GuideSidebarProps) {
  return (
    <aside className="guide-sidebar">
      <Card variant="default">
        <Card.Header>
          <Card.Title className="guide-sidebar-title">
            업무 자동화 서비스
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="portal-menu-list">
            {GUIDE_MENU.map((item) => (
              <div
                key={item.id}
                className={`portal-menu-item ${activeId === item.id ? "active" : ""}`}
              >
                <Link href={`/guide?service=${item.id}`} className="portal-menu-btn">
                  <ServiceMenuIcon id={item.id} />
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </aside>
  );
}

function ServiceMenuIcon({ id }: { id: GuideCategoryId }) {
  // Simple icons matching the legacy sidebar
  switch (id) {
    case "newsletter":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "meeting":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    case "fairytale":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
        </svg>
      );
    case "ppt":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
  }
}
