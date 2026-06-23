"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ActivityItem,
  ActivityListResponse,
  ActivityFacets,
  ActivityFilter,
  ServiceId,
  SERVICE_LABEL,
} from "@/features/portal";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
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

  const [filters, setFilters] = useState<ActivityFilter>({ user: "", service: "" });
  const [facets, setFacets] = useState<ActivityFacets>({ users: [], services: [] });

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
    setPage(0);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="activity-page-head">
        <div className="activity-page-head__left">
          <h1 className="activity-page-title">기능 사용 로그</h1>
          <span className="activity-count-badge" aria-live="polite">
            {isLoading ? "확인 중…" : `총 ${total.toLocaleString()}건`}
          </span>
        </div>
        <button
          type="button"
          className="activity-refresh-btn"
          onClick={() => loadActivity()}
          disabled={isLoading}
          aria-label="데이터 새로고침"
        >
          ↻ 새로고침
        </button>
      </div>

      {/* 필터 바 */}
      <div className="activity-filter-bar" aria-label="활동 내역 필터">
        <div className="activity-filter-group">
          <label className="activity-filter-label" htmlFor="user-select">사용자</label>
          <select
            id="user-select"
            className="activity-filter-select"
            value={filters.user}
            onChange={(e) => handleFilterChange("user", e.target.value)}
            disabled={isLoading}
            aria-controls="activity-timeline"
          >
            <option value="">전체</option>
            {facets.users.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="activity-filter-group">
          <label className="activity-filter-label" htmlFor="service-select">서비스</label>
          <select
            id="service-select"
            className="activity-filter-select"
            value={filters.service}
            onChange={(e) => handleFilterChange("service", e.target.value)}
            disabled={isLoading}
            aria-controls="activity-timeline"
          >
            <option value="">전체</option>
            {facets.services.map((s) => (
              <option key={s} value={s}>
                {SERVICE_LABEL[s as ServiceId] || s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 목록 테이블 */}
      <div className="activity-table-wrap">
        <div className="activity-table-head">
          <span>사용자</span>
          <span>서비스</span>
          <span>액션</span>
          <span>시간</span>
        </div>
        <ul
          id="activity-timeline"
          className="activity-timeline"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <li className="activity-empty">목록을 불러오는 중입니다.</li>
          ) : isError ? (
            <li className="activity-empty" role="alert">
              데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </li>
          ) : items.length > 0 ? (
            items.map((row, idx) => {
              const who = row.displayName || row.user || "알 수 없음";
              const svc = SERVICE_LABEL[row.service as ServiceId] || row.serviceName || row.service;
              return (
                <li key={idx} className="activity-row">
                  <span className="activity-row__who">{who}</span>
                  <span className={`activity-row__service activity-item__service--${row.service}`}>
                    {svc}
                  </span>
                  <span className="activity-row__label">
                    {row.label || row.action}
                    {row.detail && (
                      <span className="activity-row__detail">{row.detail}</span>
                    )}
                  </span>
                  <time className="activity-row__time" dateTime={row.ts}>
                    {fmtDateTime(row.ts)}
                  </time>
                </li>
              );
            })
          ) : (
            <li className="activity-empty">기록이 없습니다. 필터 조건을 변경해보세요.</li>
          )}
        </ul>
      </div>

      {/* 페이지네이션 */}
      <div className="activity-footer">
        <button
          type="button"
          className="activity-pagination-btn"
          disabled={page <= 0 || isLoading}
          onClick={() => setPage((p) => p - 1)}
          aria-label="이전 페이지"
        >
          이전
        </button>
        <span className="activity-pagination-info" aria-current="page">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          className="activity-pagination-btn"
          disabled={page >= totalPages - 1 || isLoading}
          onClick={() => setPage((p) => p + 1)}
          aria-label="다음 페이지"
        >
          다음
        </button>
      </div>
    </>
  );
}
