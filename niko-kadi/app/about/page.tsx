import { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "findmystation is a civic project helping Kenyan voters locate IEBC constituency registration offices through crowdsourced GPS coordinates.",
};

export default function AboutPage() {
  return (
    <PageShell title="About">
      <h1 className="text-xl font-bold text-gray-900 mb-6">About findmystation</h1>

      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">The Problem</h2>
          <p className="text-gray-600 leading-relaxed">
            Kenya&apos;s IEBC operates 290 constituency registration offices across all 47
            counties. The only publicly available directory uses text-based landmark
            descriptions &mdash; &ldquo;Behind Equity Bank, 200 metres&rdquo; or &ldquo;DCC
            Compound, next to Chief&apos;s Office.&rdquo;
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            No GPS coordinates. No interactive map. No way to tap a button and get directions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">The Solution</h2>
          <p className="text-gray-600 leading-relaxed">
            findmystation transforms a static PDF into a living, crowd-verified, navigable
            directory. Citizens drop a pin where they know an office is. When 7 independent
            contributors confirm the same spot (within 100m), it becomes verified and anyone
            can get directions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">How It Works</h2>
          <ol className="list-decimal list-inside space-y-1.5 text-gray-600">
            <li>Search for your constituency or browse by county.</li>
            <li>If verified, tap &ldquo;Navigate&rdquo; for directions via Google Maps, Waze, etc.</li>
            <li>If unverified, drop a pin on the map where the office is.</li>
            <li>7 confirmations = verified GPS point.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            No personal data is collected. Device identification uses hashed browser
            fingerprints &mdash; we never see raw IP addresses. Contributors can remain
            fully anonymous.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Open Source</h2>
          <p className="text-gray-600 leading-relaxed">
            Released under the MIT License. Use it, fork it, adapt it for your country.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
