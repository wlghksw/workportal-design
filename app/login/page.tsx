import {
  Page,
  Button,
  Input,
  FormField,
  Stack,
} from "@/components";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Page className="login-page">
      <div className="login-wrap">
        <form className="login" id="loginForm">
          <Link href="/" className="brand brand--stack" style={{ marginBottom: "22px" }}>
            <Image
              src="/shared/eduallab-logo.png"
              alt="에듀올랩"
              width={160}
              height={50}
              className="brand__logo"
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

            <div className="error" id="loginError" style={{ display: "none" }}>
              아이디 또는 비밀번호가 올바르지 않습니다.
            </div>

            <FormField label="아이디" htmlFor="username">
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </FormField>

            <FormField label="비밀번호" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </FormField>

            <Button type="submit" variant="primary" fullWidth>
              로그인
            </Button>

            <p className="text-caption" style={{ color: "var(--text-muted)" }}>
              * 계정 정보는 관리자에게 문의하세요.
            </p>
          </Stack>
        </form>
      </div>
    </Page>
  );
}
