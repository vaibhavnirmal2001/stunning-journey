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

  const handleMove = (event) => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = node.getBoundingClientRect();
    const px = ((event.clientX - bounds.left) / bounds.width) * 100;
    const py = ((event.clientY - bounds.top) / bounds.height) * 100;
    const rotateX = ((py - 50) / 50) * -5;
    const rotateY = ((px - 50) / 50) * 6;

    node.style.setProperty("--card-x", `${px}%`);
    node.style.setProperty("--card-y", `${py}%`);
    node.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "";
    }
  };

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

  const handleMove = (event) => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = node.getBoundingClientRect();
    const dx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const dy = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14;
    node.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "";
    }
  };

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
    let particles = [];
    const pointer = { x: 0, y: 0, active: false };

    const createParticles = () => {
      const total = width < 800 ? 42 : 78;
      particles = Array.from({ length: total }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1 + Math.random() * 2.4,
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

    const draw = () => {
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

          if (distance < 180) {
            particle.x -= dx * -0.0009;
            particle.y -= dy * -0.0009;
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

          if (distance < 130) {
            context.strokeStyle = `rgba(97, 255, 232, ${(1 - distance / 130) * 0.16})`;
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

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reducedMotion]);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

export default function App() {
  const [focusIndex, setFocusIndex] = useState(0);
  const [signalIndex, setSignalIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(portfolioData.nav[0].id);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const updateSignals = window.setInterval(() => {
      setFocusIndex((value) => (value + 1) % portfolioData.hero.focusWords.length);
      setSignalIndex((value) => (value + 1) % portfolioData.hero.runtimeSignals.length);
    }, 2200);

    return () => window.clearInterval(updateSignals);
  }, [reducedMotion]);

  useEffect(() => {
    const root = document.documentElement;

    const handlePointer = (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointer);

    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useEffect(() => {
    const sync = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      let nextActive = portfolioData.nav[0].id;

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

      startTransition(() => {
        setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
        setActiveSection((current) => (current === nextActive ? current : nextActive));
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div className="app-shell">
      <ParticleField />
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="cursor-glow" />
      <div className="noise-overlay" />
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">JS</span>
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

        <div className="header-chip">{portfolioData.identity.availability}</div>
      </header>

      <main id="top">
        <Reveal as="section" className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse-dot" />
              {portfolioData.hero.eyebrow}
            </div>
            <p className="hero-tag">{portfolioData.identity.tagline}</p>
            <h1>
              Crafting <span>{portfolioData.hero.focusWords[focusIndex]}</span> for modern Java
              products.
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
            <div aria-hidden="true" className="orbit-shell">
              <div className="ring ring-one" />
              <div className="ring ring-two" />
              <div className="ring ring-three" />
              {portfolioData.hero.badges.map((badge, index) => (
                <span className={`orbit-chip chip-${index + 1}`} key={badge}>
                  {badge}
                </span>
              ))}
            </div>

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
                  <strong>Java + Spring + React + Cloud</strong>
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
                  <span>Location</span>
                  <strong>{portfolioData.identity.location}</strong>
                </div>
                <div className="status-cell">
                  <span>Specialty</span>
                  <strong>Backend depth + premium frontend craft</strong>
                </div>
                <div className="status-cell status-wide">
                  <span>Current mode</span>
                  <strong>Dummy content, real production-ready design language</strong>
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
            <p>Signature Projects</p>
            <h2>Dummy work, presented like premium case studies.</h2>
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
            <p>Systems Thinking</p>
            <h2>Built for architecture clarity, operator calm, and shipping confidence.</h2>
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
                  <strong>React experience layer</strong>
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

        <Reveal className="section-shell" delay={160} id="journey">
          <div className="section-head">
            <p>Journey</p>
            <h2>A timeline designed to become your real story later.</h2>
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

        <Reveal className="section-shell closing-shell" delay={200} id="contact">
          <MotionCard className="closing-panel">
            <p className="closing-tag">Dummy Data Mode</p>
            <h2>{portfolioData.contact.title}</h2>
            <p>{portfolioData.contact.body}</p>
            <div className="contact-links">
              <a href={`mailto:${portfolioData.contact.email}`}>{portfolioData.contact.email}</a>
              <a href={`https://${portfolioData.contact.github}`}>{portfolioData.contact.github}</a>
              <a href={`https://${portfolioData.contact.linkedin}`}>{portfolioData.contact.linkedin}</a>
            </div>
          </MotionCard>
        </Reveal>
      </main>

      <footer className="site-footer">
        <p>React-powered portfolio surface with dummy data placeholders.</p>
        <p>{new Date().getFullYear()} · ready for your resume details</p>
      </footer>
    </div>
  );
}
