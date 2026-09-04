import type { Metadata } from 'next';
import About from '@/components/About';
import BackToTop from '@/components/BackToTop';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Journey from '@/components/Journey';
import Nav from '@/components/Nav';
import Projects from '@/components/Projects';
import SideRails from '@/components/SideRails';
import Skills from '@/components/Skills';
import { getSiteData } from '@/lib/data';

/** Halaman di-regenerate tiap 60 detik; perubahan dari CMS langsung
 *  memicu revalidate lewat revalidatePath, jadi tetap terasa instan. */
export const revalidate = 60;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'MR.';
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return `${letters.toUpperCase()}.`;
}

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const title = `${profile.name} — ${profile.role}`;
  const description = profile.tagline || profile.bio.slice(0, 160);

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function HomePage() {
  const { profile, skills, experiences, educations, projects, connected } = await getSiteData();

  return (
    <>
      <Nav initials={initialsOf(profile.name)} />
      <SideRails
        email={profile.email}
        linkedinUrl={profile.linkedin_url}
        githubUrl={profile.github_url}
      />

      <main className="gradient-bg">
        {!connected && (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-amber-500/30 bg-amber-950/95 px-5 py-3 text-center text-sm text-amber-200">
            Supabase belum terhubung. Jalankan <code className="font-mono">supabase/schema.sql</code> dan
            isi <code className="font-mono">.env.local</code>.
          </div>
        )}

        <Hero profile={profile} />
        <div className="section-divider" />
        <About profile={profile} educations={educations} projectCount={projects.length} />
        <div className="section-divider" />
        <Skills groups={skills} />
        <div className="section-divider" />
        <Journey experiences={experiences} educations={educations} />
        <div className="section-divider" />
        <Projects projects={projects} />
        <div className="section-divider" />
        <Contact profile={profile} />
        <Footer profile={profile} />
      </main>

      <BackToTop />
    </>
  );
}
