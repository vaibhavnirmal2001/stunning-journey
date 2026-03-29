import { startTransition, useEffect, useRef, useState } from "react";
import { portfolioData } from "./data.js";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);

    sync();

    if (media.addEventListener) {
      media.addEventListener("change", sync);
    } else {
      media.addListener(sync);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", sync);
      } else {
        media.removeListener(sync);
      }
    };
  }, []);

  return reduced;
}

function Reveal({ as: Tag = "section", id, className = "", delay = 0, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal${visible ? " is-visible" : ""} ${className}`.trim()}
      style={{ "--delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function MotionCard({ as: Tag = "article", className = "", children }) {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ px: 50, py: 50 });

  const handleMove = (event) => {
    const node = ref.current;
    if (
      !node ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    const bounds = node.getBoundingClientRect();
    pointerRef.current = {
      px: ((event.clientX - bounds.left) / bounds.width) * 100,
      py: ((event.clientY - bounds.top) / bounds.height) * 100,
    };

    if (frameRef.current) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      const { px, py } = pointerRef.current;
      const rotateX = ((py - 50) / 50) * -3.8;
      const rotateY = ((px - 50) / 50) * 4.5;

      node.style.setProperty("--card-x", `${px}%`);
      node.style.setProperty("--card-y", `${py}%`);
      node.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
  };

  const handleLeave = () => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    if (ref.current) {
      ref.current.style.transform = "";
    }
  };

  useEffect(
    () => () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  return (
    <Tag
      ref={ref}
      className={`motion-card ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </Tag>
  );
}

