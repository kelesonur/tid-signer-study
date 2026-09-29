/* TİD signer evaluation interface.
 *
 * Static single-page app. Stimuli come from stimuli.js (window.STUDY).
 * Responses are (1) kept in localStorage so a session can resume after a
 * reload, (2) posted event-by-event to a Google Apps Script endpoint when
 * STUDY.endpoint is set, and (3) downloadable as one JSON file at the end.
 *
 * URL parameters (all optional):
 *   ?pid=P07        participant code (otherwise asked on the first screen)
 *   &list=2         counterbalancing list (0-based; otherwise asked / derived)
 *   &mode=mod       moderator mode: notes fields, skip buttons, JSON export
 *   &lang=en        interface language (tr default)
 */
(function () {
  "use strict";

  const STUDY = window.STUDY;
  const app = document.getElementById("app");
  if (!STUDY) {
    app.innerHTML = '<div class="card error">stimuli.js bulunamadı / stimuli.js not found.</div>';
    return;
  }

  // ------------------------------------------------------------------ i18n
  const STR = {
    tr: {
      start_title: "Hoş geldiniz",
      pid: "Katılımcı kodu",
      list: "Liste (dengeleme)",
      mode: "Oturum türü",
      mode_self: "Katılımcı kendi başına",
      mode_mod: "Araştırmacı eşliğinde",
      begin: "Başla",
      resume: "Kaldığı yerden devam et",
      restart: "Baştan başla",
      resume_q: "Bu katılımcı kodu için kaydedilmiş bir oturum var.",
      next: "Devam",
      back: "Geri",
      consent_title: "Bilgilendirilmiş onam",
      consent_agree: "Bilgileri okudum / izledim ve çalışmaya katılmayı kabul ediyorum.",
      bg_title: "Sizi tanıyalım",
      instr_title: "Nasıl yapacağız?",
      practice: "Deneme",
      item: "Cümle",
      of: "/",
      watch_title: "Videoyu izleyin",
      watch_hint: "Videoyu istediğiniz kadar izleyebilirsiniz. Yavaşlatabilir ve tekrar oynatabilirsiniz.",
      play: "Oynat",
      pause: "Durdur",
      replay: "Baştan oynat",
      slow: "Yavaş (0.5x)",
      loop: "Tekrarla",
      plays: "İzlenme",
      watch_first: "Devam etmek için videoyu en az bir kez sonuna kadar izleyin.",
      understand_title: "Ne anladınız?",
      understand_q: "Videoda ne anlatıldığını Türkçe yazın. Kısa yazabilirsiniz.",
      understand_none: "Hiçbir şey anlamadım",
      conf_q: "Anladığınızdan ne kadar eminsiniz?",
      conf_lo: "Hiç emin değilim",
      conf_hi: "Çok eminim",
      rate_title: "Değerlendirin",
      source_label: "Asıl Türkçe cümle:",
      q_comp: "Bu çeviri ne kadar anlaşılır?",
      q_comp_lo: "Hiç anlaşılmıyor", q_comp_hi: "Çok kolay anlaşılıyor",
      q_adeq: "Türkçe cümlenin anlamını ne kadar iyi aktarıyor?",
      q_adeq_lo: "Hiç aktarmıyor", q_adeq_hi: "Tamamen aktarıyor",
      q_gram: "TİD dilbilgisine ne kadar uygun?",
      q_gram_lo: "Hiç uygun değil", q_gram_hi: "Tamamen uygun",
      q_nat: "Hareketler ne kadar doğal?",
      q_nat_lo: "Hiç doğal değil", q_nat_hi: "Çok doğal",
      tl_title: "İşaretler",
      tl_hint: "Bir işarete tıklayınca video o işareti oynatır. Sorunlu işaretleri işaretleyin.",
      tl_legend_fs: "parmak alfabesi",
      tl_legend_oov: "sözlükte yok, yerine benzer işaret",
      tl_legend_agr: "yön / uzam (fiil uyumu, gösterme)",
      tag_for: "Seçili işaret:",
      tag_note: "Açıklama (isteğe bağlı)",
      tag_add: "Sorunu kaydet",
      tag_none: "Henüz işaretlenmiş sorun yok.",
      tag_remove: "Sil",
      item_issues: "Cümlenin geneli",
      comment: "Başka yorumunuz var mı? (isteğe bağlı)",
      mod_notes: "Araştırmacı notu (katılımcının işaretle söylediği yorumlar, gözlemler)",
      skip: "Atla",
      need_ratings: "Lütfen dört soruyu da cevaplayın.",
      mode_expert: "Uzman değerlendirmesi",
      video_n: "Video",
      q_nm: "Yüz ifadeleri ve baş hareketleri ne kadar uygun?",
      q_nm_lo: "Hiç uygun değil", q_nm_hi: "Tamamen uygun",
      need_ratings_ex: "Lütfen beş soruyu da cevaplayın.",
      ex_watch: "Videoyu en az bir kez sonuna kadar izleyin, sonra puanlayın. İşaretlere tıklayarak tek tek tekrar izleyebilirsiniz.",
      ex_break: "İstediğiniz zaman ara verebilirsiniz. Aynı bağlantıyı açınca kaldığınız yerden devam edersiniz.",
      need_understand: "Lütfen ne anladığınızı yazın ya da \"Hiçbir şey anlamadım\" seçin.",
      pair_intro_title: "İkinci bölüm: karşılaştırma",
      pair_title: "Hangisi daha iyi?",
      pair_hint: "Aynı cümlenin iki çevirisini izleyin. Hangisi daha iyi?",
      play_both: "İkisini birlikte oynat",
      watch_both: "Devam etmek için iki videoyu da en az bir kez sonuna kadar izleyin.",
      pick_a: "A daha iyi", pick_eq: "Aynı", pick_b: "B daha iyi",
      why: "Neden? (birden fazla seçebilirsiniz)",
      need_pick: "Lütfen bir seçim yapın.",
      final_title: "Son sorular",
      done_title: "Teşekkür ederiz!",
      done_text: "Çalışma bitti. Katkınız için çok teşekkür ederiz.",
      download: "Yanıtları indir (JSON)",
      saved: "Kaydedildi",
      saving: "Gönderiliyor…",
      offline: "Çevrimdışı: yanıtlar bu cihazda saklanıyor",
      local_only: "Yanıtlar bu cihazda saklanıyor",
      required: "Bu alan gerekli.",
      optional: "isteğe bağlı",
      video_missing: "Video bulunamadı",
    },
    en: {
      start_title: "Welcome",
      pid: "Participant code",
      list: "List (counterbalancing)",
      mode: "Session type",
      mode_self: "Participant alone",
      mode_mod: "With researcher",
      begin: "Start",
      resume: "Resume",
      restart: "Start over",
      resume_q: "A saved session exists for this participant code.",
      next: "Continue",
      back: "Back",
      consent_title: "Informed consent",
      consent_agree: "I have read / watched the information and agree to take part.",
      bg_title: "About you",
      instr_title: "How it works",
      practice: "Practice",
      item: "Sentence",
      of: "/",
      watch_title: "Watch the video",
      watch_hint: "You can watch as often as you like, slow it down, and replay it.",
      play: "Play",
      pause: "Pause",
      replay: "Replay",
      slow: "Slow (0.5x)",
      loop: "Loop",
      plays: "Plays",
      watch_first: "Please watch the video to the end at least once.",
      understand_title: "What did you understand?",
      understand_q: "Write in Turkish what the video says. Short answers are fine.",
      understand_none: "I did not understand anything",
      conf_q: "How sure are you?",
      conf_lo: "Not sure at all",
      conf_hi: "Very sure",
      rate_title: "Rate",
      source_label: "Original Turkish sentence:",
      q_comp: "How easy is this translation to understand?",
      q_comp_lo: "Not at all", q_comp_hi: "Very easy",
      q_adeq: "How well does it convey the meaning of the Turkish sentence?",
      q_adeq_lo: "Not at all", q_adeq_hi: "Completely",
      q_gram: "How well does it follow TİD grammar?",
      q_gram_lo: "Not at all", q_gram_hi: "Completely",
      q_nat: "How natural is the movement?",
      q_nat_lo: "Not natural", q_nat_hi: "Very natural",
      tl_title: "Signs",
      tl_hint: "Click a sign to replay it. Mark signs that have problems.",
      tl_legend_fs: "fingerspelled",
      tl_legend_oov: "not in dictionary, similar sign used",
      tl_legend_agr: "direction / space (agreement, pointing)",
      tag_for: "Selected sign:",
      tag_note: "Explanation (optional)",
      tag_add: "Save problem",
      tag_none: "No problems marked yet.",
      tag_remove: "Remove",
      item_issues: "Whole sentence",
      comment: "Any other comments? (optional)",
      mod_notes: "Researcher notes (signed comments, observations)",
      skip: "Skip",
      need_ratings: "Please answer all four questions.",
      mode_expert: "Expert rating",
      video_n: "Video",
      q_nm: "How appropriate are the facial expressions and head movements?",
      q_nm_lo: "Not at all", q_nm_hi: "Completely",
      need_ratings_ex: "Please answer all five questions.",
      ex_watch: "Watch the video to the end at least once, then rate it. Click a sign to replay it on its own.",
      ex_break: "You can take a break at any time. Open the same link again to continue where you stopped.",
      need_understand: "Please write what you understood or tick \"I did not understand anything\".",
      pair_intro_title: "Part two: comparison",
      pair_title: "Which one is better?",
      pair_hint: "Watch two translations of the same sentence. Which one is better?",
      play_both: "Play both",
      watch_both: "Please watch both videos to the end at least once.",
      pick_a: "A is better", pick_eq: "Same", pick_b: "B is better",
      why: "Why? (choose any)",
      need_pick: "Please make a choice.",
      final_title: "Final questions",
      done_title: "Thank you!",
      done_text: "The study is complete. Thank you very much for your help.",
      download: "Download responses (JSON)",
      saved: "Saved",
      saving: "Sending…",
      offline: "Offline: responses kept on this device",
      local_only: "Responses kept on this device",
      required: "Required.",
      optional: "optional",
      video_missing: "Video not found",
    },
  };

  const SEG_TAGS = [
    ["wrong_sign", "Yanlış işaret", "Wrong sign"],
    ["unclear_sign", "Anlaşılmıyor", "Unclear"],
    ["handshape", "El şekli bozuk", "Handshape wrong"],
    ["direction", "Yön / uzam hatası", "Direction / space wrong"],
    ["order", "Sırası yanlış", "Wrong position"],
    ["extra", "Fazla / gereksiz", "Not needed"],
    ["fingerspell", "Parmak alfabesi sorunu", "Fingerspelling problem"],
    ["transition", "Geçiş doğal değil", "Unnatural transition"],
    ["speed", "Çok hızlı / çok yavaş", "Too fast / too slow"],
    ["other", "Diğer", "Other"],
  ];
  const ITEM_TAGS = [
    ["missing_sign", "Eksik işaret var", "A sign is missing"],
    ["meaning_wrong", "Anlam tamamen farklı", "Meaning is completely different"],
    ["nonmanual_missing", "Yüz ifadesi / baş hareketi eksik", "Facial expression / head movement missing"],
    ["word_order", "İşaret sırası TİD'e uygun değil", "Sign order is not TİD-like"],
    ["too_fast", "Çok hızlı", "Too fast"],
    ["looks_artificial", "Yapay görünüyor", "Looks artificial"],
  ];
  const PAIR_REASONS = [
    ["meaning", "Anlam daha doğru", "Meaning more accurate"],
    ["sign_choice", "İşaret seçimi daha doğru", "Better sign choice"],
    ["direction", "Yön / uzam kullanımı daha doğru", "Better use of direction / space"],
    ["clarity", "Daha anlaşılır", "Clearer"],
    ["fluency", "Daha akıcı", "More fluent"],
    ["fingerspell", "Parmak alfabesi daha az / daha iyi", "Less or better fingerspelling"],
    ["other", "Diğer", "Other"],
  ];

  // ---------------------------------------------------------------- params
  const params = new URLSearchParams(location.search);
  let lang = params.get("lang") === "en" ? "en" : "tr";
  const t = (k) => (STR[lang][k] !== undefined ? STR[lang][k] : k);
  const L = (obj) => {
    // pick a localized value from {tr, en} objects or plain strings
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.tr || obj.en || "";
  };
  const tagLabel = (row) => (lang === "en" ? row[2] : row[1]);

  // ----------------------------------------------------------------- utils
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
    }
    return el;
  }
  function hashStr(s) {
    let x = 2166136261;
    for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
    return x >>> 0;
  }
  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const now = () => new Date().toISOString();
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };

  // ----------------------------------------------------------------- state
  const S = {
    pid: params.get("pid") || "",
    list: params.has("list") ? parseInt(params.get("list"), 10) : null,
    mode: ["mod", "expert"].includes(params.get("mode")) ? params.get("mode") : "self",
    step: 0,
    plan: [],
    responses: [],   // every saved event, in order
    outbox: [],      // events not yet posted
    startedAt: null,
    userAgent: navigator.userAgent,
  };
  const storeKey = () => `tidstudy:${STUDY.studyId}:${S.pid}`;
  function persist() {
    store.set(storeKey(), {
      pid: S.pid, list: S.list, mode: S.mode, step: S.step, plan: S.plan,
      responses: S.responses, outbox: S.outbox, startedAt: S.startedAt, lang,
    });
  }

  // --------------------------------------------------------------- sending
  const saveStatus = document.getElementById("saveStatus");
  function setStatus(kind, text) { saveStatus.className = "save-status " + kind; saveStatus.textContent = text; }
  let flushing = false;
  async function flush() {
    if (!STUDY.endpoint) { setStatus("ok", t("local_only")); return; }
    if (flushing || !S.outbox.length) return;
    flushing = true;
    setStatus("pending", t("saving"));
    try {
      while (S.outbox.length) {
        const ev = S.outbox[0];
        // text/plain avoids a CORS preflight; Apps Script reads e.postData.contents
        await fetch(STUDY.endpoint, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(ev),
        });
        S.outbox.shift();
        persist();
      }
      setStatus("ok", t("saved"));
    } catch (e) {
      setStatus("err", t("offline"));
    } finally {
      flushing = false;
    }
  }
  window.addEventListener("online", flush);
  setInterval(flush, 30000);

  function record(type, data) {
    const ev = {
      type, study: STUDY.studyId, version: STUDY.version || "", pid: S.pid, list: S.list,
      mode: S.mode, lang, ts: now(), seq: S.responses.length, ...data,
    };
    S.responses.push(ev);
    S.outbox.push(ev);
    persist();
    flush();
    return ev;
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify({
      study: STUDY.studyId, version: STUDY.version, pid: S.pid, list: S.list, mode: S.mode,
      startedAt: S.startedAt, exportedAt: now(), userAgent: S.userAgent, responses: S.responses,
    }, null, 2)], { type: "application/json" });
    const a = h("a", { href: URL.createObjectURL(blob), download: `tidstudy_${STUDY.studyId}_${S.pid}.json` });
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ------------------------------------------------------------ study plan
  const items = STUDY.items || [];
  const itemById = Object.fromEntries(items.map((it) => [it.id, it]));
  const nLists = () => (STUDY.design && STUDY.design.block1Conditions ? STUDY.design.block1Conditions.length : 1);

  function conditionFor(item, idx) {
    const conds = STUDY.design.block1Conditions;
    for (let k = 0; k < conds.length; k++) {
      const c = conds[(idx + S.list + k) % conds.length];
      if (item.conditions && item.conditions[c] && item.conditions[c].video) return c;
    }
    return Object.keys(item.conditions || {})[0];
  }

  // Expert panel (29 Sep 2026): every expert rates every sentence in every condition
  // (design.expertConditions: avatar, gold, retarget, reference). The videos come in
  // rounds; each round shows each sentence once, so the versions of one sentence are
  // about a round apart. The condition of a sentence rotates over the rounds
  // (Latin square), sentences are shuffled within a round, and the same sentence never
  // appears twice in a row. The order differs between experts (seeded by the code).
  const EXPERT = () => (STUDY.expert || {});
  function buildExpertPlan() {
    const rand = rng(hashStr(S.pid + "|expert|" + STUDY.studyId));
    const conds = (STUDY.design && STUDY.design.expertConditions) || [];
    const plan = [{ kind: "consent" }, { kind: "background" }, { kind: "instructions" }];
    (STUDY.practice || []).forEach((it, i) => {
      plan.push({ kind: "exitem", practice: true, itemId: it.id, condition: Object.keys(it.conditions)[0], n: i + 1, total: STUDY.practice.length });
    });
    const offset = Math.floor(rand() * Math.max(conds.length, 1));
    const vids = [];
    let prev = null;
    for (let r = 0; r < conds.length; r++) {
      let round = [];
      items.forEach((it, i) => {
        // the condition this sentence gets in this round; skip versions that were not built
        const c = conds[(i + r + offset) % conds.length];
        if (it.conditions && it.conditions[c] && it.conditions[c].video) round.push({ it, c });
      });
      // shuffle the round so that none of the last 6 sentences of the previous round is
      // among its first 6 (versions of a sentence stay at least ~6 videos apart)
      const tail = new Set(prev || []);
      let best = null;
      for (let tries = 0; tries < 300; tries++) {
        const cand = shuffle(round, rand);
        const clash = cand.slice(0, 6).filter((x) => tail.has(x.it.id)).length;
        if (!best || clash < best.clash) best = { cand, clash };
        if (!clash) break;
      }
      round = best ? best.cand : round;
      round.forEach((x) => vids.push(x));
      prev = round.slice(-6).map((x) => x.it.id);
    }
    vids.forEach((x, i) => plan.push({ kind: "exitem", itemId: x.it.id, condition: x.c, n: i + 1, total: vids.length }));
    plan.push({ kind: "final" }, { kind: "done" });
    return plan;
  }

  function buildPlan() {
    if (S.mode === "expert") return buildExpertPlan();
    const rand = rng(hashStr(S.pid + "|" + STUDY.studyId));
    const plan = [{ kind: "consent" }, { kind: "background" }, { kind: "instructions" }];
    (STUDY.practice || []).forEach((it, i) => {
      plan.push({ kind: "item", practice: true, itemId: it.id, condition: Object.keys(it.conditions)[0], n: i + 1, total: STUDY.practice.length });
    });
    // block 1: every participant sees each sentence once; condition rotates by list
    const order = STUDY.design.randomizeItems === false ? items.slice() : shuffle(items, rand);
    order.forEach((it, i) => {
      const originalIdx = items.indexOf(it);
      plan.push({ kind: "item", itemId: it.id, condition: conditionFor(it, originalIdx), n: i + 1, total: order.length });
    });
    // block 2: pairwise ablation comparisons, A/B side randomised
    const pairs = STUDY.pairs || [];
    if (pairs.length) {
      plan.push({ kind: "pairIntro" });
      shuffle(pairs, rand).forEach((p, i) => {
        plan.push({ kind: "pair", pairId: p.id, swap: rand() < 0.5, n: i + 1, total: pairs.length });
      });
    }
    plan.push({ kind: "final" }, { kind: "done" });
    return plan;
  }

  // -------------------------------------------------------------- progress
  function updateProgress() {
    const total = S.plan.length || 1;
    document.getElementById("progressBar").style.width = `${Math.round((100 * S.step) / (total - 1 || 1))}%`;
    const st = S.plan[S.step];
    let label = "";
    if (st && st.kind === "item") label = `${st.practice ? t("practice") : t("item")} ${st.n} ${t("of")} ${st.total}`;
    else if (st && st.kind === "exitem") label = `${st.practice ? t("practice") : t("video_n")} ${st.n} ${t("of")} ${st.total}`;
    else if (st && st.kind === "pair") label = `${t("pair_title")} ${st.n} ${t("of")} ${st.total}`;
    document.getElementById("progressLabel").textContent = label;
    document.getElementById("pidLabel").textContent = S.pid ? (S.mode === "expert" ? `${S.pid} · expert` : `${S.pid} · L${S.list}${S.mode === "mod" ? " · mod" : ""}`) : "";
  }

  function go(delta) {
    S.step = Math.max(0, Math.min(S.plan.length - 1, S.step + delta));
    persist();
    render();
  }

  // ------------------------------------------------------------ components
  function videoBlock(src, opts = {}) {
    const state = { plays: 0, ended: 0, slowUsed: false, loopUsed: false, segPlays: 0 };
    const video = h("video", { playsinline: true, preload: "auto", muted: true });
    if (src) video.src = src;
    const wrap = h("div", { class: "player" }, video);
    video.addEventListener("error", () => {
      wrap.appendChild(h("div", { class: "cover", text: `${t("video_missing")}: ${src || ""}` }));
    });
    const countEl = h("span", { class: "count" });
    const updateCount = () => { countEl.textContent = `${t("plays")}: ${state.plays}`; };
    let stopAt = null;
    video.addEventListener("play", () => { if (stopAt == null && video.currentTime < 0.05) { state.plays++; updateCount(); } });
    video.addEventListener("ended", () => { state.ended++; if (opts.onEnded) opts.onEnded(state); });
    video.addEventListener("timeupdate", () => {
      if (stopAt != null && video.currentTime >= stopAt) { video.pause(); stopAt = null; }
      if (opts.onTime) opts.onTime(video.currentTime);
    });
    const playBtn = h("button", { type: "button", class: "primary", onclick: () => {
      stopAt = null;
      if (video.paused) { if (video.ended) video.currentTime = 0; video.play(); } else video.pause();
    } }, t("play"));
    video.addEventListener("play", () => { playBtn.textContent = t("pause"); });
    video.addEventListener("pause", () => { playBtn.textContent = t("play"); });
    const replayBtn = h("button", { type: "button", onclick: () => { stopAt = null; video.currentTime = 0; video.play(); } }, t("replay"));
    const slowBtn = h("button", { type: "button", class: "chip", "aria-pressed": "false", onclick: () => {
      const on = slowBtn.getAttribute("aria-pressed") !== "true";
      slowBtn.setAttribute("aria-pressed", String(on));
      video.playbackRate = on ? 0.5 : 1; if (on) state.slowUsed = true;
    } }, t("slow"));
    const loopBtn = h("button", { type: "button", class: "chip", "aria-pressed": "false", onclick: () => {
      const on = loopBtn.getAttribute("aria-pressed") !== "true";
      loopBtn.setAttribute("aria-pressed", String(on)); video.loop = on; if (on) state.loopUsed = true;
    } }, t("loop"));
    video.addEventListener("click", () => playBtn.click());
    updateCount();
    const controls = h("div", { class: "controls" }, playBtn, replayBtn, slowBtn, loopBtn, h("span", { class: "spacer" }), countEl);
    const el = h("div", null, wrap, controls);
    return {
      el, video, state,
      playSegment(start, end) {
        stopAt = end; state.segPlays++;
        video.loop = false; loopBtn.setAttribute("aria-pressed", "false");
        video.currentTime = start; video.play();
      },
      destroy() { video.pause(); video.removeAttribute("src"); video.load(); },
    };
  }

  function scale(key, qKey, loKey, hiKey, value, onChange) {
    const btns = [];
    const opts = h("div", { class: "opts", role: "radiogroup", "aria-label": t(qKey) });
    for (let v = 1; v <= 7; v++) {
      const b = h("button", { type: "button", "aria-pressed": String(value === v), onclick: () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true"); onChange(v);
      } }, String(v));
      btns.push(b); opts.appendChild(b);
    }
    return h("div", { class: "scale", "data-key": key },
      h("div", { class: "q" }, t(qKey)), opts,
      h("div", { class: "ends" }, h("span", null, "1 = " + t(loKey)), h("span", null, "7 = " + t(hiKey))));
  }

  function chipGroup(rows, selected, onToggle) {
    return h("div", { class: "tags" }, rows.map((row) => {
      const b = h("button", { type: "button", class: "chip", "aria-pressed": String(selected.has(row[0])), onclick: () => {
        if (selected.has(row[0])) selected.delete(row[0]); else selected.add(row[0]);
        b.setAttribute("aria-pressed", String(selected.has(row[0])));
        if (onToggle) onToggle();
      } }, tagLabel(row));
      return b;
    }));
  }

  function formQuestion(q, answers) {
    // q: {id, type: 'radio'|'text'|'textarea'|'select', label:{tr,en}, options:[{value,label}], required}
    const wrap = h("label", { class: "field", "data-q": q.id });
    wrap.appendChild(h("span", null, L(q.label), q.required ? "" : h("small", { class: "muted" }, ` (${t("optional")})`)));
    if (q.type === "radio") {
      const row = h("div", { class: "radio-row" });
      q.options.forEach((o) => {
        const inp = h("input", { type: "radio", name: q.id, value: o.value, checked: answers[q.id] === o.value });
        inp.addEventListener("change", () => { answers[q.id] = o.value; });
        row.appendChild(h("label", null, inp, L(o.label)));
      });
      wrap.appendChild(row);
    } else if (q.type === "textarea") {
      const ta = h("textarea", null); ta.value = answers[q.id] || "";
      ta.addEventListener("input", () => { answers[q.id] = ta.value; });
      wrap.appendChild(ta);
    } else {
      const inp = h("input", { type: "text" }); inp.value = answers[q.id] || "";
      inp.addEventListener("input", () => { answers[q.id] = inp.value; });
      wrap.appendChild(inp);
    }
    return wrap;
  }

  function validateForm(questions, answers, root) {
    let ok = true;
    root.querySelectorAll(".field .error").forEach((e) => e.remove());
    questions.forEach((q) => {
      if (q.required && !(answers[q.id] && String(answers[q.id]).trim())) {
        ok = false;
        const f = root.querySelector(`[data-q="${q.id}"]`);
        if (f) f.appendChild(h("div", { class: "error" }, t("required")));
      }
    });
    return ok;
  }

  function optionalVideo(src) {
    if (!src) return null;
    const vb = videoBlock(src);
    return h("div", { style: "max-width:720px;margin:10px 0" }, vb.el);
  }

  // --------------------------------------------------------------- screens
  let cleanup = [];
  function render() {
    cleanup.forEach((f) => { try { f(); } catch (e) { /* ignore */ } });
    cleanup = [];
    app.innerHTML = "";
    updateProgress();
    const st = S.plan[S.step];
    if (!st) return renderStart();
    const fn = { consent: renderConsent, background: renderBackground, instructions: renderInstructions,
      item: renderItem, exitem: renderExpertItem, pairIntro: renderPairIntro, pair: renderPair, final: renderFinal, done: renderDone }[st.kind];
    fn(st);
    app.focus();
    window.scrollTo(0, 0);
  }

  function renderStart() {
    const card = h("div", { class: "card" }, h("h1", null, L(STUDY.title) || t("start_title")));
    if (STUDY.welcome) card.appendChild(h("p", null, L(STUDY.welcome)));
    const pid = h("input", { type: "text", value: S.pid, autocomplete: "off" });
    const list = h("select", null, Array.from({ length: nLists() }, (_, i) => h("option", { value: String(i) }, `L${i}`)));
    const modeSel = h("select", null, h("option", { value: "self" }, t("mode_self")), h("option", { value: "mod" }, t("mode_mod")), h("option", { value: "expert" }, t("mode_expert")));
    modeSel.value = S.mode;
    const err = h("div", { class: "error" });
    card.append(
      h("label", { class: "field" }, h("span", null, t("pid")), pid),
      h("label", { class: "field" }, h("span", null, t("list")), list, h("small", { class: "muted" }, "P01→L0, P02→L1, …")),
      h("label", { class: "field" }, h("span", null, t("mode")), modeSel), err);
    pid.addEventListener("input", () => {
      const m = pid.value.match(/(\d+)\s*$/);
      if (m) list.value = String((parseInt(m[1], 10) - 1 + nLists()) % nLists());
    });
    if (S.list != null) list.value = String(S.list);
    const start = () => {
      const code = pid.value.trim();
      if (!code) { err.textContent = t("required"); return; }
      S.pid = code; S.list = parseInt(list.value, 10); S.mode = modeSel.value;
      begin();
    };
    card.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "primary", onclick: start }, t("begin"))));
    app.appendChild(card);
    pid.focus();
  }

  function begin() {
    const saved = store.get(storeKey());
    if (saved && saved.plan && saved.plan.length && saved.step > 0) {
      app.innerHTML = "";
      const card = h("div", { class: "card" }, h("p", null, t("resume_q")),
        h("div", { class: "actions" },
          h("button", { type: "button", onclick: () => { store.del(storeKey()); fresh(); } }, t("restart")),
          h("button", { type: "button", class: "primary", onclick: () => {
            Object.assign(S, { list: saved.list, mode: saved.mode, step: saved.step, plan: saved.plan,
              responses: saved.responses || [], outbox: saved.outbox || [], startedAt: saved.startedAt });
            render(); flush();
          } }, t("resume"))));
      app.appendChild(card);
      return;
    }
    fresh();
  }
  function fresh() {
    S.plan = buildPlan(); S.step = 0; S.responses = []; S.outbox = []; S.startedAt = now();
    record("session_start", { screen: `${screen.width}x${screen.height}`, userAgent: S.userAgent,
      plan: S.plan.filter((p) => p.kind === "item" || p.kind === "pair" || p.kind === "exitem") });
    render();
  }

  function renderConsent() {
    const card = h("div", { class: "card" }, h("h1", null, t("consent_title")));
    const c = (S.mode === "expert" && EXPERT().consent) || STUDY.consent || {};
    const vid = optionalVideo(c.video); if (vid) card.appendChild(vid);
    (L(c.text) || "").split(/\n\n+/).forEach((p) => card.appendChild(h("p", null, p)));
    const cb = h("input", { type: "checkbox" });
    const next = h("button", { type: "button", class: "primary", disabled: true, onclick: () => {
      record("consent", { agreed: true }); go(1);
    } }, t("next"));
    cb.addEventListener("change", () => { next.disabled = !cb.checked; });
    card.append(h("label", { class: "field" }, h("span", null, cb, " ", t("consent_agree"))), h("div", { class: "actions" }, next));
    app.appendChild(card);
  }

  function renderBackground() {
    const qs = (S.mode === "expert" && EXPERT().background) || STUDY.background || [];
    const answers = {};
    const card = h("div", { class: "card" }, h("h1", null, t("bg_title")));
    qs.forEach((q) => card.appendChild(formQuestion(q, answers)));
    card.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "primary", onclick: () => {
      if (!validateForm(qs, answers, card) && S.mode !== "mod") return;
      record("background", { answers }); go(1);
    } }, t("next"))));
    app.appendChild(card);
  }

  function renderInstructions() {
    const ins = (S.mode === "expert" && EXPERT().instructions) || STUDY.instructions || {};
    const card = h("div", { class: "card" }, h("h1", null, t("instr_title")));
    const vid = optionalVideo(ins.video); if (vid) card.appendChild(vid);
    (L(ins.text) || "").split(/\n\n+/).forEach((p) => card.appendChild(h("p", null, p)));
    card.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "primary", onclick: () => go(1) }, t("next"))));
    app.appendChild(card);
  }

  function segClass(seg) {
    if (seg.kind != null) return seg.kind;
    const s = String(seg.strategy || "").toLowerCase();
    if (s.includes("fingerspell")) return "fs";
    if (s.includes("agr") || s.includes("ix")) return "agr";
    if (s.includes("synonym") || s.includes("snn") || s.includes("sense") || s.includes("context") || s.includes("normal")) return "oov";
    return "";
  }

  function renderItem(st) {
    const item = st.practice ? (STUDY.practice || []).find((p) => p.id === st.itemId) : itemById[st.itemId];
    const cond = item.conditions[st.condition] || {};
    const R = {
      itemId: item.id, condition: st.condition, practice: !!st.practice, category: item.category || "",
      understood: "", understoodNone: false, confidence: null,
      ratings: { comp: null, adeq: null, gram: null, nat: null },
      segTags: [], itemTags: [], comment: "", modNotes: "",
      t_start: now(), t_understand: null, t_reveal: null, t_submit: null,
    };
    let phase = "watch";
    let ended = false;

    const head = h("h1", null, `${st.practice ? t("practice") : t("item")} ${st.n}`);
    const vb = videoBlock(cond.video, { onEnded: () => { ended = true; refreshNext(); }, onTime: (tt) => highlight(tt) });
    cleanup.push(() => vb.destroy());

    const left = h("div", null, vb.el);
    const right = h("div", null);
    const layout = h("div", { class: "grid2" }, left, right);
    const card = h("div", { class: "card" }, head, h("p", { class: "muted" }, t("watch_hint")), layout);
    app.appendChild(card);

    // timeline (revealed in the rating phase)
    const segs = cond.segments || [];
    const segEls = [];
    let selected = -1;
    const timeline = h("div", { class: "timeline hidden" });
    const tagPanel = h("div", { class: "tagbox hidden" });
    const tlWrap = h("div", { class: "hidden" }, h("h3", null, t("tl_title")), h("p", { class: "muted" }, t("tl_hint")), timeline,
      h("div", { class: "legend" },
        h("span", null, h("i", { class: "fs" }), t("tl_legend_fs")),
        h("span", null, h("i", { class: "oov" }), t("tl_legend_oov")),
        h("span", null, h("i", { class: "agr" }), t("tl_legend_agr"))),
      tagPanel);
    left.appendChild(tlWrap);
    segs.forEach((sg, i) => {
      const el = h("button", { type: "button", class: `seg ${segClass(sg)}`, title: sg.strategy || "", onclick: () => {
        selected = i; segEls.forEach((x, j) => x.classList.toggle("selected", j === i));
        vb.playSegment(sg.start, sg.end); showTagPanel();
      } }, h("div", { class: "g" }, sg.gloss));
      segEls.push(el); timeline.appendChild(el);
    });
    function highlight(tt) {
      segs.forEach((sg, i) => segEls[i].classList.toggle("playing", tt >= sg.start && tt < sg.end));
    }
    function refreshSegTagMarks() {
      segEls.forEach((el, i) => el.classList.toggle("tagged", R.segTags.some((x) => x.segIndex === i)));
    }
    function showTagPanel() {
      tagPanel.classList.remove("hidden");
      tagPanel.innerHTML = "";
      const sg = segs[selected];
      const chosen = new Set();
      const note = h("input", { type: "text", placeholder: t("tag_note") });
      tagPanel.append(h("div", null, h("strong", null, t("tag_for") + " "), sg.gloss),
        chipGroup(SEG_TAGS, chosen), note,
        h("div", { class: "actions" }, h("button", { type: "button", onclick: () => {
          if (!chosen.size) return;
          R.segTags.push({ segIndex: selected, gloss: sg.gloss, strategy: sg.strategy || "", tags: [...chosen], note: note.value, ts: now() });
          renderTagList(); refreshSegTagMarks(); showTagPanel();
        } }, t("tag_add"))), tagList);
      renderTagList();
    }
    const tagList = h("ul", { class: "taglist" });
    function renderTagList() {
      tagList.innerHTML = "";
      if (!R.segTags.length) { tagList.appendChild(h("li", { class: "muted" }, t("tag_none"))); return; }
      R.segTags.forEach((x, k) => {
        const labels = x.tags.map((id) => tagLabel(SEG_TAGS.find((r) => r[0] === id))).join(", ");
        tagList.appendChild(h("li", null, h("span", null, h("strong", null, x.gloss), ": ", labels, x.note ? ` — ${x.note}` : ""),
          h("button", { type: "button", class: "link", onclick: () => { R.segTags.splice(k, 1); renderTagList(); refreshSegTagMarks(); } }, t("tag_remove"))));
      });
    }

    const nextBtn = h("button", { type: "button", class: "primary" }, t("next"));
    const msg = h("div", { class: "error" });
    const actions = h("div", { class: "actions" });
    if (S.mode === "mod") actions.appendChild(h("button", { type: "button", onclick: () => { record("item_skipped", { itemId: item.id, condition: st.condition, phase }); go(1); } }, t("skip")));
    actions.appendChild(nextBtn);
    function refreshNext() {
      if (phase === "watch") nextBtn.disabled = !(ended || S.mode === "mod");
    }

    // phase: watch
    right.append(h("h2", null, t("watch_title")), h("p", { class: "muted" }, t("watch_first")), msg, actions);
    refreshNext();

    nextBtn.addEventListener("click", () => {
      msg.textContent = "";
      if (phase === "watch") { phase = "understand"; showUnderstand(); }
      else if (phase === "understand") {
        if (!R.understoodNone && !R.understood.trim()) { msg.textContent = t("need_understand"); return; }
        if (R.confidence == null && !R.understoodNone) { msg.textContent = t("need_understand"); return; }
        R.t_understand = now(); phase = "rate"; showRate();
      } else if (phase === "rate") {
        const r = R.ratings;
        if ([r.comp, r.adeq, r.gram, r.nat].some((v) => v == null) && S.mode !== "mod") { msg.textContent = t("need_ratings"); return; }
        R.t_submit = now();
        R.video = { plays: vb.state.plays, ended: vb.state.ended, slowUsed: vb.state.slowUsed, loopUsed: vb.state.loopUsed, segPlays: vb.state.segPlays };
        record("item", { ...R, turkish: item.turkish, videoSrc: cond.video || "" });
        go(1);
      }
    });

    function showUnderstand() {
      right.innerHTML = "";
      const ta = h("textarea", { "aria-label": t("understand_q") });
      ta.addEventListener("input", () => { R.understood = ta.value; });
      const none = h("input", { type: "checkbox" });
      none.addEventListener("change", () => { R.understoodNone = none.checked; ta.disabled = none.checked; });
      right.append(h("h2", null, t("understand_title")), h("label", { class: "field" }, h("span", null, t("understand_q")), ta),
        h("label", { class: "field" }, h("span", null, none, " ", t("understand_none"))),
        scale("conf", "conf_q", "conf_lo", "conf_hi", null, (v) => { R.confidence = v; }), msg, actions);
      ta.focus();
    }

    function showRate() {
      R.t_reveal = now();
      right.innerHTML = "";
      tlWrap.classList.toggle("hidden", !segs.length);
      timeline.classList.remove("hidden");
      const itemChosen = new Set();
      const comment = h("textarea", null);
      comment.addEventListener("input", () => { R.comment = comment.value; });
      right.append(
        h("h2", null, t("rate_title")),
        h("div", { class: "source" }, h("div", { class: "muted", style: "font-size:.85rem" }, t("source_label")), item.turkish),
        scale("comp", "q_comp", "q_comp_lo", "q_comp_hi", null, (v) => { R.ratings.comp = v; }),
        scale("adeq", "q_adeq", "q_adeq_lo", "q_adeq_hi", null, (v) => { R.ratings.adeq = v; }),
        scale("gram", "q_gram", "q_gram_lo", "q_gram_hi", null, (v) => { R.ratings.gram = v; }),
        scale("nat", "q_nat", "q_nat_lo", "q_nat_hi", null, (v) => { R.ratings.nat = v; }),
        h("h3", null, t("item_issues")),
        chipGroup(ITEM_TAGS, itemChosen, () => { R.itemTags = [...itemChosen]; }),
        h("label", { class: "field" }, h("span", null, t("comment")), comment));
      if (S.mode === "mod") {
        const mn = h("textarea", null); mn.addEventListener("input", () => { R.modNotes = mn.value; });
        right.appendChild(h("label", { class: "field moderator" }, h("span", null, t("mod_notes")), mn));
      }
      right.append(msg, actions);
      right.addEventListener("click", () => {
        const r = R.ratings;
        if (![r.comp, r.adeq, r.gram, r.nat].some((v) => v == null)) msg.textContent = "";
      });
    }
  }

  // Expert screen: the Turkish sentence is shown from the start (no comprehension step);
  // five 7-point ratings, the sign list with problem tags (when the video has one) and
  // sentence-level tags. The condition is not shown to the expert.
  function renderExpertItem(st) {
    const item = st.practice ? (STUDY.practice || []).find((p) => p.id === st.itemId) : itemById[st.itemId];
    const cond = item.conditions[st.condition] || {};
    const R = {
      itemId: item.id, condition: st.condition, practice: !!st.practice, category: item.category || "", n: st.n,
      ratings: { comp: null, adeq: null, gram: null, nat: null, nm: null },
      segTags: [], itemTags: [], comment: "", t_start: now(), t_submit: null,
    };
    let ended = false;
    const vb = videoBlock(cond.video, { onEnded: () => { ended = true; refresh(); }, onTime: (tt) => highlight(tt) });
    cleanup.push(() => vb.destroy());
    const left = h("div", null, vb.el);
    const right = h("div", null);
    const card = h("div", { class: "card" },
      h("h1", null, `${st.practice ? t("practice") : t("video_n")} ${st.n}${st.practice ? "" : " / " + st.total}`),
      h("div", { class: "source" }, h("div", { class: "muted", style: "font-size:.85rem" }, t("source_label")), item.turkish),
      h("p", { class: "muted" }, t("ex_watch")),
      h("div", { class: "grid2" }, left, right));
    app.appendChild(card);
    // sign list with problem tags
    const segs = cond.segments || [];
    const segEls = [];
    let selected = -1;
    const timeline = h("div", { class: "timeline" });
    const tagPanel = h("div", { class: "tagbox hidden" });
    const tagList = h("ul", { class: "taglist" });
    if (segs.length) {
      left.appendChild(h("div", null, h("h3", null, t("tl_title")), h("p", { class: "muted" }, t("tl_hint")), timeline, tagPanel));
    }
    segs.forEach((sg, i) => {
      const el = h("button", { type: "button", class: "seg", onclick: () => {
        selected = i; segEls.forEach((x, j) => x.classList.toggle("selected", j === i));
        vb.playSegment(sg.start, sg.end); showTagPanel();
      } }, h("div", { class: "g" }, sg.gloss));
      segEls.push(el); timeline.appendChild(el);
    });
    function highlight(tt) { segs.forEach((sg, i) => segEls[i].classList.toggle("playing", tt >= sg.start && tt < sg.end)); }
    function marks() { segEls.forEach((el, i) => el.classList.toggle("tagged", R.segTags.some((x) => x.segIndex === i))); }
    function renderTagList() {
      tagList.innerHTML = "";
      if (!R.segTags.length) { tagList.appendChild(h("li", { class: "muted" }, t("tag_none"))); return; }
      R.segTags.forEach((x, k) => {
        const labels = x.tags.map((id) => tagLabel(SEG_TAGS.find((r) => r[0] === id))).join(", ");
        tagList.appendChild(h("li", null, h("span", null, h("strong", null, x.gloss), ": ", labels, x.note ? ` (${x.note})` : ""),
          h("button", { type: "button", class: "link", onclick: () => { R.segTags.splice(k, 1); renderTagList(); marks(); } }, t("tag_remove"))));
      });
    }
    function showTagPanel() {
      tagPanel.classList.remove("hidden"); tagPanel.innerHTML = "";
      const sg = segs[selected]; const chosen = new Set();
      const note = h("input", { type: "text", placeholder: t("tag_note") });
      tagPanel.append(h("div", null, h("strong", null, t("tag_for") + " "), sg.gloss), chipGroup(SEG_TAGS, chosen), note,
        h("div", { class: "actions" }, h("button", { type: "button", onclick: () => {
          if (!chosen.size) return;
          R.segTags.push({ segIndex: selected, gloss: sg.gloss, strategy: sg.strategy || "", tags: [...chosen], note: note.value, ts: now() });
          renderTagList(); marks(); showTagPanel();
        } }, t("tag_add"))), tagList);
      renderTagList();
    }
    // ratings
    const itemChosen = new Set();
    const comment = h("textarea", null);
    comment.addEventListener("input", () => { R.comment = comment.value; });
    const msg = h("div", { class: "error" });
    const nextBtn = h("button", { type: "button", class: "primary" }, t("next"));
    const canSkip = params.get("skip") === "1";
    const actions = h("div", { class: "actions" });
    if (canSkip) actions.appendChild(h("button", { type: "button", onclick: () => { record("expert_item_skipped", { itemId: item.id, condition: st.condition }); go(1); } }, t("skip")));
    actions.appendChild(nextBtn);
    right.append(
      h("h2", null, t("rate_title")),
      scale("comp", "q_comp", "q_comp_lo", "q_comp_hi", null, (v) => { R.ratings.comp = v; }),
      scale("adeq", "q_adeq", "q_adeq_lo", "q_adeq_hi", null, (v) => { R.ratings.adeq = v; }),
      scale("gram", "q_gram", "q_gram_lo", "q_gram_hi", null, (v) => { R.ratings.gram = v; }),
      scale("nat", "q_nat", "q_nat_lo", "q_nat_hi", null, (v) => { R.ratings.nat = v; }),
      scale("nm", "q_nm", "q_nm_lo", "q_nm_hi", null, (v) => { R.ratings.nm = v; }),
      h("h3", null, t("item_issues")),
      chipGroup(ITEM_TAGS, itemChosen, () => { R.itemTags = [...itemChosen]; }),
      h("label", { class: "field" }, h("span", null, t("comment")), comment),
      h("p", { class: "muted" }, t("ex_break")), msg, actions);
    function refresh() { nextBtn.disabled = !(ended || canSkip); }
    refresh();
    nextBtn.addEventListener("click", () => {
      const r = R.ratings;
      if (Object.values(r).some((v) => v == null)) { msg.textContent = t("need_ratings_ex"); return; }
      R.t_submit = now();
      R.video = { plays: vb.state.plays, ended: vb.state.ended, slowUsed: vb.state.slowUsed, loopUsed: vb.state.loopUsed, segPlays: vb.state.segPlays };
      record("expert_item", { ...R, turkish: item.turkish, videoSrc: cond.video || "" });
      go(1);
    });
  }

  function renderPairIntro() {
    const p = STUDY.pairIntro || {};
    const card = h("div", { class: "card" }, h("h1", null, t("pair_intro_title")));
    const vid = optionalVideo(p.video); if (vid) card.appendChild(vid);
    (L(p.text) || t("pair_hint")).split(/\n\n+/).forEach((x) => card.appendChild(h("p", null, x)));
    card.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "primary", onclick: () => go(1) }, t("next"))));
    app.appendChild(card);
  }

  function renderPair(st) {
    const pair = (STUDY.pairs || []).find((p) => p.id === st.pairId);
    const left = st.swap ? pair.b : pair.a;
    const right = st.swap ? pair.a : pair.b;
    const R = { pairId: pair.id, itemId: pair.itemId || "", ablation: pair.ablation || "", swap: st.swap,
      leftCondition: left.label, rightCondition: right.label, choice: null, preferred: null, reasons: [], comment: "", modNotes: "", t_start: now() };
    const va = videoBlock(left.video, { onEnded: () => refreshPairNext() });
    const vbb = videoBlock(right.video, { onEnded: () => refreshPairNext() });
    cleanup.push(() => va.destroy(), () => vbb.destroy());
    const choiceBtns = [];
    const choice = h("div", { class: "choice" }, [["A", "pick_a"], ["=", "pick_eq"], ["B", "pick_b"]].map(([v, k]) => {
      const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => {
        choiceBtns.forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true");
        R.choice = v;
        R.preferred = v === "=" ? "equal" : (v === "A" ? left.label : right.label);
      } }, t(k));
      choiceBtns.push(b); return b;
    }));
    const reasons = new Set();
    const comment = h("textarea", null); comment.addEventListener("input", () => { R.comment = comment.value; });
    const msg = h("div", { class: "error" });
    const card = h("div", { class: "card" },
      h("h1", null, `${t("pair_title")} (${st.n}/${st.total})`),
      h("div", { class: "source" }, h("div", { class: "muted", style: "font-size:.85rem" }, t("source_label")), pair.turkish),
      h("p", { class: "muted" }, t("pair_hint")),
      h("div", { class: "actions", style: "justify-content:flex-start" }, h("button", { type: "button", onclick: () => {
        [va, vbb].forEach((v) => { v.video.currentTime = 0; v.video.play(); });
      } }, t("play_both"))),
      h("div", { class: "pair" }, h("div", null, h("div", { class: "label" }, "A"), va.el), h("div", null, h("div", { class: "label" }, "B"), vbb.el)),
      choice,
      h("h3", null, t("why")), chipGroup(PAIR_REASONS, reasons, () => { R.reasons = [...reasons]; }),
      h("label", { class: "field" }, h("span", null, t("comment")), comment));
    if (S.mode === "mod") {
      const mn = h("textarea", null); mn.addEventListener("input", () => { R.modNotes = mn.value; });
      card.appendChild(h("label", { class: "field moderator" }, h("span", null, t("mod_notes")), mn));
    }
    const actions = h("div", { class: "actions" });
    if (S.mode === "mod") actions.appendChild(h("button", { type: "button", onclick: () => { record("pair_skipped", { pairId: pair.id }); go(1); } }, t("skip")));
    const pairNext = h("button", { type: "button", class: "primary", onclick: () => {
      if (!R.choice) { msg.textContent = t("need_pick"); return; }
      R.t_submit = now();
      R.video = { leftPlays: va.state.plays, rightPlays: vbb.state.plays };
      record("pair", R); go(1);
    } }, t("next"));
    actions.appendChild(pairNext);
    function refreshPairNext() {
      const watched = va.state.ended > 0 && vbb.state.ended > 0;
      pairNext.disabled = !(watched || S.mode === "mod");
      pairHint.classList.toggle("hidden", watched || S.mode === "mod");
    }
    const pairHint = h("p", { class: "muted" }, t("watch_both"));
    card.append(pairHint, msg, actions);
    refreshPairNext();
    app.appendChild(card);
  }

  function renderFinal() {
    const qs = (S.mode === "expert" && EXPERT().finalQuestions) || STUDY.finalQuestions || [];
    const answers = {};
    const card = h("div", { class: "card" }, h("h1", null, t("final_title")));
    qs.forEach((q) => card.appendChild(formQuestion(q, answers)));
    card.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "primary", onclick: () => {
      if (!validateForm(qs, answers, card) && S.mode !== "mod") return;
      record("final", { answers });
      record("session_end", { startedAt: S.startedAt, nEvents: S.responses.length });
      go(1);
    } }, t("next"))));
    app.appendChild(card);
  }

  function renderDone() {
    const card = h("div", { class: "card" }, h("h1", null, t("done_title")), h("p", null, t("done_text")));
    const vid = optionalVideo(STUDY.thanksVideo); if (vid) card.appendChild(vid);
    card.appendChild(h("div", { class: "actions", style: "justify-content:flex-start" },
      h("button", { type: "button", onclick: downloadJSON }, t("download"))));
    app.appendChild(card);
    flush();
  }

  // ------------------------------------------------------------- keyboard
  document.addEventListener("keydown", (e) => {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === " ") {
      const v = app.querySelector("video");
      if (v) { e.preventDefault(); if (v.paused) v.play(); else v.pause(); }
    }
    // moderator export at any time: Shift+E
    if (e.key === "E" && e.shiftKey && S.mode === "mod") downloadJSON();
  });

  document.getElementById("langToggle").addEventListener("click", () => {
    lang = lang === "tr" ? "en" : "tr";
    document.getElementById("langToggle").textContent = lang === "tr" ? "EN" : "TR";
    document.documentElement.lang = lang;
    if (S.plan.length) persist();
    render();
  });
  document.getElementById("langToggle").textContent = lang === "tr" ? "EN" : "TR";

  // --------------------------------------------------------------- start
  if (S.pid && S.mode === "expert") { S.list = 0; begin(); }
  else if (S.pid && S.list != null && !Number.isNaN(S.list)) begin();
  else {
    if (S.pid && (S.list == null || Number.isNaN(S.list))) {
      const m = S.pid.match(/(\d+)\s*$/);
      if (m) { S.list = (parseInt(m[1], 10) - 1 + nLists()) % nLists(); begin(); }
      else render();
    } else render();
  }
})();
