import { animate, svg } from 'animejs';
import { useEffect, useRef } from 'react';

export function useLucideDrawerAnimation() {
  const root = useRef(null);

  useEffect(() => {
    if (!root.current) return;
    const elements = root.current.querySelectorAll('svg path, svg circle, svg polyline, svg line, svg rect, svg ellipse');
    if (!elements.length) return;

    elements.forEach(el => el.classList.add('lucide-anim-line'));
    const anim = animate(svg.createDrawable('.lucide-anim-line'), {
      draw: ['0 0.05', '0.05 1'],
      ease: 'inOutQuad',
      duration: 1000,
      loop: true,
      alternate: true,
    });

    return () => {
      anim.pause();
      elements.forEach(el => el.classList.remove('lucide-anim-line'));
    };
  }, []);

  return root;
}

/* Per-element hook — plays the draw animation once on hover */
export function useDrawOnHover(hovered) {
  const ref = useRef(null);
  const drawablesRef = useRef(null);

  // Prepare drawables once on mount
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('svg path, svg circle, svg polyline, svg line, svg rect, svg ellipse');
    if (els.length) drawablesRef.current = svg.createDrawable(els);
  }, []);

  // Play once each time hover starts
  useEffect(() => {
    if (!hovered || !drawablesRef.current) return;
    const anim = animate(drawablesRef.current, {
      draw: ['0 0', '0 1'],
      ease: 'inOutQuad',
      duration: 600,
      loop: false,
    });
    return () => anim.pause();
  }, [hovered]);

  return ref;
}
