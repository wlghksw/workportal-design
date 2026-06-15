import { ServiceId } from "./portal.types";

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

export interface ActivityFilter {
  user?: string;
  service?: ServiceId | "";
}

export interface ActivityQuery extends ActivityFilter {
  limit: number;
  offset: number;
}

export interface ActivityListResponse {
  items: ActivityItem[];
  total: number;
}

/**
 * 필터링에 필요한 데이터 셋 (사용자 목록, 서비스 목록)
 */
export interface ActivityFacets {
  users: string[];
  services: ServiceId[];
}
