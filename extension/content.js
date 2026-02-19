function readText(selectors) {
  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (node && node.textContent) {
      const value = node.textContent.trim();
      if (value) {
        return value;
      }
    }
  }
  return "";
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "CAPTURE_LEAD") {
    return;
  }

  const name = readText([
    "h1.text-heading-xlarge",
    "h1.inline.t-24.v-align-middle.break-words"
  ]);
  const headline = readText([
    ".text-body-medium.break-words",
    ".pv-text-details__left-panel div.text-body-medium"
  ]);

  sendResponse({
    name,
    headline,
    profileUrl: window.location.href.split("?")[0]
  });
});
