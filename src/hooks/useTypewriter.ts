import { useEffect, useRef, useState } from 'react';

const roles = [
  'Headless Full-Stack Developer',
  'WordPress Plugin Architect',
  'AI Agent & MCP Engineer',
  'WooCommerce Specialist',
];

export function useTypewriter() {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;
    const pauseAtEnd = 1800;
    const pauseAtStart = 400;

    timeoutRef.current = setTimeout(
      () => {
        if (!isDeleting && text === current) {
          setTimeout(() => setIsDeleting(true), pauseAtEnd);
          return;
        }
        if (isDeleting && text === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          return;
        }
        setText((prev) =>
          isDeleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      },
      isDeleting && text === '' ? pauseAtStart : speed
    );

    return () => clearTimeout(timeoutRef.current);
  }, [text, isDeleting, roleIndex]);

  return text;
}
