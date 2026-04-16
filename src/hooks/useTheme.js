import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hisob_vibe_theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hisob_vibe_theme', theme);
  }, [theme]);

  const toggleTheme = (event) => {
    const isToDark = theme === 'light';
    const duration = 600; // Rule 3: Synced with CSS transition (0.6s)

    // 1. Performance Class Start
    document.documentElement.classList.add('is-transitioning');

    // 2. Create Background Overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.backgroundColor = isToDark ? '#020617' : '#F8F9FF';
    document.body.appendChild(overlay);

    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Rule 3: Overlay Animation Logic
    const animation = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    // Rule 2 & 3: Sync theme change to trigger CSS transitions
    setTheme(prev => prev === 'light' ? 'dark' : 'light');

    animation.onfinish = () => {
      overlay.remove();
      document.documentElement.classList.remove('is-transitioning');
    };
  };

  return { theme, toggleTheme };
}
