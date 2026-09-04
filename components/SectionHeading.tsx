import Reveal from './Reveal';

export default function SectionHeading({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  accent: string;
}) {
  return (
    <Reveal className="mb-16 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">{eyebrow}</p>
      <h2 className="text-4xl font-black md:text-5xl">
        {title} <span className="text-gradient">{accent}</span>
      </h2>
    </Reveal>
  );
}
