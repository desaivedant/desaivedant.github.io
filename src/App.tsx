import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CursorDot from '@/components/layout/CursorDot';
import { LoadingScreenWrapper } from '@/components/layout/LoadingScreen';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import { profile } from '@/data/profile';

const BackgroundScene = lazy(() => import('@/components/three/BackgroundScene'));
const Skills = lazy(() => import('@/components/sections/Skills'));
const Projects = lazy(() => import('@/components/sections/Projects'));
const Roadmap = lazy(() => import('@/components/sections/Roadmap'));
const Contact = lazy(() => import('@/components/sections/Contact'));

const SectionFallback = () => (
  <div className="section container-px text-center text-text-secondary">Loading…</div>
);

export default function App() {
  return (
    <LoadingScreenWrapper>
    <div className="has-custom-cursor relative min-h-screen bg-bg-primary text-text-primary">
      <Suspense fallback={null}>
        <BackgroundScene />
      </Suspense>
      <Helmet>
        <title>{`${profile.name} — ${profile.title} · ${profile.targetTitle} in the making`}</title>
        <meta name="description" content={profile.summary.slice(0, 160)} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile.name,
            jobTitle: profile.title,
            email: `mailto:${profile.email}`,
            url: 'https://vedantdesai.me/portfolio/',
            sameAs: [
              'https://github.com/desaivedant',
              'https://www.linkedin.com/in/vedantdesai9/',
              'https://x.com/vedantdesai_9',
            ],
            knowsAbout: [
              'Microsoft Fabric',
              'Apache Spark',
              'Delta Lake',
              'Azure Data Factory',
              'Databricks',
              'PySpark',
              'LLMs',
              'RAG',
            ],
          })}
        </script>
      </Helmet>

      <CursorDot />
      <Nav />

      <main>
        <Hero />
        <About />
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        <Experience />
        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Roadmap />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </div>
    </LoadingScreenWrapper>
  );
}
