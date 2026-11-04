import "./_group.css";
import sourceHtml from "./source.html?raw";
import sourceCss from "./source.css?raw";
import sourceJs from "./source.js?raw";

// Render a faithful copy of the existing plain-HTML guide inside an isolated
// document, so its original styles and interactions remain unchanged.
const currentPage = sourceHtml
  .replace(
    '<link rel="stylesheet" href="./style.css">',
    `<style>${sourceCss}</style>`,
  )
  .replace(
    '<script src="./script.js" defer></script>',
    `<script>document.addEventListener("DOMContentLoaded", () => {${sourceJs}
    });</script>`,
  )
  .replaceAll("images/", "/__mockup/images/nyc-city-guide/");

export function Current() {
  return (
    <div className="nyc-current-preview">
      <iframe
        title="Current New York City guide"
        srcDoc={currentPage}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
