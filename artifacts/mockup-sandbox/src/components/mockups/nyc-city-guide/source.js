// Keep the list in memory only; refreshing the page starts a fresh set of notes.
const likeForm = document.querySelector("#like-form");
const likeInput = document.querySelector("#like-input");
const likeList = document.querySelector("#like-list");
const emptyMessage = document.querySelector("#list-empty");
const birdButton = document.querySelector(".bird-button");

function updateEmptyMessage() {
  emptyMessage.hidden = likeList.children.length > 0;
}

function addLike(text) {
  const item = document.createElement("li");
  const label = document.createElement("span");
  const removeButton = document.createElement("button");

  // textContent treats visitor input as text rather than executable markup.
  label.textContent = text;
  removeButton.type = "button";
  removeButton.className = "remove-like";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove “${text}”`);
  removeButton.addEventListener("click", () => {
    item.remove();
    updateEmptyMessage();
  });

  item.append(label, removeButton);
  likeList.append(item);
  updateEmptyMessage();
}

likeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = likeInput.value.trim();

  // Ignore blank and whitespace-only submissions.
  if (!text) {
    likeInput.focus();
    return;
  }

  addLike(text);
  likeInput.value = "";
  likeInput.focus();
});

// Restart the animation cleanly even when the bird is clicked again quickly.
birdButton.addEventListener("click", () => {
  birdButton.classList.remove("is-fluttering");
  // Reading layout forces the browser to notice removal before re-adding the class.
  void birdButton.offsetWidth;
  birdButton.classList.add("is-fluttering");
});

birdButton.addEventListener("animationend", (event) => {
  if (event.target.classList.contains("bird")) {
    birdButton.classList.remove("is-fluttering");
  }
});

updateEmptyMessage();
