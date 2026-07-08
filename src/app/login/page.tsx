"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "./login.css";
import { Sprig, IconCheck, IconInfo, IconBack, GoogleMark } from "@/components/atoms";

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
