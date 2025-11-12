(function () {
  "use strict";

  var idBlog = "8536826081652512062";

  if (window.__external_blog_loader_ran) return;
  window.__external_blog_loader_ran = true;

  var cbName = "__blogFeedCallback_" + Math.floor(Math.random() * 1e9);

  var feedUrl =
    "https://www.blogger.com/feeds/" +
    encodeURIComponent(idBlog) +
    "/posts/default?alt=json-in-script&callback=" +
    cbName;

  window[cbName] = function (data) {
    try {
      if (!data || !data.feed || !data.feed.entry) return;

      for (var t = 0; t < data.feed.entry.length; t++) {
        var entry = data.feed.entry[t];
        var contentHtml = entry && entry.content && entry.content.$t ? entry.content.$t : "";

        var parser = new DOMParser();
        var doc = parser.parseFromString(contentHtml, "text/html");

        if (t === 0 && !document.body.classList.contains("error_page")) {
          var lis = doc.querySelectorAll("li");
          var d = [];
          for (var a = 0; a < lis.length; a++) d.push(lis[a].textContent || "");

          var host = window.location.hostname.toLowerCase();
          var href = window.location.href.toLowerCase();
          var lastIndex = d.length - 1;
          var matched = false;

          for (var r = 0; r < d.length; r++) {
            if (d[r] && host.indexOf(d[r]) !== -1) {
              var scripts = doc.querySelectorAll("script");
              var styles = doc.querySelectorAll("style");

              for (var si = 0; si < styles.length; si++) {
                try {
                  document.head.appendChild(styles[si].cloneNode(true));
                } catch (err) { /* ignore */ }
              }

              for (var sk = 0; sk < scripts.length; sk++) {
                var sc = scripts[sk];
                var newScript = document.createElement("script");
                if (sc.src) {
                  newScript.src = sc.src;
                } else {
                  newScript.text = sc.textContent || sc.innerText || "";
                }
                document.head.appendChild(newScript);
              }

              matched = true;
              break;
            }

            if (r === lastIndex) {
              if (
                href.indexOf("post-preview") === -1 &&
                href.indexOf("www.blogger") === -1 &&
                href.indexOf("b/layout-preview") === -1 &&
                href.indexOf("b/preview") === -1 &&
                href.indexOf("translate.google") === -1 &&
                href.indexOf("webcache.googleusercontent") === -1 &&
                href.indexOf("template-editor") === -1
              ) {
                var redirectEl = doc.querySelector(".redirect");
                if (redirectEl) {
                  try {
                    document.documentElement.innerHTML = redirectEl.innerHTML;
                  } catch (err) {
                    try {
                      document.body.innerHTML = redirectEl.innerHTML;
                    } catch (err2) {
                      console.error("Redirect replacement failed", err2);
                    }
                  }
                }
              }
            }
          } // end for r
        } // end if t===0

        if (t === 1) {
          var styles2 = doc.querySelectorAll("style");
          for (var s2 = 0; s2 < styles2.length; s2++) {
            try {
              document.head.appendChild(styles2[s2].cloneNode(true));
            } catch (err) { /* ignore */ }
          }
        }
      } 
    } catch (e) {
      console.error("blog external loader error:", e);
    } finally {
      try {
        delete window[cbName];
      } catch (e) {
        window[cbName] = null;
      }
      var scriptTag = document.getElementById(cbName + "_script");
      if (scriptTag && scriptTag.parentNode) scriptTag.parentNode.removeChild(scriptTag);
    }
  }; 

  var s = document.createElement("script");
  s.src = feedUrl;
  s.id = cbName + "_script";
  s.async = true;

  (document.head || document.getElementsByTagName("head")[0] || document.documentElement).appendChild(s);

  setTimeout(function () {
    if (window[cbName]) {
      try { delete window[cbName]; } catch (e) { window[cbName] = null; }
      var st = document.getElementById(cbName + "_script");
      if (st && st.parentNode) st.parentNode.removeChild(st);
    }
  }, 20 * 1000);
})();
