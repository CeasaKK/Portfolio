import { getProfile, getResumes } from "@/lib/content";
import ScrollRig from "@/components/ScrollRig";
import TopBar from "@/components/TopBar";

// The site chrome: smooth-scroll rig, top bar (with CMS-managed résumés),
// grain overlay, and Person structured data. Keystatic routes skip all of this.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, resumes] = await Promise.all([getProfile(), getResumes()]);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    description: profile.tagline,
    sameAs: profile.socials
      .filter((s) => s.url.startsWith("http"))
      .map((s) => s.url),
  };

  return (
    <>
      <noscript>
        <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollRig />
      <TopBar resumes={resumes} />
      {children}
    </>
  );
}
