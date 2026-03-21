import { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "How to Contribute",
  description:
    "Help fellow Kenyans find their voter registration station by contributing GPS coordinates, sharing, or supporting the project.",
};

export default function ContributePage() {
  return (
    <PageShell title="How to Help">
      {/* ── Section 1: Drop a Pin ── */}
      <h1 className="text-xl font-bold text-gray-900 mb-2">How to Contribute</h1>
      <p className="text-sm text-gray-600 mb-6">
        Every pin you drop helps a fellow Kenyan find their voter registration station.
      </p>

      <div className="space-y-5">
        {[
          {
            step: 1,
            title: "Find a constituency you know",
            desc: "Use the search bar to find a constituency where you know the IEBC office location.",
          },
          {
            step: 2,
            title: "Drop a pin on the map",
            desc: "Tap on the map where the IEBC office is, or use \"Use my location\" if you're nearby.",
          },
          {
            step: 3,
            title: "Choose your identity",
            desc: "Use your real name, a nickname, or stay anonymous with a fun auto-generated name.",
          },
          {
            step: 4,
            title: "Submit and wait for verification",
            desc: "Once 7 independent contributors pin the same spot (within 100m), it becomes verified.",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-3">
            <div className="flex-shrink-0 w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">
              {item.step}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h3 className="font-semibold text-yellow-800 text-xs mb-1">Guidelines</h3>
        <ul className="text-xs text-yellow-700 space-y-0.5 list-disc list-inside">
          <li>Only pin locations you have physically visited.</li>
          <li>One contribution per device per constituency.</li>
          <li>Maximum 3 contributions per day.</li>
          <li>Flag wrong verified locations using the flag button.</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl active:bg-green-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          Start Contributing
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>

      {/* ── Divider ── */}
      <hr className="my-8 border-gray-200" />

      {/* ── Section 2: Support the Project ── */}
      <section aria-label="Support the project">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Support the Project</h2>
        <p className="text-sm text-gray-600 mb-6">
          This project runs on volunteer effort and community goodwill. Here&apos;s how you can help
          beyond dropping pins.
        </p>

        {/* Spread the Word */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Spread the Word
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Share this project with friends, family, and community groups. The more people contribute
            GPS pins, the faster we verify all 290 stations.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">WhatsApp groups</span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">Twitter/X</span>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">Facebook</span>
            <span className="px-2.5 py-1 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium">TikTok</span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">Telegram</span>
          </div>
        </div>

        {/* Volunteer */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Volunteer
          </h3>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#x2022;</span>
              <span><strong>County Ambassadors</strong> &mdash; Help verify stations in your area by visiting IEBC offices and confirming GPS pins.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#x2022;</span>
              <span><strong>Translation</strong> &mdash; Help translate the app into Swahili and other Kenyan languages.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#x2022;</span>
              <span><strong>Development</strong> &mdash; This is an open-source project. Developers, designers, and testers are welcome.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#x2022;</span>
              <span><strong>Data Verification</strong> &mdash; Cross-reference crowdsourced pins with IEBC published station lists.</span>
            </li>
          </ul>
        </div>

        {/* Financial Support */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Financial Support
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Running this project costs money for domain registration, hosting, and outreach.
            Any contribution helps keep it alive and ad-free.
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-xs font-semibold text-green-800 mb-0.5">M-Pesa (Kenya)</p>
              <p className="text-xs text-green-700">
                Send to Paybill/Till &mdash; <em>Coming soon. We&apos;re registering a Paybill number.</em>
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-xs font-semibold text-gray-800 mb-0.5">International</p>
              <p className="text-xs text-gray-600">
                PayPal or Open Collective &mdash; <em>Coming soon.</em>
              </p>
            </div>
          </div>
        </div>

        {/* What We Need Funding For */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            What We Need Funding For
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "Domain (.or.ke)", cost: "~KES 1,200/yr", desc: "Kenyan domain registration via KENIC" },
              { label: "Hosting", cost: "Free tier", desc: "Cloudflare Pages or Vercel" },
              { label: "SMS Verification", cost: "~KES 2/SMS", desc: "Africa's Talking for future OTP verification" },
              { label: "Outreach", cost: "Variable", desc: "Posters, community events, social media" },
            ].map((item) => (
              <div key={item.label} className="p-2.5 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-gray-900">{item.label}</span>
                  <span className="text-xs text-green-700 font-medium">{item.cost}</span>
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partnerships */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Partnerships We&apos;re Seeking
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            If you&apos;re part of any of these organizations and want to collaborate, reach out.
          </p>
          <div className="space-y-1.5">
            {[
              { org: "IEBC", why: "Official data sharing or endorsement" },
              { org: "Ushahidi", why: "Mentorship and shared civic tech infrastructure" },
              { org: "Code for Africa", why: "Grants and pan-African civic tech network" },
              { org: "Uraia Trust", why: "Civic education and voter outreach" },
              { org: "County civic groups & youth orgs", why: "Grassroots data collection and awareness" },
            ].map((p) => (
              <div key={p.org} className="flex items-start gap-2 text-xs">
                <span className="text-green-600 mt-0.5 font-bold">&rarr;</span>
                <span>
                  <strong className="text-gray-900">{p.org}</strong>
                  <span className="text-gray-500"> &mdash; {p.why}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <hr className="my-8 border-gray-200" />

      {/* ── Section 3: Name & Branding ── */}
      <section aria-label="Help us choose a name">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Help Us Choose a Name</h2>
        <p className="text-sm text-gray-600 mb-4">
          We&apos;re considering rebranding from &ldquo;findmystation&rdquo; to a name that
          resonates with Kenyans in both English and Swahili. We&apos;d love your input.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {[
            { name: "PataKituo", meaning: "\"Find a station\" — clear, actionable Swahili" },
            { name: "KuraHub", meaning: "\"Vote hub\" — modern, blends Swahili + English" },
            { name: "KituoChangu", meaning: "\"My Station\" — direct Swahili translation" },
            { name: "TafutaKura", meaning: "\"Search for your vote\" — descriptive" },
            { name: "PigaKura", meaning: "\"Cast your vote\" — widely known phrase" },
            { name: "KuraYangu", meaning: "\"My vote\" — personal, empowering" },
          ].map((n) => (
            <div key={n.name} className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-bold text-gray-900">{n.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.meaning}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          Have a better idea? We&apos;re all ears. Share your suggestions with the community.
        </p>
      </section>
    </PageShell>
  );
}
