import Link from "next/link";
import { listSitesUseCase, dbBacked } from "@/features/sites/site.di";
import { PublishToggle } from "./PublishToggle";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await listSitesUseCase().execute();
  const sites = result.ok ? result.value : [];
  const usingDb = dbBacked();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sites</h1>
          <p className="text-sm text-neutral-500">
            {sites.length} invitation{sites.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {!usingDb && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Supabase isn&rsquo;t connected — showing the in-memory sample. Set
          <code className="mx-1 rounded bg-amber-100 px-1">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          and
          <code className="mx-1 rounded bg-amber-100 px-1">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
          to manage real sites. Publishing is disabled until then.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Couple</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {sites.map((site) => (
              <tr key={site.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {site.coupleNames}
                </td>
                <td className="px-4 py-3 text-neutral-500">/{site.slug}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${site.slug}`}
                    className="text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
                    target="_blank"
                  >
                    View
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <PublishToggle
                    siteId={site.id}
                    published={site.publishedAt != null}
                    disabled={!usingDb}
                  />
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  No sites yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
