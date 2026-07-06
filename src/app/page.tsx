import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Invitatio</h1>
      <p className="text-neutral-600">
        Beautiful wedding invitations, published per couple. Each couple&rsquo;s
        invitation lives at its own address —{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm">
          /their-slug
        </code>
        .
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/inka-riyadi"
          className="rounded-full bg-neutral-900 px-5 py-2.5 font-medium text-white transition hover:bg-neutral-700"
        >
          View sample invitation
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition hover:bg-neutral-50"
        >
          Admin dashboard
        </Link>
      </div>
    </main>
  );
}
