import {
  Code,
  Database,
  Globe,
  ShieldCheck,
  Sprout,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import type { SkillGroup } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  code: Code,
  globe: Globe,
  database: Database,
  'shield-check': ShieldCheck,
  wrench: Wrench,
  sprout: Sprout,
};

export default function Skills({ groups }: { groups: SkillGroup[] }) {
  if (!groups.length) return null;

  return (
    <section id="skills" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What I Use" title="Technical" accent="Arsenal" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => {
            const Icon = ICONS[group.icon] ?? Code;
            return (
              <Reveal key={group.id} direction="scale" delay={i * 60} className="glass-card rounded-2xl p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="font-bold">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-indigo-500/10 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
