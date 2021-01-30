addEventListener("DOMContentLoaded", function () {
  const s = document.createElement("script");
  // eslint-disable-next-line no-undef
  s.src = chrome.runtime.getURL("script.js");
  document.head.insertBefore(s, document.head.firstChild);
});
