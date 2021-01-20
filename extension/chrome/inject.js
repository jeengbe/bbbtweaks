addEventListener("DOMContentLoaded", function () {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("script.js");
  document.head.insertBefore(s, document.head.firstChild);
});
