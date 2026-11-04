import { useRef, useState, type FormEvent } from "react";

type Like = { id: number; text: string };

export function Editorial() {
  const [likes, setLikes] = useState<Like[]>([]);
  const [value, setValue] = useState("");
  const [isFlying, setIsFlying] = useState(false);
  const nextLikeId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function addLike(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    nextLikeId.current += 1;
    setLikes((current) => [...current, { id: nextLikeId.current, text }]);
    setValue("");
    inputRef.current?.focus();
  }

  function removeLike(id: number) {
    setLikes((current) => current.filter((like) => like.id !== id));
  }

  function startBirdAnimation() {
    // Remove the class first so a quick repeat click can restart the animation.
    setIsFlying(false);
    window.requestAnimationFrame(() => setIsFlying(true));
  }

  return (
    <main className="editorial">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        .editorial {
          --night: #090909;
          --night-soft: #131313;
          --paper: #f2eee5;
          --muted: #aaa69d;
          --line: rgba(242,238,229,.2);
          --acid: #d5e49a;
          background: var(--night);
          color: var(--paper);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.65;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .editorial *, .editorial *::before, .editorial *::after { box-sizing: border-box; }
        .editorial a { color: inherit; text-decoration: none; }
        .editorial button, .editorial input { font: inherit; }
        .editorial button { color: inherit; }
        .editorial :focus-visible { outline: 2px solid var(--acid); outline-offset: 5px; }
        .editorial .skip {
          position: absolute; z-index: 10; left: 20px; top: -70px;
          padding: 10px 15px; color: var(--night); background: var(--acid);
        }
        .editorial .skip:focus { top: 18px; }
        .ed-shell { width: min(100% - 11vw, 1440px); margin-inline: auto; }
        .ed-masthead {
          height: 76px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--line); position: relative; z-index: 2;
        }
        .ed-brand {
          display: flex; align-items: center; gap: 13px; font-size: .75rem;
          font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
        }
        .ed-mark {
          display: grid; place-items: center; width: 31px; height: 31px;
          border: 1px solid rgba(242,238,229,.56); border-radius: 50%;
          font: 500 .55rem 'DM Mono', monospace; letter-spacing: -.04em;
        }
        .ed-nav { display: flex; gap: clamp(18px, 3vw, 46px); align-items: center; }
        .ed-nav a, .ed-kicker, .ed-meta, .ed-caption, .ed-mono {
          font: 500 .62rem 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase;
        }
        .ed-nav a { color: #c4c0b8; transition: color .2s ease; }
        .ed-nav a:hover, .ed-footer a:hover { color: var(--acid); }
        .ed-issue { color: var(--muted); white-space: nowrap; }
        .ed-hero { padding: clamp(38px, 6vw, 88px) 0 50px; }
        .ed-hero-top {
          display: flex; justify-content: space-between; align-items: end;
          gap: 30px; margin-bottom: clamp(23px, 4vw, 52px);
        }
        .ed-kicker { color: var(--acid); margin: 0 0 17px; }
        .ed-title {
          margin: 0; font: 500 clamp(4.2rem, 13.2vw, 12.5rem)/.76 'Playfair Display', Georgia, serif;
          letter-spacing: -.075em; text-transform: uppercase;
        }
        .ed-title span { display: block; }
        .ed-title span:last-child { padding-left: .46em; }
        .ed-hero-side {
          max-width: 210px; flex: 0 0 18%; padding-bottom: 7px;
          color: #c3bfb6; font-size: .91rem; line-height: 1.6;
        }
        .ed-hero-side strong { display: block; color: var(--paper); font-weight: 500; }
        .ed-cover {
          position: relative; height: clamp(280px, 43vw, 590px); overflow: hidden;
          background: #24221e;
        }
        .ed-cover img {
          display: block; width: 100%; height: 100%; object-fit: cover;
          object-position: 50% 51%; filter: saturate(.78) brightness(.82);
          transition: transform .8s cubic-bezier(.2,.7,.25,1), filter .6s ease;
        }
        .ed-cover:hover img { transform: scale(1.025); filter: saturate(.92) brightness(.9); }
        .ed-cover::after {
          content: ""; position: absolute; inset: 35% 0 0;
          background: linear-gradient(transparent, rgba(0,0,0,.62));
          pointer-events: none;
        }
        .ed-cover-caption {
          position: absolute; z-index: 1; left: clamp(18px, 3vw, 42px); right: clamp(18px, 3vw, 42px);
          bottom: clamp(18px, 3vw, 36px); display: flex; justify-content: space-between;
          align-items: end; gap: 20px;
        }
        .ed-cover-caption p { margin: 0; }
        .ed-cover-caption .ed-caption { color: var(--acid); }
        .ed-cover-caption .ed-caption-note {
          font: 500 clamp(1.5rem, 3vw, 2.8rem)/1 'Playfair Display', Georgia, serif;
          letter-spacing: -.035em;
        }
        .ed-cover-index { color: rgba(255,255,255,.78); }
        .ed-hero-bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 15px; color: var(--muted);
        }
        .ed-hero-bottom p { margin: 0; }
        .ed-scroll {
          display: inline-flex; align-items: center; gap: 12px; transition: color .2s ease;
        }
        .ed-scroll:hover { color: var(--acid); }
        .ed-scroll span:last-child { font-size: 1.2rem; transition: transform .2s ease; }
        .ed-scroll:hover span:last-child { transform: translateY(4px); }
        .ed-facts {
          padding: clamp(86px, 12vw, 164px) 0 clamp(90px, 12vw, 160px);
          border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
          display: grid; grid-template-columns: .8fr 1.2fr; gap: 12%;
        }
        .ed-section-head .ed-kicker { margin-bottom: 22px; }
        .ed-heading {
          font: 500 clamp(3.2rem, 6.3vw, 6.5rem)/.9 'Playfair Display', Georgia, serif;
          letter-spacing: -.065em; margin: 0;
        }
        .ed-fact-content { padding-top: 30px; }
        .ed-lede { max-width: 360px; margin: 0 0 26px; color: #c3bfb6; font-size: 1.03rem; }
        .ed-fact-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--line); }
        .ed-fact-list li {
          display: grid; grid-template-columns: 56px 1fr; gap: 16px;
          padding: 20px 0; border-bottom: 1px solid var(--line);
        }
        .ed-fact-list li > span:first-child { color: var(--acid); font: 500 .7rem 'DM Mono', monospace; padding-top: 4px; }
        .ed-fact-list strong { font-weight: 600; }
        .ed-mayor {
          margin: 22px 0 0; display: flex; align-items: center; gap: 14px;
          color: var(--muted); font-size: .86rem;
        }
        .ed-mayor-badge {
          display: grid; place-items: center; width: 38px; height: 38px;
          border: 1px solid var(--acid); border-radius: 50%; color: var(--acid);
          font: 500 .62rem 'DM Mono', monospace;
        }
        .ed-mayor strong { color: var(--paper); }
        .ed-pizza {
          padding: clamp(88px, 12vw, 158px) 0; display: grid;
          grid-template-columns: 1fr .8fr; gap: clamp(38px, 8vw, 118px); align-items: center;
        }
        .ed-pizza-photo { position: relative; min-width: 0; }
        .ed-pizza-photo img {
          display: block; width: 100%; aspect-ratio: 1.08; object-fit: cover;
          filter: saturate(.82); transition: filter .4s ease, transform .6s ease;
        }
        .ed-pizza-photo:hover img { filter: saturate(1); transform: translateY(-4px); }
        .ed-photo-caption {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 13px; color: var(--muted);
        }
        .ed-pizza-copy .ed-kicker { margin-bottom: 25px; }
        .ed-pizza-copy h2 {
          margin: 0 0 26px; font: 500 clamp(3.3rem, 6vw, 6.2rem)/.9 'Playfair Display', Georgia, serif;
          letter-spacing: -.065em;
        }
        .ed-pizza-copy h2 em { color: var(--acid); font-weight: 500; }
        .ed-pizza-copy > p:not(.ed-kicker) { max-width: 430px; color: #c3bfb6; line-height: 1.85; }
        .ed-pizza-note {
          margin-top: 32px; padding-top: 15px; border-top: 1px solid var(--line);
          color: var(--acid); font: 500 .62rem 'DM Mono', monospace; letter-spacing: .08em;
        }
        .ed-bird-section {
          background: #d7dfcc; color: #171a16; position: relative; overflow: hidden;
        }
        .ed-bird-inner {
          width: min(100% - 11vw, 1120px); margin: auto; min-height: 510px;
          padding: clamp(68px, 9vw, 120px) 0; display: flex; align-items: center;
          justify-content: space-between; gap: 8%;
        }
        .ed-bird-copy { position: relative; z-index: 1; max-width: 520px; }
        .ed-bird-copy .ed-kicker { color: #4b5a43; }
        .ed-bird-copy .ed-heading { margin-bottom: 25px; }
        .ed-bird-copy .ed-heading em { color: #536b4c; font-weight: 500; }
        .ed-bird-copy > p:not(.ed-kicker) { max-width: 380px; color: #444a40; }
        .ed-bird-hint { color: #526649; display: inline-block; margin-top: 10px; }
        .ed-bird-button {
          position: relative; display: grid; flex: 0 0 auto; place-items: center;
          width: clamp(220px, 30vw, 370px); aspect-ratio: 1; border: 1px solid rgba(23,26,22,.45);
          border-radius: 50%; padding: 8%; background: transparent; cursor: pointer;
          transition: background .25s ease, transform .25s ease;
        }
        .ed-bird-button:hover { background: rgba(255,255,255,.25); transform: rotate(-3deg); }
        .ed-bird-button::before, .ed-bird-button::after {
          content: ""; position: absolute; inset: 10%; border: 1px solid rgba(23,26,22,.18); border-radius: 50%;
        }
        .ed-bird-button::after { inset: -9%; border-style: dashed; opacity: .55; }
        .ed-bird {
          display: block; width: 100%; height: 100%; object-fit: contain;
          position: relative; z-index: 1; border-radius: 50%;
        }
        .ed-bird-button.is-fluttering .bird { animation: ed-takeoff .74s cubic-bezier(.2,.7,.25,1) both; }
        @keyframes ed-takeoff {
          0% { transform: translate(0,0) rotate(0) scale(1); opacity: 1; }
          34% { transform: translate(10px,-26px) rotate(-8deg) scale(1.04); opacity: 1; }
          100% { transform: translate(78px,-118px) rotate(12deg) scale(.82); opacity: 0; }
        }
        .ed-notes {
          padding: clamp(90px, 12vw, 156px) 0; display: grid;
          grid-template-columns: .8fr 1.2fr; gap: 12%; align-items: start;
        }
        .ed-notes-copy .ed-kicker { margin-bottom: 22px; }
        .ed-notes-copy p:not(.ed-kicker) { max-width: 300px; margin-top: 23px; color: var(--muted); }
        .ed-notes-card {
          padding: clamp(22px, 3.4vw, 38px); background: var(--night-soft);
          border: 1px solid var(--line);
        }
        .ed-notes-top {
          display: flex; justify-content: space-between; gap: 15px; padding-bottom: 16px;
          border-bottom: 1px solid var(--line); color: var(--acid);
        }
        .ed-notes-top span:last-child { color: var(--muted); text-align: right; }
        .ed-form { padding-top: 21px; }
        .ed-form label { display: block; margin-bottom: 8px; font-size: .78rem; font-weight: 600; }
        .ed-input-row { display: flex; border-bottom: 1px solid rgba(242,238,229,.62); }
        .ed-input-row:focus-within { border-bottom: 2px solid var(--acid); }
        .ed-input-row input {
          flex: 1; min-width: 0; padding: 12px 2px; border: 0; border-radius: 0;
          outline: 0; background: transparent; color: var(--paper); font-size: .9rem;
        }
        .ed-input-row input::placeholder { color: #85827b; opacity: 1; }
        .ed-input-row button {
          border: 0; background: transparent; color: var(--acid); cursor: pointer;
          padding: 0 2px 0 12px; font: 500 .68rem 'DM Mono', monospace;
          letter-spacing: .08em; text-transform: uppercase; transition: color .2s ease;
        }
        .ed-input-row button:hover { color: var(--paper); }
        .ed-form-hint { margin: 10px 0 0; color: var(--muted); font-size: .7rem; }
        .ed-like-list { list-style: none; margin: 15px 0 0; padding: 0; }
        .ed-like-list li {
          display: flex; justify-content: space-between; gap: 20px; align-items: center;
          padding: 11px 0 11px 20px; border-top: 1px solid var(--line); position: relative;
          overflow-wrap: anywhere;
        }
        .ed-like-list li::before { content: "—"; position: absolute; left: 0; color: var(--acid); }
        .ed-remove {
          flex: 0 0 30px; width: 30px; height: 30px; border: 0; border-radius: 50%;
          background: transparent; color: var(--muted); cursor: pointer; font-size: 1.25rem;
          transition: background .2s ease, color .2s ease;
        }
        .ed-remove:hover { background: rgba(213,228,154,.12); color: var(--acid); }
        .ed-empty { margin: 18px 0 0; color: var(--muted); font: italic 1rem 'Playfair Display', Georgia, serif; }
        .ed-footer {
          min-height: 100px; border-top: 1px solid var(--line); display: flex;
          justify-content: space-between; align-items: center; gap: 20px; color: var(--muted);
        }
        .ed-footer p { margin: 0; color: var(--paper); font: italic 1.1rem 'Playfair Display', Georgia, serif; }
        .ed-footer a { transition: color .2s ease; }
        @media (max-width: 760px) {
          .ed-shell, .ed-bird-inner { width: min(100% - 9vw, 620px); }
          .ed-masthead { height: 68px; }
          .ed-issue { display: none; }
          .ed-hero { padding-top: 57px; }
          .ed-hero-top { display: block; }
          .ed-title { font-size: clamp(4.1rem, 16vw, 8.2rem); }
          .ed-title span:last-child { padding-left: .28em; }
          .ed-hero-side { max-width: 350px; margin: 26px 0 0 auto; }
          .ed-cover { height: clamp(300px, 66vw, 490px); }
          .ed-facts, .ed-notes { grid-template-columns: 1fr; gap: 35px; }
          .ed-fact-content { padding-top: 0; }
          .ed-pizza { grid-template-columns: 1fr; gap: 38px; }
          .ed-pizza-photo { width: min(100%, 540px); }
          .ed-pizza-photo img { aspect-ratio: 1.15; }
          .ed-pizza-copy { max-width: 540px; }
          .ed-bird-inner { min-height: 0; flex-direction: column; align-items: flex-start; gap: 36px; }
          .ed-bird-button { width: min(68vw, 340px); align-self: center; }
        }
        @media (max-width: 480px) {
          .ed-shell, .ed-bird-inner { width: min(100% - 40px, 430px); }
          .ed-masthead { height: 64px; }
          .ed-brand { font-size: .62rem; gap: 9px; }
          .ed-mark { width: 28px; height: 28px; }
          .ed-nav { gap: 12px; }
          .ed-nav a { font-size: .53rem; letter-spacing: .04em; }
          .ed-hero { padding-top: 48px; }
          .ed-title { font-size: clamp(3.65rem, 15.6vw, 5.2rem); }
          .ed-hero-side { margin-top: 21px; font-size: .85rem; }
          .ed-cover { height: 320px; }
          .ed-cover-caption { align-items: end; }
          .ed-cover-caption .ed-caption-note { max-width: 200px; }
          .ed-cover-index { display: none; }
          .ed-hero-bottom { font-size: .84rem; }
          .ed-kicker, .ed-meta, .ed-caption, .ed-mono { font-size: .55rem; }
          .ed-facts, .ed-pizza, .ed-notes { padding-block: 72px; }
          .ed-fact-list li { grid-template-columns: 36px 1fr; gap: 11px; }
          .ed-pizza-copy h2 { font-size: clamp(3.35rem, 14vw, 4.6rem); }
          .ed-notes-top { font-size: .52rem; }
          .ed-footer { flex-wrap: wrap; padding: 22px 0; font-size: .75rem; }
          .ed-footer p { width: 100%; order: -1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .editorial *, .editorial *::before, .editorial *::after {
            scroll-behavior: auto !important; animation-duration: .01ms !important;
            animation-iteration-count: 1 !important; transition-duration: .01ms !important;
          }
        }
      `}</style>
      <a className="skip" href="#guide-main">Skip to the guide</a>
      <header className="ed-masthead ed-shell">
        <a className="ed-brand" href="#top" aria-label="New York field notes, home">
          <span className="ed-mark" aria-hidden="true">NY</span>
          <span>Field notes <span style={{ color: "var(--acid)" }}>/</span> New York City</span>
        </a>
        <nav className="ed-nav" aria-label="On this page">
          <a href="#quick-facts">Facts</a>
          <a href="#local-love">Pizza</a>
          <a href="#your-notes">Notes</a>
        </nav>
        <span className="ed-issue ed-meta">A pocket guide · No. 01</span>
      </header>

      <div id="guide-main">
        <section className="ed-hero ed-shell" id="top" aria-labelledby="hero-title">
          <div className="ed-hero-top">
            <div>
              <p className="ed-kicker">A pocket guide for first wanderings</p>
              <h1 className="ed-title" id="hero-title"><span>New York</span><span>City.</span></h1>
            </div>
            <p className="ed-hero-side"><strong>The Big Apple.</strong>A little loud, a lot lovely. Start anywhere, look up often, and leave room for one more slice.</p>
          </div>
          <figure className="ed-cover" id="local-love">
            <img
              src="/__mockup/images/nyc-city-guide/nyc-pizza.png"
              alt="A classic New York City cheese slice, folded lengthwise with a crisp golden crust and bubbling cheese."
            />
            <figcaption className="ed-cover-caption">
              <div>
                <p className="ed-caption">A very good place to start</p>
                <p className="ed-caption-note">New York pizza. The fold.</p>
              </div>
              <span className="ed-caption ed-cover-index">40° 42′ 46.8″ N &nbsp; / &nbsp; 74° 00′ 21.6″ W</span>
            </figcaption>
          </figure>
          <div className="ed-hero-bottom">
            <p className="ed-meta">Five boroughs. No wrong turns.</p>
            <a className="ed-scroll ed-meta" href="#quick-facts"><span>Get your bearings</span><span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="ed-facts ed-shell" id="quick-facts" aria-labelledby="facts-title">
          <div className="ed-section-head">
            <p className="ed-kicker">First things first <span className="ed-meta">01 / 03</span></p>
            <h2 className="ed-heading" id="facts-title">A few things<br />to know.</h2>
          </div>
          <div className="ed-fact-content">
            <p className="ed-lede">Big place. Big heart. Here’s the short version before you hit the sidewalk.</p>
            <ul className="ed-fact-list">
              <li><span>A</span><span>We call it <strong>The Big Apple.</strong></span></li>
              <li><span>B</span><span>About <strong>8.6 million</strong> people call New York City home, based on the latest July 2025 estimate.</span></li>
              <li><span>C</span><span>New York State became a state in <strong>1788.</strong></span></li>
            </ul>
            <p className="ed-mayor"><span className="ed-mayor-badge" aria-hidden="true">NYC</span><span>City Hall, these days: <strong>Mayor Zohran Mamdani</strong></span></p>
          </div>
        </section>

        <section className="ed-pizza ed-shell" aria-labelledby="pizza-title">
          <figure className="ed-pizza-photo">
            <img
              src="/__mockup/images/nyc-city-guide/nyc-pizza.png"
              alt="A classic New York City cheese slice, folded lengthwise with a crisp golden crust and bubbling cheese."
            />
            <figcaption className="ed-photo-caption ed-caption">
              <span>Counter service, downtown</span><span>02 / 03</span>
            </figcaption>
          </figure>
          <div className="ed-pizza-copy">
            <p className="ed-kicker">A local favorite</p>
            <h2 id="pizza-title">New York pizza.<br /><em>The fold.</em></h2>
            <p>NYC pizza comes by the slice: thin, wide, and sturdy enough to fold in half for the sidewalk. Go for a classic cheese, grab extra napkins, and don’t overthink the best slice. The one in your hand is doing just fine.</p>
            <div className="ed-pizza-note">Best enjoyed standing at the counter</div>
          </div>
        </section>

        <section className="ed-bird-section" aria-labelledby="bird-title">
          <div className="ed-bird-inner">
            <div className="ed-bird-copy">
              <p className="ed-kicker">Look up. Then look closer <span className="ed-meta">A small surprise</span></p>
              <h2 className="ed-heading" id="bird-title">The city has<br />a <em>softer side.</em></h2>
              <p>Between the avenues, there are leafy paths and little flashes of blue. Tap the bird for a tiny takeoff.</p>
              <span className="ed-bird-hint ed-mono">A small hello from the park <span aria-hidden="true">→</span></span>
            </div>
            <button
              className={`ed-bird-button${isFlying ? " is-fluttering" : ""}`}
              type="button"
              aria-label="Make the eastern bluebird take off"
              onClick={startBirdAnimation}
            >
              <img
                className="bird"
                src="/__mockup/images/nyc-city-guide/eastern-bluebird.png"
                alt="An eastern bluebird perched in profile, its bright blue feathers catching the light."
                onAnimationEnd={() => setIsFlying(false)}
              />
            </button>
          </div>
        </section>

        <section className="ed-notes ed-shell" id="your-notes" aria-labelledby="notes-title">
          <div className="ed-notes-copy">
            <p className="ed-kicker">Make it yours <span className="ed-meta">03 / 03</span></p>
            <h2 className="ed-heading" id="notes-title">Things I<br /><em>like.</em></h2>
            <p>Save the little discoveries from your day. This list lives only while this page is open.</p>
          </div>
          <div className="ed-notes-card">
            <div className="ed-notes-top ed-mono"><span>Your city notes</span><span aria-hidden="true">NYC · Today</span></div>
            <form className="ed-form" onSubmit={addLike}>
              <label htmlFor="ed-like-input">Something you liked</label>
              <div className="ed-input-row">
                <input
                  ref={inputRef}
                  id="ed-like-input"
                  name="like"
                  type="text"
                  maxLength={120}
                  placeholder="A stoop, a song, a really good bagel…"
                  autoComplete="off"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
                <button type="submit">Add <span aria-hidden="true">+</span></button>
              </div>
              <p className="ed-form-hint">Just for this visit. No account, no fuss.</p>
            </form>
            <ul className="ed-like-list" aria-live="polite" aria-relevant="additions removals">
              {likes.map((like) => (
                <li key={like.id}>
                  <span>{like.text}</span>
                  <button
                    className="ed-remove"
                    type="button"
                    aria-label={`Remove “${like.text}”`}
                    onClick={() => removeLike(like.id)}
                  >×</button>
                </li>
              ))}
            </ul>
            {likes.length === 0 && <p className="ed-empty">Your page, your pace. Add the first thing you love.</p>}
          </div>
        </section>
      </div>

      <footer className="ed-footer ed-shell">
        <span className="ed-mark" aria-hidden="true">NY</span>
        <p>Take the long way home.</p>
        <a className="ed-mono" href="#top">Back to the beginning <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
