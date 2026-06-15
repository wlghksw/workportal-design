"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Stack,
  Cluster,
  FormField,
  Select,
  Button,
  Badge,
} from "@/components";
import {
  ActivityItem,
  ActivityListResponse,
  ActivityFacets,
  ActivityFilter,
  ServiceId,
  SERVICE_LABEL,
} from "@/features/portal";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/$/,
  ""
);

const PAGE_SIZE = 30;

function fmtDateTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function ActivityList() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [filters, setFilters] = useState<ActivityFilter>({
    user: "",
    service: "",
  });
  const [facets, setFacets] = useState<ActivityFacets>({
    users: [],
    services: [],
  });

  const apiFetch = useCallback((url: string, opts: RequestInit = {}) => {
    return fetch(API_BASE + url, { credentials: "include", ...opts });
  }, []);

  const loadFacets = useCallback(async () => {
    try {
      const r = await apiFetch("/api/activity/facets");
      if (r.ok) {
        const data: ActivityFacets = await r.json();
        setFacets(data);
      }
    } catch (e) {
      console.warn("facets load failed", e);
    }
  }, [apiFetch]);

  const loadActivity = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(page * PAGE_SIZE),
    });
    
    if (filters.user) params.set("user", filters.user);
    if (filters.service) params.set("service", filters.service);

    try {
      const r = await apiFetch(`/api/activity?${params.toString()}`);
      if (r.ok) {
        const data: ActivityListResponse = await r.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      } else {
        setIsError(true);
      }
    } catch (e) {
      console.error("activity load failed", e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch, page, filters]);

  useEffect(() => {
    loadFacets();
  }, [loadFacets]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleFilterChange = (key: keyof ActivityFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // 필터 변경 시 첫 페이지로 리셋
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Card variant="default">
      <Card.Header className="panel__head">
        <Card.Title>기능 사용 로그</Card.Title>
        <Badge variant={isLoading ? "default" : "neutral"} soft size="sm">
          {isLoading ? "확인 중…" : `총 ${total.toLocaleString()}건`}
        </Badge>
      </Card.Header>

      <Card.Body>
        <Stack spacing="md">
          {/* 필터 툴바 */}
          <Cluster className="activity-toolbar">
            <FormField label="사용자" htmlFor="user-select">
              <Select
                id="user-select"
                value={filters.user}
                onChange={(e) => handleFilterChange("user", e.target.value)}
                disabled={isLoading}
              >
                <option value="">전체</option>
                {facets.users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="서비스" htmlFor="service-select">
              <Select
                id="service-select"
                value={filters.service}
                onChange={(e) => handleFilterChange("service", e.target.value)}
                disabled={isLoading}
              >
                <option value="">전체</option>
                {facets.services.map((s) => (
                  <option key={s} value={s}>
                    {SERVICE_LABEL[s] || s}
                  </option>
                ))}
              </Select>
            </FormField>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadActivity()}
              disabled={isLoading}
            >
              ↻ 새로고침
            </Button>
          </Cluster>

          {/* 타임라인 목록 */}
          <ul className="activity-timeline">
            {isLoading ? (
              <li className="activity-empty">목록을 불러오는 중입니다.</li>
            ) : isError ? (
              <li className="activity-empty">데이터를 불러오지 못했습니다.</li>
            ) : items.length > 0 ? (
              items.map((row, idx) => {
                const who = row.displayName || row.user || "알 수 없음";
                const svc = SERVICE_LABEL[row.service] || row.serviceName || row.service;
                return (
                  <li key={idx} className="activity-item">
                    <div className="activity-item__top">
                      <span className="activity-item__who">{who}</span>
                      <time className="activity-item__time">
                        {fmtDateTime(row.ts)}
                      </time>
                    </div>
                    <div className="activity-item__action">
                      <span className="activity-item__service">{svc}</span>
                      <span className="activity-item__label">
                        {row.label || row.action}
                      </span>
                    </div>
                    {row.detail && (
                      <p className="activity-item__detail">{row.detail}</p>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="activity-empty">
                기록이 없습니다. 필터 조건을 변경해보세요.
              </li>
            )}
          </ul>

          {/* 페이징 */}
          <Cluster
            className="activity-footer"
            style={{
              justifyContent: "center",
              gap: "var(--space-4)",
              marginTop: "var(--space-6)",
            }}
          >
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 0 || isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </Button>
            <span className="text-body-sm">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages - 1 || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </Cluster>
        </Stack>
      </Card.Body>
    </Card>
  );
}
