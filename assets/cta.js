/* Onefish CTA clicks — on a page opened from one of our tracked email links (it arrives with ?rl=<link id>), a click on
   any element marked data-cta="book" (or "deck", "pricing", …) is reported to Onefish's link tracker, so it counts for
   the email it came from. Add a tracked call-to-action to a page: include this script and mark the button.
     <script src="https://onefishai.github.io/resources/assets/cta.js" defer></script>
     <a href="https://onefish.ai/book/" data-cta="book">Book a 30-minute call</a>
   Without ?rl= (someone who found the page on their own) nothing is sent. */
(function () {
  var rl = new URLSearchParams(location.search).get("rl");
  if (!rl) return;
  var url = "https://api.onefish.ai/relay/cta/" + encodeURIComponent(rl);
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-cta]") : null;
    if (!el) return;
    var body = JSON.stringify({ cta: el.getAttribute("data-cta") });
    try {
      // sendBeacon survives the page navigating away (the button usually opens the booking page)
      if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }))) return;
    } catch (err) { /* fall through */ }
    fetch(url, { method: "POST", body: body, keepalive: true, mode: "no-cors" }).catch(function () {});
  }, true);
})();
