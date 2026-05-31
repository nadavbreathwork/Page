import { useState, useEffect, useRef, createContext, useContext } from 'react';
import './index.css';
import C from './content.js';
import Icons from './icons.jsx';

// ---- Lightbox Context ----
const LightboxCtx = createContext(null);

// ---- Reveal on scroll ----
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style = {}, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const check = () => {
      if (done || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.9 && r.bottom > 0) {
        done = true;
        setSeen(true);
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    const t = setTimeout(() => { if (!done) { done = true; setSeen(true); } }, 1400);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(t);
    };
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in ' : ''}${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// ---- Zoom hint ----
function ZoomHint({ label = 'להגדלה' }) {
  return <span className="zoom-hint"><Icons.Expand /> {label}</span>;
}

// ---- Lightbox ----
function Lightbox() {
  const [item, setItem] = useContext(LightboxCtx);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setItem(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setItem]);
  useEffect(() => {
    document.body.style.overflow = item ? 'hidden' : '';
  }, [item]);
  if (!item) return null;
  return (
    <div className="lightbox" onClick={() => setItem(null)}>
      <button className="lightbox-close" aria-label="סגירה" onClick={() => setItem(null)}>
        <Icons.Close />
      </button>
      <img src={item.src} alt={item.alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

// ---- Nav ----
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const waLink = `https://wa.me/${C.phoneIntl}?text=${encodeURIComponent('היי נדב! ראיתי את האתר ואשמח לקבל פרטים על סדנת הנשימה הקרובה 🌿')}`;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="nav-brand">
          <img src="/logo.jpeg" alt="Breathwork" />
          <span>Breathwork</span>
        </a>
        <nav className="nav-links">
          {C.nav.map((n) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}</a>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">
            <Icons.Whatsapp /> דברו איתי
          </a>
          <button className="nav-toggle" aria-label="תפריט" onClick={() => setOpen((o) => !o)}>
            {open ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
      </div>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {C.nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>{n.label}</a>
        ))}
        <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={{ color: 'var(--teal-700)' }}>
          דברו איתי בוואטסאפ
        </a>
      </div>
    </header>
  );
}

// ---- Hero ----
function Hero() {
  const waLink = `https://wa.me/${C.phoneIntl}?text=${encodeURIComponent('היי נדב! ראיתי את האתר ואשמח לקבל פרטים על סדנת הנשימה הקרובה 🌿')}`;
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="hero-mark"><img src="/logo.jpeg" alt="Breathwork" /></div>
          <h1>מרחב <span className="accent">לנשום</span></h1>
          <p className="hero-sub">{C.hero.sub}</p>
          <div className="hero-tags">
            {C.hero.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">
              <Icons.Whatsapp /> לפרטים על הסדנה
            </a>
            <a className="btn btn-ghost" href="#about">
              <Icons.Arrow /> מה זו סדנת נשימה
            </a>
          </div>
        </div>
        <Reveal className="hero-media" delay={120}>
          <div className="hero-photo">
            <img src="/space.jpeg" alt="המרחב לסדנת הנשימה" />
          </div>
          <div className="hero-badge">
            <span className="dot"><Icons.Music /></span>
            <div>
              <b>נשימה · מוזיקה · דמיון</b>
              <span>קבוצה קטנה ואינטימית</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---- About ----
function About() {
  const [, setLightbox] = useContext(LightboxCtx);
  const zoom = (src, alt) => setLightbox({ src, alt });
  return (
    <section className="band" id="about">
      <div className="wrap about-grid">
        <Reveal className="about-copy">
          <span className="eyebrow">{C.about.eyebrow}</span>
          <h2 className="section-title">{C.about.title}</h2>
          <p>{C.about.body}</p>
        </Reveal>
        <Reveal className="about-media" delay={120}>
          <div className="ph tall zoomable" onClick={() => zoom('/group-session.jpeg', 'קבוצה בסדנת נשימה')}>
            <img src="/group-session.jpeg" alt="קבוצה בסדנת נשימה" />
            <ZoomHint />
          </div>
          <div className="ph wide zoomable" onClick={() => zoom('/nadav-boat.jpeg', 'נדב')}>
            <img src="/nadav-boat.jpeg" alt="נדב" />
            <ZoomHint />
          </div>
          <div className="ph wide zoomable" onClick={() => zoom('/banner.jpeg', 'Breathwork session')}>
            <img src="/banner.jpeg" alt="Breathwork session" style={{ objectPosition: 'top' }} />
            <ZoomHint label="הפלייר המלא" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---- Experience ----
function Experience() {
  return (
    <section className="band band-soft" id="experience">
      <div className="wrap">
        <Reveal className="exp-head">
          <span className="eyebrow">{C.experience.eyebrow}</span>
          <h2 className="section-title">{C.experience.title}</h2>
          <p className="lead" style={{ marginTop: 14 }}>{C.experience.sub}</p>
        </Reveal>
        <div className="exp-grid">
          {C.experience.cards.map((card, i) => {
            const Ico = Icons[card.icon];
            return (
              <Reveal className="exp-card" key={card.title} delay={i * 90}>
                <div className="exp-icon"><Ico /></div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---- Space ----
function Space() {
  const [, setLightbox] = useContext(LightboxCtx);
  const zoom = (src, alt) => setLightbox({ src, alt });
  return (
    <section className="band" id="space">
      <div className="wrap">
        <Reveal className="exp-head" style={{ marginBottom: 'clamp(32px,5vw,52px)' }}>
          <span className="eyebrow">{C.space.eyebrow}</span>
          <h2 className="section-title">{C.space.title}</h2>
          <p className="lead" style={{ marginTop: 14 }}>{C.space.sub}</p>
        </Reveal>
        <Reveal className="space-grid">
          <div className="cell big zoomable" onClick={() => zoom('/space.jpeg', 'המרחב')}>
            <img src="/space.jpeg" alt="המרחב" /><ZoomHint />
          </div>
          <div className="cell zoomable" onClick={() => zoom('/group-session.jpeg', 'סדנה קבוצתית')}>
            <img src="/group-session.jpeg" alt="סדנה קבוצתית" /><ZoomHint />
          </div>
          <div className="cell zoomable" onClick={() => zoom('/nadav-portrait.jpeg', 'נדב שי')}>
            <img src="/nadav-portrait.jpeg" alt="נדב שי" /><ZoomHint />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---- Session ----
function Session() {
  return (
    <section className="band band-cream" id="session">
      <div className="wrap session-grid">
        <Reveal>
          <div className="session-portrait"><img src="/nadav-portrait.jpeg" alt="נדב שי" /></div>
          <div className="session-name">
            <b>{C.session.name}</b>
            <span>{C.session.role}</span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <span className="eyebrow">{C.session.eyebrow}</span>
          <h2 className="section-title" style={{ marginBottom: 24 }}>{C.session.title}</h2>
          <div className="session-card">
            <p className="note">{C.session.note}</p>
            <div className="session-meta">
              {C.session.meta.map((m) => {
                const Ico = Icons[m.icon];
                return (
                  <span className="meta-chip" key={m.text}><Ico /> {m.text}</span>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---- Video Card ----
function VideoCard({ src, poster, delay = 0 }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const v = ref.current;
    if (!v) return;
    document.querySelectorAll('.vid-card video').forEach((o) => { if (o !== v) o.pause(); });
    setPlaying(true);
    v.play();
  };
  return (
    <Reveal className="vid-card" delay={delay}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        controls={playing}
        preload="none"
        onPause={() => { if (ref.current && ref.current.ended) setPlaying(false); }}
      />
      {!playing && (
        <button className="vid-play" aria-label="הפעלת וידאו" onClick={play}>
          <span className="vid-play-dot"><Icons.Play /></span>
          <span className="vid-play-label">צפו בהמלצה</span>
        </button>
      )}
    </Reveal>
  );
}

// ---- Testimonials ----
function Testimonials() {
  const [, setLightbox] = useContext(LightboxCtx);
  const zoom = (src, alt) => setLightbox({ src, alt });
  const T = C.testimonials;
  return (
    <section className="band band-soft" id="recommend">
      <div className="wrap">
        <Reveal className="exp-head" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(36px,5vw,56px)' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>{T.eyebrow}</span>
          <h2 className="section-title">{T.title}</h2>
          <p className="lead" style={{ marginTop: 14 }}>{T.sub}</p>
        </Reveal>

        <h3 className="rec-subhead">{T.videosTitle}</h3>
        <div className="vid-grid">
          {T.videos.map((v, i) => (
            <VideoCard key={v.src} src={v.src} poster={v.poster} delay={i * 80} />
          ))}
        </div>

        <h3 className="rec-subhead rec-subhead-2">{T.quotesTitle}</h3>
        <div className="quote-grid">
          {T.quotes.map((q, i) => (
            <Reveal className="quote-card" key={i} delay={(i % 2) * 90}>
              <span className="quote-mark" aria-hidden="true">"</span>
              <p className="quote-text">{q.text}</p>
              <div className="quote-foot">
                <span className="quote-name">
                  <span className="quote-av">{q.name.charAt(0)}</span>
                  {q.name}
                </span>
                <button className="quote-shot" onClick={() => zoom(q.shot, `המלצה מקורית — ${q.name}`)}>
                  <Icons.Expand /> צילום מסך מקורי
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Contact ----
function Contact() {
  const waLink = `https://wa.me/${C.phoneIntl}?text=${encodeURIComponent('היי נדב! ראיתי את האתר ואשמח לקבל פרטים על סדנת הנשימה הקרובה 🌿')}`;
  const igLink = `https://www.instagram.com/${C.instagram}/`;
  return (
    <section className="band" id="contact">
      <div className="wrap">
        <Reveal className="contact">
          <svg className="contact-wave" viewBox="0 0 200 200" aria-hidden="true">
            <path fill="#ffffff" d="M40 120c20 20 40-10 70 0s40 30 50 10-10-50-30-70-60-20-80 0-30 40-10 60Z" />
          </svg>
          <span className="eyebrow" style={{ color: 'var(--teal-200)' }}>{C.contact.eyebrow}</span>
          <h2>{C.contact.title}</h2>
          <p className="lead">{C.contact.sub}</p>
          <div className="contact-actions">
            <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">
              <Icons.Whatsapp /> שליחת הודעה · {C.phone}
            </a>
            <a className="btn btn-ghost" href={igLink} target="_blank" rel="noopener noreferrer">
              <Icons.Instagram /> <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>@{C.instagram}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---- Footer ----
function Footer() {
  const igLink = `https://www.instagram.com/${C.instagram}/`;
  const telLink = `tel:+${C.phoneIntl}`;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-brand">
          <b>לנשום עם נדב</b>
          <img className="footer-logo" src="/logo.jpeg" alt="Breathwork" />
          <b style={{ direction: 'ltr' }}>Breathwork</b>
        </div>
        <div className="footer-links">
          <a href={telLink}>{C.phone}</a>
          <a href={igLink} target="_blank" rel="noopener noreferrer">@{C.instagram}</a>
          <span>{C.location}</span>
        </div>
        <small className="footer-copy">
          <span dir="ltr">© {new Date().getFullYear()} Breathwork</span>
          <span aria-hidden="true">-</span>
          <span>לנשום עם נדב · נדב שי</span>
        </small>
      </div>
    </footer>
  );
}

// ---- App ----
export default function App() {
  const lightboxState = useState(null);
  return (
    <LightboxCtx.Provider value={lightboxState}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Space />
        <Session />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Lightbox />
    </LightboxCtx.Provider>
  );
}
