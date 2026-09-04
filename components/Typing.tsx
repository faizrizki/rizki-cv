'use client';

import { useEffect, useState } from 'react';

/** Efek mengetik bergantian untuk beberapa kata. */
export default function Typing({ words }: { words: string[] }) {
  const list = words.length ? words : ['Software Engineer'];
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = list[wordIndex % list.length];

    if (!deleting && text === word) {
      const hold = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(hold);
    }

    if (deleting && text === '') {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % list.length);
      return;
    }

    const tick = setTimeout(
      () => {
        setText((current) =>
          deleting ? word.slice(0, current.length - 1) : word.slice(0, current.length + 1)
        );
      },
      deleting ? 45 : 90
    );
    return () => clearTimeout(tick);
  }, [text, deleting, wordIndex, list]);

  return (
    <>
      <span>{text}</span>
      <span className="typing-cursor" aria-hidden="true" />
    </>
  );
}
