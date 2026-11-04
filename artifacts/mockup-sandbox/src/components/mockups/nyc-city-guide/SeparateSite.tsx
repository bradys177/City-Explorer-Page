import { useRef, useState, type FormEvent } from "react";
import "./SeparateSite.css";

type CityNote = { id: number; text: string };

export function SeparateSite() {
  const [notes, setNotes] = useState<CityNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [birdFlying, setBirdFlying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const nextNoteId = useRef(0);
  const noteInput = useRef<HTMLInputElement>(null);
  const site = useRef<HTMLElement>(null);

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = noteText.trim();
    if (!text) {
      noteInput.current?.focus();
      return;
    }
    nextNoteId.current += 1;
    setNotes((current) => [...current, { id: nextNoteId.current, text }]);
    setNoteText("");
    noteInput.current?.focus();
  }

  function startBirdFlight() {
    setBirdFlying(false);
    window.requestAnimationFrame(() => setBirdFlying(true));
  }

  function searchGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchText.trim().toLowerCase();
    if (!query) {
      setSearchMessage("Type a word to search this guide.");
      return;
    }

    const sections = Array.from(
      site.current?.querySelectorAll<HTMLElement>("[data-search-section]") ?? [],
    );
    const match = sections.find((section) =>
      section.textContent?.toLowerCase().includes(query),
    );

    if (!match) {
      setSearchMessage("No match yet. Try pizza, Big Apple, or bluebird.");
      return;
    }

    setSearchMessage(`Found: ${match.getAttribute("aria-label") ?? "a guide section"}`);
    setMenuOpen(false);
    setSearchOpen(false);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    match.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="separate-site" ref={site}>
      <a className="ss-skip" href="#site-content">Skip to the guide</a>

      <header className="ss-header ss-shell">
        <a className="ss-brand" href="#top" aria-label="New York field notes, home">
          <span className="ss-stamp" aria-hidden="true">NY</span>
          <span>Field notes <i>/</i> New York City</span>
        </a>

        <div className="ss-header-actions">
          <a className="ss-visit" href="#city-facts">Plan your visit <span aria-hidden="true">↘</span></a>
          <button
            className="ss-icon-button"
            type="button"
            aria-label={searchOpen ? "Close search" : "Search this guide"}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((open) => !open);
              setSearchMessage("");
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.5" />
              <path d="m15.6 15.6 5 5" />
            </svg>
          </button>
          <button
            className={`ss-icon-button ss-menu-button${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen((open) => !open);
            }}
          >
            <span /><span />
          </button>
        </div>

        {searchOpen && (
          <form className="ss-search" id="site-search" role="search" onSubmit={searchGuide}>
            <label htmlFor="site-search-input">Search the guide</label>
            <div className="ss-search-row">
              <input
                id="site-search-input"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Try pizza or bluebird"
                autoFocus
              />
              <button type="submit">Find <span aria-hidden="true">↗</span></button>
            </div>
            {searchMessage && <p role="status">{searchMessage}</p>}
          </form>
        )}

        {menuOpen && (
          <nav className="ss-menu-panel" id="site-menu" aria-label="On this page">
            <a href="#city-facts" onClick={closeMenu}>Quick facts <span>01</span></a>
            <a href="#local-food" onClick={closeMenu}>New York pizza <span>02</span></a>
            <a href="#state-bird" onClick={closeMenu}>State bird <span>03</span></a>
            <a href="#city-notes" onClick={closeMenu}>Things I like <span>04</span></a>
          </nav>
        )}
      </header>

      <div id="site-content">
        <section className="ss-hero ss-shell" id="top" aria-labelledby="ss-title" data-search-section aria-label="The New York City cover story">
          <div className="ss-hero-head">
            <div>
              <p className="ss-kicker"><span /> A pocket guide for first wanderings</p>
              <h1 className="ss-title" id="ss-title">
                <span>New York</span>
                <span>in your</span>
                <em>pocket.</em>
              </h1>
            </div>
            <p className="ss-hero-note"><strong>Five boroughs.</strong> A little loud, a lot lovely. Start anywhere, look up often, and leave room for one more slice.</p>
          </div>

          <figure className="ss-cover" id="local-food">
            <img
              src="/__mockup/images/nyc-city-guide/nyc-pizza.png"
              alt="A classic New York City cheese slice, folded lengthwise with a crisp golden crust and bubbling cheese."
            />
            <figcaption>
              <div>
                <span className="ss-image-kicker">A very good place to start</span>
                <span className="ss-image-title">New York pizza. The fold.</span>
              </div>
              <span className="ss-cover-coordinates">40° 42′ 46.8″ N<br />74° 00′ 21.6″ W</span>
            </figcaption>
          </figure>

          <div className="ss-hero-foot">
            <span>New York City · Field notes no. 01</span>
            <a href="#city-facts">Get your bearings <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="ss-facts ss-shell" id="city-facts" aria-label="Quick facts about New York City" data-search-section>
          <div className="ss-section-title">
            <p className="ss-kicker">First things first <span>01 / 03</span></p>
            <h2>A few things<br />to know.</h2>
          </div>
          <div className="ss-facts-content">
            <p className="ss-intro">Big place. Big heart. Here’s the short version before you hit the sidewalk.</p>
            <ul className="ss-fact-list">
              <li><span>A</span><span>We call it <strong>The Big Apple.</strong></span></li>
              <li><span>B</span><span>About <strong>8.6 million</strong> people call New York City home, based on the latest July 2025 estimate.</span></li>
              <li><span>C</span><span>New York State became a state in <strong>1788.</strong></span></li>
            </ul>
            <p className="ss-mayor">
              <span className="ss-city-seal" aria-hidden="true">NYC</span>
              <span>City Hall, these days: <strong>Mayor Zohran Mamdani</strong></span>
            </p>
          </div>
        </section>

        <section className="ss-food ss-shell" aria-label="New York City's best-known food" data-search-section>
          <div className="ss-food-copy">
            <p className="ss-kicker">A local favorite <span>02 / 03</span></p>
            <h2>One slice,<br /><em>then another.</em></h2>
            <p>NYC pizza comes by the slice: thin, wide, and sturdy enough to fold in half for the sidewalk. Go for a classic cheese, grab extra napkins, and don’t overthink the best slice. The one in your hand is doing just fine.</p>
            <span className="ss-food-note">Best enjoyed standing at the counter</span>
          </div>
          <div className="ss-food-art">
            <img
              src="/__mockup/images/nyc-city-guide/nyc-pizza.png"
              alt="A close-up of a thin New York cheese slice folded for eating on the sidewalk."
            />
            <span className="ss-photo-caption">Counter service, downtown</span>
          </div>
        </section>

        <section className="ss-bird" id="state-bird" aria-label="New York State bird" data-search-section>
          <div className="ss-bird-inner">
            <div className="ss-bird-copy">
              <p className="ss-kicker">Look up. Then look closer <span>A small surprise</span></p>
              <h2>The city has<br />a <em>softer side.</em></h2>
              <p>Between the avenues, there are leafy paths and little flashes of blue. New York’s state bird is the eastern bluebird. Tap it for a tiny takeoff.</p>
              <span className="ss-bird-hint">A small hello from the park <span aria-hidden="true">→</span></span>
            </div>
            <button
              className={`ss-bird-button${birdFlying ? " is-fluttering" : ""}`}
              type="button"
              aria-label="Make the eastern bluebird take off"
              onClick={startBirdFlight}
            >
              <img
                className="bird"
                src="/__mockup/images/nyc-city-guide/eastern-bluebird.png"
                alt="An eastern bluebird perched in profile, its bright blue feathers catching the light."
                onAnimationEnd={() => setBirdFlying(false)}
              />
            </button>
          </div>
        </section>

        <section className="ss-notes ss-shell" id="city-notes" aria-label="Things I like about New York City" data-search-section>
          <div className="ss-notes-intro">
            <p className="ss-kicker">Make it yours <span>03 / 03</span></p>
            <h2>Things I<br /><em>like.</em></h2>
            <p>Save the little discoveries from your day. This list lives only while this page is open.</p>
          </div>
          <div className="ss-notes-card">
            <div className="ss-notes-top"><span>Your city notes</span><span>NYC · Today</span></div>
            <form onSubmit={addNote}>
              <label htmlFor="ss-note-input">Something you liked</label>
              <div className="ss-input-row">
                <input
                  ref={noteInput}
                  id="ss-note-input"
                  name="like"
                  type="text"
                  maxLength={120}
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="A stoop, a song, a really good bagel…"
                  autoComplete="off"
                />
                <button type="submit">Add <span aria-hidden="true">+</span></button>
              </div>
              <p className="ss-form-hint">Just for this visit. No account, no fuss.</p>
            </form>
            <ul className="ss-note-list" aria-live="polite" aria-relevant="additions removals">
              {notes.map((note) => (
                <li key={note.id}>
                  <span>{note.text}</span>
                  <button
                    type="button"
                    aria-label={`Remove “${note.text}”`}
                    onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))}
                  >×</button>
                </li>
              ))}
            </ul>
            {notes.length === 0 && <p className="ss-empty">Your page, your pace. Add the first thing you love.</p>}
          </div>
        </section>
      </div>

      <footer className="ss-footer ss-shell">
        <span className="ss-stamp" aria-hidden="true">NY</span>
        <p>Take the long way home.</p>
        <a href="#top">Back to the beginning <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