function MagneticLink({ href, className = "", children }) {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const offsetRef = useRef({ dx: 0, dy: 0 });

  const handleMove = (event) => {
    const node = ref.current;
    if (
      !node ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    const bounds = node.getBoundingClientRect();
    offsetRef.current = {
      dx: ((event.clientX - bounds.left) / bounds.width - 0.5) * 12,
      dy: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
    };

    if (frameRef.current) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      const { dx, dy } = offsetRef.current;
      node.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  };

  const handleLeave = () => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    if (ref.current) {
      ref.current.style.transform = "";
    }
  };

  useEffect(
    () => () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  return (
    <a
      ref={ref}
      className={`magnetic-link ${className}`.trim()}
      href={href}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <span>{children}</span>
      <i />
    </a>
  );
}

function IconSymbol({ name }) {
  const icons = {
    linkedin: (
      <path d="M6.5 8.8h3.1V18H6.5V8.8Zm1.55-4.3a1.82 1.82 0 1 1 0 3.64 1.82 1.82 0 0 1 0-3.64ZM11.4 8.8h2.97v1.25h.04c.41-.78 1.43-1.61 2.94-1.61 3.15 0 3.73 2.07 3.73 4.76V18h-3.09v-4.28c0-1.02-.02-2.34-1.43-2.34-1.43 0-1.65 1.12-1.65 2.27V18H11.4V8.8Z" />
    ),
    github: (
      <path d="M12 3.8a8.2 8.2 0 0 0-2.59 15.98c.4.08.55-.17.55-.39 0-.19-.01-.83-.01-1.51-2.01.37-2.54-.49-2.7-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.53-.01-.54.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.52 7.52 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .22.15.48.55.39A8.2 8.2 0 0 0 12 3.8Z" />
    ),
    medium: (
      <path d="M5 7.5c.03-.03.07-.05.12-.05h3.72l2.88 6.3 2.53-6.3H18c.06 0 .12.03.15.08l1.37 1.31a.2.2 0 0 1 .06.15v8.02a.2.2 0 0 1-.06.15l-1.34 1.31a.21.21 0 0 1-.15.07h-6.78a.22.22 0 0 1-.18-.1l-2.96-6.48v5.41l1.03 1.25v.18H5.75v-.18l1.18-1.43V9.29L5.73 7.8a.2.2 0 0 1-.06-.14v-.16H5Z" />
    ),
    leetcode: (
      <path d="M13.9 5.2 8.3 10.8a1.8 1.8 0 0 0 0 2.54l5.6 5.6M10.1 7.8H18m-7.95 8.4H18M6.9 12.07h5.7" />
    ),
    stackoverflow: (
      <path d="m16.7 19.2-9.44-.02v-3.05h9.44v3.07ZM8.72 15.53h6.13v-2.55H8.72v2.55Zm.3-3.7 5.5 1.15.52-2.42-5.5-1.15-.52 2.42Zm1.1-3.8 5.08 2.36 1.04-2.22-5.08-2.36-1.04 2.22Zm2.05-3.53 4.3 3.38 1.53-1.92-4.3-3.38-1.53 1.92ZM7.28 21.5h10.98V14.7h2.2v8.98H7.28V21.5Z" />
    ),
    gfg: (
      <path d="M6.8 9.7c.9-2.5 3.22-4.2 5.9-4.2 2.18 0 4.02.9 5.2 2.52l-1.93 1.43c-.73-.96-1.82-1.53-3.17-1.53-2.14 0-3.8 1.47-4.18 3.53h4.34v2.3H8.64c.35 2.11 2.02 3.63 4.2 3.63 1.33 0 2.46-.6 3.2-1.62l1.9 1.48c-1.18 1.6-3.04 2.58-5.2 2.58-2.7 0-5.03-1.75-5.92-4.28H5V11.9h1.4c.03-.78.16-1.5.4-2.2Z" />
    ),
    email: (
      <path d="M4.5 6.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm0 1.9v.07l7.5 4.96 7.5-4.96V8.4l-7.5 4.95L4.5 8.4Z" />
    ),
    phone: (
      <path d="M8.38 4.8c.4-.4 1-.53 1.53-.3l2.02.86c.55.23.9.79.85 1.39l-.12 1.63c-.02.33.08.66.3.91l1.45 1.45c.25.24.57.35.91.3l1.62-.12c.61-.05 1.17.29 1.4.84l.85 2.03c.22.52.1 1.12-.3 1.52l-1.1 1.1c-.75.74-1.84 1.03-2.86.76-2.1-.55-4.08-1.75-5.84-3.51-1.76-1.76-2.96-3.75-3.51-5.84-.27-1.02.02-2.12.76-2.86l1.04-1.06Z" />
    ),
  };

  return (
    <svg aria-hidden="true" className="icon-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function ActionButton({ href, label, icon, className = "" }) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className={`action-button ${className}`.trim()}
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      <span className="action-button-icon">
        <IconSymbol name={icon} />
      </span>
      <span>{label}</span>
    </a>
  );
}

function useTypewriter(phrases, reducedMotion) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length) {
      return undefined;
    }

    if (reducedMotion) {
      setDisplayText(phrases[phraseIndex]);
      return undefined;
    }

    const currentPhrase = phrases[phraseIndex];
    const finishedTyping = !isDeleting && displayText === currentPhrase;
    const finishedDeleting = isDeleting && displayText === "";

    const timeout = window.setTimeout(
      () => {
        if (finishedTyping) {
          setIsDeleting(true);
          return;
        }

        if (finishedDeleting) {
          setIsDeleting(false);
          setPhraseIndex((value) => (value + 1) % phrases.length);
          return;
        }

        setDisplayText((value) =>
          isDeleting ? currentPhrase.slice(0, Math.max(0, value.length - 1)) : currentPhrase.slice(0, value.length + 1)
        );
      },
      finishedTyping ? 1700 : finishedDeleting ? 240 : isDeleting ? 30 : 54
    );

    return () => window.clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases, reducedMotion]);

  return displayText;
}

function TypewriterHeadline({ phrases, reducedMotion }) {
  const typedText = useTypewriter(phrases, reducedMotion);
  const longestPhrase = phrases.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    phrases[0] ?? ""
  );

  return (
    <span aria-live="polite" className="typewriter-shell">
      <span aria-hidden="true" className="typewriter-sizer">
        {longestPhrase}
      </span>
      <span className="typewriter-live">
        {typedText}
        <span aria-hidden="true" className="typewriter-caret" />
      </span>
    </span>
  );
}

