"use client";

import { useState, useMemo } from "react";
import { Stack, Cluster, FormField, Input, Textarea, Button } from "@/components";
import { NewsletterGenerateRequest } from "@/features/newsletter";

interface NewsletterFormProps {
  onSubmit: (data: NewsletterGenerateRequest) => void;
  isLoading: boolean;
}

export function NewsletterForm({ onSubmit, isLoading }: NewsletterFormProps) {
  const [urls, setUrls] = useState("");
  const [featured, setFeatured] = useState("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const parsedUrls = useMemo(() => urls.split(/\n+/).map(u => u.trim()).filter(Boolean), [urls]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (touched.urls && (parsedUrls.length < 3 || parsedUrls.length > 8)) {
      errs.urls = "블로그 URL을 3~8개 사이로 입력해 주세요.";
    }
    if (touched.year) {
      const y = parseInt(year, 10);
      if (!year || isNaN(y) || y < 2020 || y > 2099) errs.year = "2020~2099년 사이를 입력하세요.";
    }
    if (touched.month) {
      const m = parseInt(month, 10);
      if (!month || isNaN(m) || m < 1 || m > 12) errs.month = "1~12월 사이를 입력하세요.";
    }
    return errs;
  }, [parsedUrls, year, month, touched]);

  const isValid = parsedUrls.length >= 3 && 
    parsedUrls.length <= 8 &&
    !errors.urls && 
    !errors.year && 
    !errors.month && 
    year !== "" && 
    month !== "";

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    setTouched({ urls: true, year: true, month: true });
    if (!isValid || isLoading) return;
    
    onSubmit({
      urls: parsedUrls,
      featured_link: featured || null,
      issue_year: Number(year) || null,
      issue_month: Number(month) || null,
      allow_repeat: allowRepeat
    });
  };

  return (
    <div className="newsletter-section" aria-busy={isLoading}>
      <div className="newsletter-field">
        <label htmlFor="urls">URL 목록</label>
        <Textarea
          id="urls"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          onBlur={() => handleBlur("urls")}
          placeholder="https://blog.naver.com/...&#10;https://blog.naver.com/..."
          className="textarea"
          rows={6}
          disabled={isLoading}
          aria-invalid={!!errors.urls}
        />
        {errors.urls && touched.urls && <p className="field__error">{errors.urls}</p>}
      </div>

      <div className="newsletter-field">
        <label htmlFor="featured">
          메인 URL <span className="opt">선택 — 목록 밖 링크 가능, 비우면 첫 글</span>
        </label>
        <Input
          id="featured"
          type="url"
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
          placeholder="배너용 링크 (블로그·랜딩 페이지 등)"
          className="input"
          disabled={isLoading}
        />
      </div>

      <div className="newsletter-field-row">
        <div className="newsletter-field">
          <label htmlFor="year">연도</label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onBlur={() => handleBlur("year")}
            placeholder="2024"
            className="input"
            min={2020}
            max={2099}
            disabled={isLoading}
            aria-invalid={!!errors.year}
          />
          {errors.year && touched.year && <p className="field__error">{errors.year}</p>}
        </div>
        <div className="newsletter-field">
          <label htmlFor="month">월</label>
          <Input
            id="month"
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            onBlur={() => handleBlur("month")}
            placeholder="12"
            className="input"
            min={1}
            max={12}
            disabled={isLoading}
            aria-invalid={!!errors.month}
          />
          {errors.month && touched.month && <p className="field__error">{errors.month}</p>}
        </div>
      </div>

      <div className="newsletter-form-foot">
        <label className="check-wrap">
          <input
            type="checkbox"
            checked={allowRepeat}
            onChange={(e) => setAllowRepeat(e.target.checked)}
            disabled={isLoading}
          /> 이전 호 URL 포함
        </label>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="btn-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon-svg"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          {isLoading ? "생성 중..." : "뉴스레터 만들기"}
        </Button>
      </div>
    </div>
  );
}
