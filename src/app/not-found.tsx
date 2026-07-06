import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Invitation not found
      </h1>
      <p className="text-neutral-500">
        This invitation doesn&rsquo;t exist yet, or it hasn&rsquo;t been
        published.
      </p>
      <Link
        href="/"
        className="text-sm text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
      >
        Back home
      </Link>
    </main>
  );
}
