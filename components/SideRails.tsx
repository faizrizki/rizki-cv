import { Github, Linkedin, Mail } from 'lucide-react';

/** Ikon sosial di kiri dan alamat email vertikal di kanan (desktop saja). */
export default function SideRails({
  email,
  linkedinUrl,
  githubUrl,
}: {
  email: string;
  linkedinUrl: string;
  githubUrl: string;
}) {
  return (
    <>
      <div className="side-rail side-rail-left">
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
        )}
      </div>

      <div className="side-rail side-rail-right">
        {email && <a href={`mailto:${email}`}>{email}</a>}
      </div>
    </>
  );
}
