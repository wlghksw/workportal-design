"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Input,
  FormField,
  Stack,
} from "@/components";
import { LoginRequest } from "@/features/portal";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/$/,
  ""
);

/**
 * returnUrl 검증: 내부 경로만 허용
 */
function getSafeReturnUrl(url: string | null): string {
  if (!url) return "/";
  if (!url.startsWith("/")) return "/";
  if (url.startsWith("//")) return "/";
  return url;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = getSafeReturnUrl(searchParams.get("return"));

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        router.push(returnUrl);
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("로그인 중 서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login" id="loginForm" onSubmit={handleSubmit}>
      <Link
        href="/"
        className="brand brand--stack"
        style={{ marginBottom: "22px" }}
      >
        <Image
          src="/shared/eduallab-logo.png"
          alt="에듀올랩"
          width={160}
          height={50}
          className="brand__logo"
          priority
        />
        <span className="brand__sub">통합 업무 포탈</span>
      </Link>

      <Stack spacing="md">
        <div>
          <h1 className="text-title-md">로그인</h1>
          <p id="loginSub" className="text-body" style={{ marginTop: "4px" }}>
            업무 자동화 서비스에 접근하려면 로그인하세요.
          </p>
        </div>

        {error && (
          <div className="error is-show" id="loginError">
            {error}
          </div>
        )}

        <FormField label="아이디" htmlFor="username">
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            required
            disabled={isLoading}
          />
        </FormField>

        <FormField label="비밀번호" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            disabled={isLoading}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>

        <p className="text-caption" style={{ color: "var(--text-muted)" }}>
          * 계정 정보는 관리자에게 문의하세요.
        </p>
      </Stack>
    </form>
  );
}
