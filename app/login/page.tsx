import { Suspense } from "react";
import { Page } from "@/components";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Page className="login-page">
      <div className="login-wrap">
        <Suspense fallback={<div className="login-loading">로딩 중...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </Page>
  );
}
