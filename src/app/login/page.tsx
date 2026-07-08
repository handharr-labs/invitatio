"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "./login.css";
import { Sprig, IconCheck } from "../_landing/ornaments";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9.5v4M10 6.5h.01" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 10H5M9 5l-5 5 5 5" />
    </svg>
  );
}

function LoginView() {
  const params = useSearchParams();
  const redirectTo = params.get("callbackUrl") ?? "/dashboard";
  const forbidden = params.get("error") === "forbidden";

  return (
    <div className="ds-dos auth">
      {/* ---- left: the invitation stage ---- */}
      <aside className="auth-aside">
        <span className="auth-brand">
          <Sprig size={26} className="auth-brand__mark" />
          Invitatio
        </span>

        <Sprig size={160} className="auth-sprig auth-sprig--tl" />
        <Sprig size={208} className="auth-sprig auth-sprig--br" />

        <div className="auth-stage">
          <div className="auth-card">
            <span className="auth-card__frame" />
            <span className="auth-card__eyebrow">The Wedding Of</span>
            <Sprig size={30} className="auth-card__sprig" />
            <p className="auth-card__names">
              Inka
              <span className="auth-card__amp">&amp;</span>
              Riyadi
            </p>
            <p className="auth-card__date">Sabtu, 12 Oktober 2026</p>
            <span className="auth-card__rule" />
            <span className="auth-card__status">
              <span className="auth-dot" /> Undangan tayang
            </span>

            <span className="auth-chip">
              <span className="auth-chip__dot">
                <IconCheck size={13} />
              </span>
              <span>
                <strong>24</strong> tamu sudah RSVP
              </span>
            </span>
          </div>
        </div>

        <div className="auth-quote">
          <p className="auth-quote__script">Selamat datang kembali</p>
          <p className="auth-quote__line">
            Undangan yang kalian susun sudah menunggu — lanjutkan dari tempat
            terakhir kalian berhenti.
          </p>
        </div>
      </aside>

      {/* ---- right: the sign-in column ---- */}
      <main className="auth-main">
        <div className="auth-panel">
          <span className="auth-eyebrow">Studio Undangan</span>
          <h1 className="auth-title">Masuk ke Invitatio</h1>
          <p className="auth-lede">
            Kelola undangan, susun daftar tamu, dan pantau RSVP setiap acara —
            semuanya dari satu dashboard.
          </p>

          {forbidden && (
            <div className="auth-notice" role="alert">
              <IconInfo />
              <span>
                Akun itu belum punya akses. Masuk dengan akun yang diundang
                sebagai admin, atau hubungi tim Invitatio untuk dibukakan akses.
              </span>
            </div>
          )}

          <button
            type="button"
            className="auth-google"
            onClick={() =>
              authClient.signIn("google", {
                redirectTo,
                // Always show Google's account chooser instead of silently
                // re-authenticating the still-active Google session — lets a
                // different admin pick their account after sign-out.
                queryParams: { prompt: "select_account" },
              })
            }
          >
            <GoogleMark />
            Lanjutkan dengan Google
          </button>

          <p className="auth-fine">
            Akses khusus akun admin yang diundang. Dengan masuk, kalian setuju
            pada ketentuan penggunaan Invitatio.
          </p>

          <div className="auth-foot">
            <Link href="/" className="auth-back">
              <IconBack />
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