function AstralCrown() {
  return (
    <div aria-hidden="true" className="astral-crown">
      <div className="astral-veil" />
      <div className="astral-observatory observatory-left">
        <span className="observatory-ring" />
        <span className="observatory-ring observatory-ring-small" />
        <span className="observatory-axis axis-a" />
        <span className="observatory-axis axis-b" />
        <span className="observatory-beacon" />
      </div>
      <div className="astral-observatory observatory-right">
        <span className="observatory-ring" />
        <span className="observatory-ring observatory-ring-small" />
        <span className="observatory-axis axis-a" />
        <span className="observatory-axis axis-b" />
        <span className="observatory-beacon" />
      </div>
      <div className="astral-lens">
        <div className="astral-core" />
        <div className="astral-core-ring ring-a" />
        <div className="astral-core-ring ring-b" />
        <div className="astral-core-ring ring-c" />
        <div className="astral-flare flare-a" />
        <div className="astral-flare flare-b" />
      </div>
      <div className="astral-arc arc-a" />
      <div className="astral-arc arc-b" />
      <div className="astral-arc arc-c" />
      <div className="astral-comet comet-a" />
      <div className="astral-comet comet-b" />
      <div className="astral-starfield">
        <span className="astral-star s1" />
        <span className="astral-star s2" />
        <span className="astral-star s3" />
        <span className="astral-star s4" />
        <span className="astral-star s5" />
        <span className="astral-star s6" />
      </div>
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let particles = [];
    let hidden = document.hidden;
    const pointer = { x: 0, y: 0, active: false };

    const createParticles = () => {
      const baseCount = width < 760 ? 18 : width < 1200 ? 28 : 38;
      const cores = navigator.hardwareConcurrency ?? 8;
      const total = cores <= 4 ? Math.max(14, Math.floor(baseCount * 0.8)) : baseCount;
      particles = Array.from({ length: total }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        radius: 1 + Math.random() * 1.8,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const draw = (time = 0) => {
      if (hidden) {
        frame = window.requestAnimationFrame(draw);
        return;
      }

      if (time - lastTime < 32) {
        frame = window.requestAnimationFrame(draw);
        return;
      }

      lastTime = time;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }

        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 140) {
            particle.x -= dx * -0.00065;
            particle.y -= dy * -0.00065;
          }
        }

        context.beginPath();
        context.fillStyle = index % 3 === 0 ? "rgba(255, 130, 72, 0.95)" : "rgba(81, 243, 220, 0.88)";
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < 104) {
            context.strokeStyle = `rgba(97, 255, 232, ${(1 - distance / 104) * 0.11})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      hidden = document.hidden;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reducedMotion]);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

export default function App() {
  const [signalIndex, setSignalIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(portfolioData.nav[0].id);
  const reducedMotion = useReducedMotion();
  const progressRef = useRef(null);
  const heroPhrases = portfolioData.hero.focusWords.map((word) => `Crafting ${word} for modern Java products.`);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const updateSignals = window.setInterval(() => {
      setSignalIndex((value) => (value + 1) % portfolioData.hero.runtimeSignals.length);
    }, 4200);

    return () => window.clearInterval(updateSignals);
  }, [reducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let coords = { x: window.innerWidth / 2, y: window.innerHeight * 0.25 };

    const apply = () => {
      frame = 0;
      root.style.setProperty("--cursor-x", `${coords.x}px`);
      root.style.setProperty("--cursor-y", `${coords.y}px`);
    };

    const handlePointer = (event) => {
      coords = { x: event.clientX, y: event.clientY };
      if (!frame) {
        frame = window.requestAnimationFrame(apply);
      }
    };

    window.addEventListener("pointermove", handlePointer);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("pointermove", handlePointer);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      let nextActive = portfolioData.nav[0].id;
      const progress = total > 0 ? window.scrollY / total : 0;

      portfolioData.nav.forEach((item) => {
        const section = document.getElementById(item.id);
        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) {
          nextActive = item.id;
        }
      });

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      startTransition(() => {
        setActiveSection((current) => (current === nextActive ? current : nextActive));
      });
    };

    const requestSync = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(sync);
      }
    };

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, []);

  return (
    <div className="app-shell">
      <ParticleField />
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="cursor-glow" />
      <div className="noise-overlay" />
      <div className="progress-bar" ref={progressRef} />
      <AstralCrown />

      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <img alt="Vaibhav Nirmal" src={portfolioData.identity.profileImage} />
          </span>
          <span className="brand-copy">
            <strong>{portfolioData.identity.name}</strong>
            <small>{portfolioData.identity.role}</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {portfolioData.nav.map((item) => (
            <a className={activeSection === item.id ? "active" : ""} href={item.href} key={item.id}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-chip">{portfolioData.identity.experience}</div>
      </header>

      <main id="top">
        <Reveal as="section" className="hero section-shell">
          <div className="hero-copy">
            <div className="hero-persona">
              <span className="hero-avatar">
                <img alt="Vaibhav Nirmal" src={portfolioData.identity.profileImage} />
              </span>
              <div className="hero-persona-copy">
                <strong>{portfolioData.identity.name}</strong>
                <span>{portfolioData.identity.role}</span>
              </div>
            </div>

            <div className="eyebrow">
              <span className="pulse-dot" />
              {portfolioData.hero.eyebrow}
            </div>
            <p className="hero-tag">{portfolioData.identity.tagline}</p>
            <h1>
              <TypewriterHeadline phrases={heroPhrases} reducedMotion={reducedMotion} />
            </h1>
            <p className="hero-intro">{portfolioData.hero.intro}</p>
            <p className="hero-summary">{portfolioData.hero.summary}</p>

            <div className="hero-actions">
              <MagneticLink className="button-primary" href={portfolioData.hero.primaryAction.href}>
                {portfolioData.hero.primaryAction.label}
              </MagneticLink>
              <MagneticLink className="button-secondary" href={portfolioData.hero.secondaryAction.href}>
                {portfolioData.hero.secondaryAction.label}
              </MagneticLink>
            </div>

            <div className="hero-metrics">
              {portfolioData.hero.metrics.map((metric) => (
                <MotionCard as="article" className="metric-tile" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </MotionCard>
              ))}
            </div>
          </div>

          <div className="hero-stage">
            <MotionCard as="article" className="astro-panel">
              <div className="astro-top">
                <span className="astro-kicker">Celestial Stack Map</span>
                <span className="astro-phase">North Node: Spring Boot x Angular</span>
              </div>

              <div aria-hidden="true" className="orbit-shell">
                <div className="ring ring-one" />
                <div className="ring ring-two" />
                <div className="ring ring-three" />
                <div className="star star-a" />
                <div className="star star-b" />
                <div className="star star-c" />
                <div className="star star-d" />
                {portfolioData.hero.badges.map((badge, index) => (
                  <span className={`orbit-chip chip-${index + 1}`} key={badge}>
                    {badge}
                  </span>
                ))}
              </div>

              <div className="astro-footer">
                <div className="astro-note">
                  <span>Transit</span>
                  <strong>Backend gravity with frontend harmony</strong>
                </div>
                <div className="astro-note">
                  <span>Constellation</span>
                  <strong>Kafka, Redis, Docker, Kubernetes, GCP</strong>
                </div>
              </div>
            </MotionCard>

            <MotionCard as="article" className="command-panel">
              <div className="panel-top">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="panel-label">live orchestration view</div>
              </div>

              <div className="terminal-block">
                {portfolioData.hero.runtimeSignals.map((line, index) => (
                  <div className={`terminal-line ${index === signalIndex ? "is-current" : ""}`} key={line}>
                    <span className="terminal-prompt">$</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <div className="signal-footer">
                <div>
                  <span>Stack</span>
                  <strong>Spring Boot + Angular + Kafka + Cloud</strong>
                </div>
                <div>
                  <span>Mode</span>
                  <strong>{reducedMotion ? "Reduced motion" : "Interactive motion"}</strong>
                </div>
              </div>
            </MotionCard>

            <MotionCard as="article" className="status-panel">
              <div className="status-grid">
                <div className="status-cell">
                  <span>Current Role</span>
                  <strong>
                    {portfolioData.identity.role} @ {portfolioData.identity.company}
                  </strong>
                </div>
                <div className="status-cell">
                  <span>Location</span>
                  <strong>{portfolioData.identity.location}</strong>
                </div>
                <div className="status-cell status-wide">
                  <span>Certification</span>
                  <strong>Google Cloud Professional Developer | Issued Oct 2024</strong>
                </div>
              </div>
            </MotionCard>
          </div>
        </Reveal>

        <section aria-label="Stack ticker" className="ticker-band">
          <div className="ticker-track">
            {[...portfolioData.ticker, ...portfolioData.ticker].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <Reveal className="section-shell" delay={80} id="projects">
          <div className="section-head">
            <p>Selected Work</p>
            <h2>Real systems built across HRMS, auctions, and enterprise workflow platforms.</h2>
          </div>
          <div className="project-grid">
            {portfolioData.showcase.map((project) => (
              <MotionCard className={`project-card accent-${project.accent}`} key={project.name}>
                <div className="project-top">
                  <span>{project.category}</span>
                  <small>{project.stack}</small>
                </div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <ul>
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </MotionCard>
            ))}
          </div>
        </Reveal>

        <Reveal className="section-shell systems-shell" delay={120} id="systems">
          <div className="section-head">
            <p>Core Strengths</p>
            <h2>Backend architecture, cloud delivery, and full stack execution grounded in production work.</h2>
          </div>

          <div className="systems-grid">
            <MotionCard className="blueprint-panel">
              <div className="blueprint-header">
                <span>Experience Blueprint</span>
                <strong>Frontend to infrastructure, treated as one product system</strong>
              </div>
              <div className="blueprint-stack">
                <div>
                  <span>01</span>
                  <strong>Angular-first experience layer</strong>
                </div>
                <div>
                  <span>02</span>
                  <strong>API gateway and auth controls</strong>
                </div>
                <div>
                  <span>03</span>
                  <strong>Spring domain services and workflows</strong>
                </div>
                <div>
                  <span>04</span>
                  <strong>Messaging, cache, and background jobs</strong>
                </div>
                <div>
                  <span>05</span>
                  <strong>Data stores, telemetry, and release feedback</strong>
                </div>
              </div>
            </MotionCard>

            <div className="pillar-list">
              {portfolioData.systemPillars.map((pillar) => (
                <MotionCard className="pillar-card" key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                  <div className="chip-row">
                    {pillar.bullets.map((bullet) => (
                      <span key={bullet}>{bullet}</span>
                    ))}
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>

          <div className="lane-grid">
            {portfolioData.expertiseLanes.map((lane) => (
              <MotionCard className="lane-card" key={lane.title}>
                <span>{lane.title}</span>
                <strong>{lane.description}</strong>
              </MotionCard>
            ))}
          </div>
        </Reveal>

        <Reveal className="section-shell" delay={160} id="experience">
          <div className="section-head">
            <p>Experience</p>
            <h2>Career growth shaped by shipping production systems and taking ownership early.</h2>
          </div>
          <div className="timeline">
            {portfolioData.journey.map((item) => (
              <MotionCard className="timeline-card" key={`${item.period}-${item.title}`}>
                <div className="timeline-kicker">
                  <span>{item.period}</span>
                  <small>{item.label}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </MotionCard>
            ))}
          </div>
        </Reveal>

        <Reveal className="section-shell" delay={180} id="profiles">
          <div className="section-head">
            <p>Profiles and Writing</p>
            <h2>Public links that show how I build, write, solve, and keep learning.</h2>
          </div>

          <div className="profiles-grid">
            {portfolioData.profiles.map((profile) => (
              <MotionCard className="profile-card" key={profile.label}>
                <div className="project-top">
                  <span>{profile.label}</span>
                  <small>{profile.meta}</small>
                </div>
                <div className="profile-icon-shell">
                  <span className="profile-icon">
                    <IconSymbol name={profile.icon} />
                  </span>
                  <h3>{profile.label}</h3>
                </div>
                <p>{profile.description}</p>
                <ActionButton className="profile-link" href={profile.href} icon={profile.icon} label={profile.action} />
              </MotionCard>
            ))}
          </div>

          <div className="proof-grid">
            {portfolioData.achievements.map((item) => (
              <MotionCard className="proof-card" key={item.title}>
                <span>{item.title}</span>
                <strong>{item.copy}</strong>
              </MotionCard>
            ))}
          </div>
        </Reveal>

        <Reveal className="section-shell closing-shell" delay={200} id="contact">
          <MotionCard className="closing-panel">
            <p className="closing-tag">Contact</p>
            <h2>{portfolioData.contact.title}</h2>
            <p>{portfolioData.contact.body}</p>
            <div className="contact-links">
              {portfolioData.contactActions.map((action) => (
                <ActionButton className="contact-action" href={action.href} icon={action.icon} key={action.label} label={action.label} />
              ))}
            </div>
            <div className="contact-meta">
              <span>{portfolioData.identity.location}</span>
              <span>{portfolioData.identity.experience}</span>
            </div>
          </MotionCard>
        </Reveal>
      </main>

      <footer className="site-footer">
        <p>{portfolioData.identity.name} | {portfolioData.identity.role}</p>
        <p>{new Date().getFullYear()} | Built with React and Vite</p>
      </footer>
    </div>
  );
}
