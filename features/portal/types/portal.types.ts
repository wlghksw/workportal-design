export type ServiceId =
  | "bidding"
  | "meeting"
  | "news"
  | "newsletter"
  | "ppt"
  | "crayon"
  | "fairytale"
  | "portal";

export interface ServiceData {
  id: ServiceId;
  title: string;
  description: string;
  host: string;
  href: string;
  searchKeywords: string;
  newTab: boolean;
  iconType: ServiceId;
  healthKey?: string;
}

export interface ActivityItem {
  ts: string;
  user: string;
  displayName?: string;
  action: string;
  label?: string;
  service: ServiceId;
  serviceName?: string;
  detail?: string;
}

export interface HealthStatus {
  id: ServiceId;
  status: "up" | "down" | "unknown";
  ms?: number;
}
