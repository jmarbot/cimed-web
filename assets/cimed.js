/* CIMED · interacción y movimiento
   Todo el movimiento se desactiva con prefers-reduced-motion. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Consentimiento y analítica ---------- */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    if (store.get("cimed-consent") !== "all") return;
    var payload = { event: event, page: location.pathname };
    for (var k in data) payload[k] = data[k];
    window.dataLayer.push(payload);
  }
  window.cimedTrack = track;
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-track]");
    if (t) track(t.getAttribute("data-track"), { label: t.getAttribute("data-track-label") || t.textContent.trim().slice(0, 60) });
  });
  var cookies = $(".cookies");
  if (cookies) {
    if (!store.get("cimed-consent")) cookies.hidden = false;
    $$("[data-consent]", cookies).forEach(function (b) {
      b.addEventListener("click", function () { store.set("cimed-consent", b.getAttribute("data-consent")); cookies.hidden = true; });
    });
  }
  $$("[data-open-cookies]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); if (cookies) cookies.hidden = false; }); });

  /* ---------- Cabecera ---------- */
  var head = $(".site-head");
  var lastY = 0;
  function onScrollHead(y) {
    if (!head) return;
    head.classList.toggle("is-solid", y > 40);
    var hide = y > 420 && y > lastY + 4 && !document.querySelector(".mega.is-open");
    var show = y < lastY - 4;
    if (hide) head.classList.add("is-hidden"); else if (show || y < 420) head.classList.remove("is-hidden");
    var wa = $(".wa");
    if (wa) wa.classList.toggle("is-tucked", y < 200 && doc.classList.contains("has-hero"));
    lastY = y;
  }

  /* Mega menú */
  $$(".has-mega").forEach(function (item) {
    var btn = $("button", item), panel = $(".mega", item), timer;
    function open(v) { btn.setAttribute("aria-expanded", v ? "true" : "false"); panel.classList.toggle("is-open", v); if (v) head.classList.add("is-solid"); else onScrollHead(window.scrollY); }
    btn.addEventListener("click", function () { open(btn.getAttribute("aria-expanded") !== "true"); });
    if (finePointer) {
      item.addEventListener("mouseenter", function () { clearTimeout(timer); open(true); });
      item.addEventListener("mouseleave", function () { timer = setTimeout(function () { open(false); }, 180); });
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("is-open")) { open(false); btn.focus(); } });
  });

  /* Menú móvil */
  var drawer = $(".drawer");
  function setDrawer(v) {
    if (!drawer) return;
    drawer.classList.toggle("is-open", v);
    drawer.setAttribute("aria-hidden", v ? "false" : "true");
    $$("[data-drawer-open]").forEach(function (b) { b.setAttribute("aria-expanded", v ? "true" : "false"); });
    document.body.style.overflow = v ? "hidden" : "";
    if (window.__lenis) v ? window.__lenis.stop() : window.__lenis.start();
    if (v) setTimeout(function () { var c = $(".close-btn", drawer); if (c) c.focus(); }, 60);
  }
  $$("[data-drawer-open]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(true); }); });
  $$("[data-drawer-close]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(false); }); });
  if (drawer) {
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false); });
  }

  /* ---------- Desplazamiento suave ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    window.__lenis = lenis;
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on("scroll", function (e) { onScrollHead(e.scroll); if (window.ScrollTrigger) window.ScrollTrigger.update(); });
  }
  window.addEventListener("scroll", function () { if (!lenis) onScrollHead(window.scrollY); }, { passive: true });
  onScrollHead(window.scrollY);

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -90 }); else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true });
  });

  /* ---------- Transición entre páginas (si no hay View Transitions) ---------- */
  var curtain = $(".curtain");
  if (curtain && !reduce && !("onpagereveal" in window)) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      var href = a.getAttribute("href");
      if (!/^[\w-]+\.html(#.*)?$/.test(href)) return;
      e.preventDefault();
      curtain.classList.add("is-on");
      setTimeout(function () { location.href = href; }, 480);
    });
    window.addEventListener("pageshow", function () { curtain.classList.remove("is-on"); });
  }

  /* ---------- Apariciones ---------- */
  var reveals = $$(".reveal, .reveal-clip");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) { el.style.transitionDelay = Math.min(i, 6) * 90 + "ms"; requestAnimationFrame(function () { el.classList.add("is-in"); }); }
      else io.observe(el);
    });
    setTimeout(function () { reveals.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in"); }); }, 2500);
  }

  /* ---------- Escenas con GSAP ---------- */
  if (!reduce && window.gsap && window.ScrollTrigger) {
    var gsap = window.gsap; gsap.registerPlugin(window.ScrollTrigger);

    // Entrada del titular
    var heroLines = $$(".hero .line-mask > span, .page-hero h1");
    if (heroLines.length) gsap.from(heroLines, { yPercent: 105, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.09, delay: 0.1 });

    // Parallax ligero
    $$("[data-speed]").forEach(function (el) {
      var s = parseFloat(el.getAttribute("data-speed"));
      gsap.to(el, { yPercent: s * -20, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Pista horizontal de especialidades
    var pin = $(".spec-pin"), specTrack = $(".spec-track");
    if (pin && specTrack) {
      var mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", function () {
        pin.classList.add("is-pinned");
        var dist = function () { return Math.max(0, specTrack.scrollWidth - pin.clientWidth); };
        gsap.to(specTrack, { x: function () { return -dist(); }, ease: "none",
          scrollTrigger: { trigger: pin, start: "top top+=90", end: function () { return "+=" + dist(); }, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 } });
      });
    }

    // Antes · Durante · Después
    var adp = $(".adp");
    if (adp && window.matchMedia("(min-width: 861px)").matches) {
      var words = $$(".adp-word span", adp), panels = $$(".adp-panel", adp);
      var setStep = function (i) { words.forEach(function (w, j) { w.classList.toggle("is-on", j === i); }); panels.forEach(function (p, j) { p.classList.toggle("is-on", j === i); }); };
      setStep(0);
      window.ScrollTrigger.create({ trigger: adp, start: "top top", end: "+=180%", pin: ".adp-stage", scrub: true,
        onUpdate: function (st) { setStep(Math.min(2, Math.floor(st.progress * 3))); } });
      gsap.to(".adp-ring", { rotate: 120, scale: 1.25, ease: "none", scrollTrigger: { trigger: adp, start: "top top", end: "+=180%", scrub: true } });
    } else if (adp) {
      $$(".adp-word span, .adp-panel", adp).forEach(function (el) { el.classList.add("is-on"); });
    }

    // Medidores de personalidad
    $$(".meter i").forEach(function (m) { gsap.from(m, { scaleX: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: m, start: "top 90%" } }); });
    if (lenis) window.ScrollTrigger.refresh();
  } else {
    $$(".adp-word span, .adp-panel").forEach(function (el) { el.classList.add("is-on"); });
  }

  /* ---------- Inclinación 3D de tarjetas ---------- */
  if (finePointer && !reduce) {
    $$("[data-tilt]").forEach(function (card) {
      var max = parseFloat(card.getAttribute("data-tilt")) || 6, raf2 = 0;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf2);
        raf2 = requestAnimationFrame(function () {
          card.style.transform = "perspective(1000px) rotateX(" + ((0.5 - y) * max) + "deg) rotateY(" + ((x - 0.5) * max) + "deg) translateZ(0)";
          card.style.setProperty("--mx", x * 100 + "%"); card.style.setProperty("--my", y * 100 + "%");
        });
      });
      card.addEventListener("pointerleave", function () { card.style.transition = "transform .8s cubic-bezier(.16,1,.3,1)"; card.style.transform = ""; setTimeout(function () { card.style.transition = ""; }, 800); });
    });
  }

  /* ---------- Comparador ---------- */
  $$(".compare").forEach(function (c) {
    var input = $("input", c);
    var set = function () { c.style.setProperty("--pos", input.value + "%"); };
    input.addEventListener("input", set); set();
  });

  /* ---------- Copiar datos ---------- */
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copy"), label = b.textContent;
      var done = function () { b.textContent = "Copiado"; setTimeout(function () { b.textContent = label; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { done(); });
      else done();
    });
  });

  /* ---------- Formularios ---------- */
  $$("form[data-form]").forEach(function (form) {
    var msg = $(".form-msg", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      $$("[required]", form).forEach(function (f) {
        var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && (!f.pattern || new RegExp("^(?:" + f.pattern + ")$").test(f.value.trim()));
        if (f.type === "email" && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim());
        f.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !bad) bad = f;
      });
      if (bad) {
        msg.hidden = false; msg.className = "form-msg err";
        msg.textContent = "Revisa los campos marcados: necesitamos tu nombre, un teléfono válido y tu aceptación de la política de privacidad.";
        bad.focus(); return;
      }
      var endpoint = form.getAttribute("data-endpoint");
      track("solicitud_valoracion", { origen: form.getAttribute("data-form") });
      msg.hidden = false; msg.className = "form-msg";
      if (!endpoint) {
        msg.textContent = "Versión de pruebas: este formulario todavía no envía datos. Mientras se conecta, puedes escribirnos por WhatsApp o llamar al 670 68 27 77.";
        return;
      }
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); msg.textContent = "Hemos recibido tu solicitud. Te llamaremos para concretar tu valoración."; })
        .catch(function () { msg.className = "form-msg err"; msg.textContent = "No hemos podido enviar la solicitud. Inténtalo de nuevo o escríbenos por WhatsApp al 670 68 27 77."; });
    });
  });

  /* ---------- Filtros del blog ---------- */
  $$("[data-filter-group]").forEach(function (g) {
    var chips = $$(".chip", g), items = $$("[data-cat]");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        var cat = c.getAttribute("data-value");
        items.forEach(function (it) { it.hidden = cat !== "all" && it.getAttribute("data-cat") !== cat; });
      });
    });
  });

  /* ---------- Índice activo (fichas y especialidades) ---------- */
  var tocLinks = $$(".toc a[href^='#'], .jump a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
          map[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) tio.observe(el); });
  }

  /* ---------- Campo 3D de partículas (WebGL) ---------- */
  $$("canvas.field").forEach(function (canvas) { initField(canvas); });

  function initField(canvas) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return;
    var mode = canvas.getAttribute("data-field") === "wave" ? 1 : 0;
    var small = window.innerWidth < 700;
    var vs = [
      "attribute vec3 p; attribute float r;",
      "uniform float t, sc, asp, mode, dpr; uniform vec2 m;",
      "varying float vA;",
      "mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}",
      "mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}",
      "void main(){",
      " vec3 q=p;",
      " if(mode<0.5){",
      "  float n=sin(3.1*q.y+t*.55+r*6.283)*cos(2.3*q.x+t*.4)+.6*sin(4.0*q.z-t*.3);",
      "  q*=1.0+.085*n+sc*.55;",
      "  q=ry(t*.06+m.x*.35)*rx(.35+m.y*.2)*q;",
      "  q.x+=asp>1.0?.62:0.; q.y+=asp>1.0?.02:.38;",
      " } else {",
      "  q.y=.16*sin(q.x*2.6+t*.45)*cos(q.z*2.1+t*.33)+.05*sin(q.x*7.0-t*.6+r*3.);",
      "  q=rx(.42+m.y*.08)*ry(-.35+m.x*.12)*q; q.y-=.12-sc*.3; q.x+=.35;",
      " }",
      " vec4 v=vec4(q,1.); v.z-=3.0;",
      " float f=1.9;",
      " gl_Position=vec4(v.x*f/max(asp,.6)*(asp<1.0?1.25:1.0), v.y*f*(asp<1.0?asp*1.25:1.0), 0., -v.z);",
      " gl_PointSize=(mode<0.5?2.3:2.0)*dpr*(3.2/-v.z)*(.6+r*.8);",
      " vA=clamp((4.2+v.z)*.55,0.,1.)*(1.-sc*.8)*(.45+r*.55);",
      "}"
    ].join("\n");
    var fs = [
      "precision mediump float; varying float vA;",
      "void main(){ vec2 c=gl_PointCoord-.5; float d=dot(c,c); if(d>.25) discard;",
      " float a=smoothstep(.25,0.,d)*vA; gl_FragColor=vec4(mix(vec3(.72,.60,.39),vec3(.92,.86,.74),a*.5),a); }"
    ].join("\n");
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var pts = [], i;
    if (mode === 0) {
      var N = small ? 3200 : 7000, golden = Math.PI * (3 - Math.sqrt(5));
      for (i = 0; i < N; i++) {
        var y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = golden * i;
        pts.push(Math.cos(th) * rad * .95, y * .95, Math.sin(th) * rad * .95, Math.random());
      }
    } else {
      var G = small ? 70 : 120, Z = small ? 34 : 52;
      for (i = 0; i < G; i++) for (var j = 0; j < Z; j++) pts.push((i / (G - 1)) * 4.4 - 2.2, 0, (j / (Z - 1)) * 2.4 - 1.2, Math.random());
    }
    var count = pts.length / 4;
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
    var aP = gl.getAttribLocation(prog, "p"), aR = gl.getAttribLocation(prog, "r");
    gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aR); gl.vertexAttribPointer(aR, 1, gl.FLOAT, false, 16, 12);
    var U = {}; ["t", "sc", "asp", "mode", "dpr", "m"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.uniform1f(U.mode, mode);

    var dpr = Math.min(window.devicePixelRatio || 1, 1.75), mx = 0, my = 0, tx = 0, ty = 0, visible = true, start = performance.now();
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(U.asp, w / Math.max(h, 1)); gl.uniform1f(U.dpr, dpr);
    }
    resize(); window.addEventListener("resize", resize);
    if (finePointer) window.addEventListener("pointermove", function (e) { tx = (e.clientX / window.innerWidth - .5) * 2; ty = (e.clientY / window.innerHeight - .5) * 2; }, { passive: true });

    function frame(now) {
      var t = reduce ? 8 : (now - start) / 1000;
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      var host = canvas.parentElement.getBoundingClientRect();
      var sc = Math.min(1, Math.max(0, -host.top / Math.max(host.height, 1)));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.t, t); gl.uniform1f(U.sc, sc); gl.uniform2f(U.m, mx, my);
      gl.drawArrays(gl.POINTS, 0, count);
      if (!reduce && visible) requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var was = visible; visible = en[0].isIntersecting;
        if (visible && !was && !reduce) requestAnimationFrame(frame);
      }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { var was = visible; visible = !document.hidden; if (visible && !was && !reduce) requestAnimationFrame(frame); });
    requestAnimationFrame(frame);
  }

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
