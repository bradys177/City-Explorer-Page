// Keep visitor notes in page memory only; nothing is written to storage.
const menuButton = document.querySelector(".menu-toggle");
const searchButton = document.querySelector(".search-toggle");
const menuPanel = document.querySelector("#site-menu");
const searchPanel = document.querySelector("#site-search");
const searchInput = document.querySelector("#search-input");
const searchMessage = document.querySelector(".search-message");
const birdButton = document.querySelector(".bird-button");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteList = document.querySelector("#note-list");
const emptyNote = document.querySelector("#empty-note");

function closeMenu() {
  menuPanel.hidden = true;
  menuButton.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
}

function closeSearch() {
  searchPanel.hidden = true;
  searchButton.setAttribute("aria-expanded", "false");
  searchButton.setAttribute("aria-label", "Search this guide");
}

menuButton.addEventListener("click", () => {
  const willOpen = menuPanel.hidden;
  closeSearch();
  menuPanel.hidden = !willOpen;
  menuButton.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
});

searchButton.addEventListener("click", () => {
  const willOpen = searchPanel.hidden;
  closeMenu();
  searchPanel.hidden = !willOpen;
  searchButton.setAttribute("aria-expanded", String(willOpen));
  searchButton.setAttribute("aria-label", willOpen ? "Close search" : "Search this guide");
  searchMessage.textContent = "";
  if (willOpen) searchInput.focus();
});

menuPanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelector("#site-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchMessage.textContent = "Type a word to search this guide.";
    searchInput.focus();
    return;
  }

  const sections = [...document.querySelectorAll("[data-search-section]")];
  const match = sections.find((section) => section.textContent.toLowerCase().includes(query));
  if (!match) {
    searchMessage.textContent = "No match yet. Try pizza, Big Apple, or bluebird.";
    return;
  }

  const label = match.getAttribute("aria-label") || "a guide section";
  closeSearch();
  closeMenu();
  match.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
  searchMessage.textContent = `Found: ${label}`;
});

// Remove the animation class first so another click can replay the takeoff.
birdButton.addEventListener("click", () => {
  birdButton.classList.remove("is-fluttering");
  window.requestAnimationFrame(() => birdButton.classList.add("is-fluttering"));
});
birdButton.querySelector(".bird").addEventListener("animationend", () => {
  birdButton.classList.remove("is-fluttering");
});

function updateEmptyState() {
  emptyNote.hidden = noteList.children.length > 0;
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = noteInput.value.trim();
  if (!value) {
    noteInput.focus();
    return;
  }

  const item = document.createElement("li");
  const text = document.createElement("span");
  // textContent keeps visitor-provided text from being interpreted as markup.
  text.textContent = value;
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove “${value}”`);
  removeButton.addEventListener("click", () => {
    item.remove();
    updateEmptyState();
  });
  item.append(text, removeButton);
  noteList.append(item);
  noteInput.value = "";
  updateEmptyState();
  noteInput.focus();
});
