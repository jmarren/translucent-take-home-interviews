import React from 'react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      <p className="coming-soon">{description}</p>
    </section>
  );
}
