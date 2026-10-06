/* TİD signer evaluation interface.
 *
 * Static single-page app. Stimuli come from stimuli.js (window.STUDY).
 * Responses are (1) kept in localStorage so a session can resume after a
 * reload, (2) posted event-by-event to a Google Apps Script endpoint when
 * STUDY.endpoint is set, and (3) downloadable as one JSON file at the end.
 *
 * URL parameters (all optional):
 *   ?pid=P07        participant / expert code (otherwise asked on the first screen)
 *   &list=2         counterbalancing list (0-based; otherwise asked / derived from pid)
 *   &mode=mod       moderator mode: notes fields, skip buttons, JSON export
 *   &mode=expert    expert panel (CODAs, interpreters): 25 sentences × 3 sequential videos
 *                   (our avatar, gold-gloss avatar, real signer)
 *   &mode=deaf      Deaf participants: 25 sentences, one video each (avatar or real signer,
 *                   Latin square over 2 lists), 5 simple 1-5 ratings, no Turkish writing
 *   &skip=1         expert: skip button and no "watch to the end" gate
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
      need_ratings_ex: "Lütfen altı soruyu da cevaplayın.",
      q_lex: "İşaretler doğru mu? (doğru işaret, doğru el şekli ve hareket)",
      q_lex_lo: "Çok yanlış", q_lex_hi: "Tamamen doğru",
      q_overall: "Genel olarak bu TİD cümlesi nasıl?",
      q_overall_lo: "Çok kötü", q_overall_hi: "Çok iyi",
      q_miss: "Eksik ya da yanlış bilgi var mı?",
      miss_none: "Yok", miss_some: "Biraz var", miss_much: "Çok var",
      q_miss_what: "Ne eksik ya da yanlış? (isteğe bağlı)",
      ex_meaning_title: "Türkçe cümle ile karşılaştırın",
      ex_meaning_hint: "Şimdi asıl Türkçe cümleyi görüyorsunuz. Her video için soruları cevaplayın. Bir videoyu tekrar izlemek için düğmesine basın.",
      ex_show_clip: "Videoyu göster",
      need_meaning_ex: "Lütfen her video için üç soruyu da cevaplayın.",
      ex_watch: "Videoyu en az bir kez sonuna kadar izleyin, sonra puanlayın.",
      ex_break: "İstediğiniz zaman ara verebilirsiniz. Aynı bağlantıyı açınca kaldığınız yerden devam edersiniz.",
      ex_no_turkish: "Bu adımda Türkçe cümle gösterilmez.",
      ex_clip_of: "/",
      ex_reveal_title: "Bizim çevirimiz",
      ex_ours_was: "Puanlarınız kaydedildi. Az önce izlediğiniz videolardan {L} bizim çevirimizdi (bilgisayarın ürettiği çeviri).",
      ex_ours_comment: "Bu çeviri hakkında ne düşünüyorsunuz? Ayrıntılı yazabilirsiniz.",
      ex_wrong: "Kısaca: ne yanlıştı? (isteğe bağlı)",
      ex_wrong_tags: "Sorunlar (isteğe bağlı)",
      ex_break_title: "Ara",
      ex_break_text: "Yarıdasınız. İsterseniz şimdi ara verebilirsiniz. Aynı bağlantıyı açınca kaldığınız yerden devam edersiniz.",
      ex_break_next: "Devam et",
      list_expert_hint: "İlk izlenen koşulu dengeler (P01→L0, P02→L1, P03→L2).",
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
      need_ratings_ex: "Please answer all six questions.",
      q_lex: "Are the signs correct? (right sign, right handshape and movement)",
      q_lex_lo: "Very wrong", q_lex_hi: "Completely correct",
      q_overall: "Overall, how is this TİD sentence?",
      q_overall_lo: "Very bad", q_overall_hi: "Very good",
      q_miss: "Is any information missing or wrong?",
      miss_none: "No", miss_some: "A little", miss_much: "A lot",
      q_miss_what: "What is missing or wrong? (optional)",
      ex_meaning_title: "Compare with the Turkish sentence",
      ex_meaning_hint: "You now see the original Turkish sentence. Answer the questions for each video. Press a video's button to watch it again.",
      ex_show_clip: "Show video",
      need_meaning_ex: "Please answer all three questions for each video.",
      ex_watch: "Watch the video to the end at least once, then rate it.",
      ex_break: "You can take a break at any time. Open the same link again to continue where you stopped.",
      ex_no_turkish: "The Turkish sentence is not shown in this step.",
      ex_clip_of: "/",
      ex_reveal_title: "Our translation",
      ex_ours_was: "Your ratings are saved. Of the videos you just watched, {L} was our translation (the computer-generated translation).",
      ex_ours_comment: "What do you think of this translation? You can write in detail.",
      ex_wrong: "Briefly: what was wrong? (optional)",
      ex_wrong_tags: "Problems (optional)",
      ex_break_title: "Break",
      ex_break_text: "You are halfway through. Take a break if you like. Open the same link again to continue where you stopped.",
      ex_break_next: "Continue",
      list_expert_hint: "Balances which condition is shown first (P01→L0, P02→L1, P03→L2).",
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
    mode: ["mod", "expert", "deaf"].includes(params.get("mode")) ? params.get("mode") : "self",
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
  // STUDY_V5_2026_10_05: the real-signer video ("reference") is shown in the expert and Deaf studies
  const HIDDEN_CONDS = new Set(["realclip"]);
  function shownConds(list) {
    return (list || []).filter((c) => c && !HIDDEN_CONDS.has(c));
  }
  function expertConds() {
    const raw = (STUDY.design && STUDY.design.expertConditions) || ["avatar", "gold", "retarget"];
    return shownConds(raw);
  }
  function expertOurs() {
    return (STUDY.design && STUDY.design.expertOurs) || "avatar";
  }
  const nLists = () => {
    if (S.mode === "expert") return Math.max(expertConds().length, 1);
    if (S.mode === "deaf") return Math.max(deafConds().length, 1);
    return Math.max(shownConds(STUDY.design && STUDY.design.block1Conditions).length, 1);
  };

  function conditionFor(item, idx) {
    const conds = shownConds(STUDY.design.block1Conditions);
    for (let k = 0; k < conds.length; k++) {
      const c = conds[(idx + S.list + k) % conds.length];
      if (item.conditions && item.conditions[c] && item.conditions[c].video) return c;
    }
    const keys = Object.keys(item.conditions || {}).filter((c) => !HIDDEN_CONDS.has(c));
    return keys[0];
  }

  // Expert panel: every expert rates every sentence in three avatar versions
  // (design.expertConditions: avatar=ours, gold, retarget), played one after
  // another as A/B/C. The first-shown condition is rotated across experts
  // (Latin square on S.list from the pid); the other two are shuffled per item.
  // Ablation pairs are not in this plan. A break is inserted halfway.
  const EXPERT = () => (STUDY.expert || {});
  const DEAF = () => (STUDY.deaf || {});
  // texts and questions of the current mode (expert / deaf), falling back to the general ones
  const MODECFG = () => (S.mode === "expert" ? EXPERT() : S.mode === "deaf" ? DEAF() : {});
  function deafConds() {
    return shownConds((STUDY.design && STUDY.design.deafConditions) || ["avatar", "reference"]);
  }
  // Deaf study (STUDY_V5_2026_10_05): every sentence once; the condition alternates over the
  // items and the list (Latin square), so each list sees about half avatar, half real signer.
  function buildDeafPlan() {
    const rand = rng(hashStr(S.pid + "|deaf|" + STUDY.studyId));
    const conds = deafConds();
    const plan = [{ kind: "consent" }, { kind: "background" }, { kind: "instructions" }];
    (STUDY.practice || []).forEach((it, i) => {
      const c = conds.find((k) => it.conditions && it.conditions[k] && it.conditions[k].video) || Object.keys(it.conditions)[0];
      plan.push({ kind: "ditem", practice: true, itemId: it.id, condition: c, n: i + 1, total: STUDY.practice.length });
    });
    // condition of each sentence: fixed by its index and the list (Latin square)
    const condOf = (it) => {
      let c = conds[(items.indexOf(it) + (S.list || 0)) % conds.length];
      if (!(it.conditions && it.conditions[c] && it.conditions[c].video)) c = conds.find((k) => it.conditions && it.conditions[k] && it.conditions[k].video);
      return c;
    };
    // ORDER_BALANCE_2026_10_06 (Onur: too many real videos came one after another): random order,
    // but never more than 2 videos of the same condition in a row, and each half of the session
    // has about the same number of each condition (re-drawn with the participant's seed until both hold)
    let order = items.slice();
    if (STUDY.design.randomizeItems !== false) {
      const ok = (o) => {
        let run = 1;
        for (let i = 1; i < o.length; i++) { run = condOf(o[i]) === condOf(o[i - 1]) ? run + 1 : 1; if (run > 2) return false; }
        const h = Math.floor(o.length / 2), cnt = (arr) => { const m = {}; arr.forEach((it) => { const c = condOf(it); m[c] = (m[c] || 0) + 1; }); return m; };
        const a = cnt(o.slice(0, h)), b = cnt(o.slice(h));
        return conds.every((c) => Math.abs((a[c] || 0) - (b[c] || 0)) <= 1);
      };
      for (let tries = 0; tries < 5000; tries++) { order = shuffle(items, rand); if (ok(order)) break; }
    }
    const half = Math.floor(order.length / 2);
    order.forEach((it, i) => {
      if (i > 0 && i === half) plan.push({ kind: "break", n: i, total: order.length });
      plan.push({ kind: "ditem", itemId: it.id, condition: condOf(it), n: i + 1, total: order.length });
    });
    plan.push({ kind: "final" }, { kind: "done" });
    return plan;
  }
  function buildExpertPlan() {
    const rand = rng(hashStr(S.pid + "|expert|" + STUDY.studyId));
    const conds = expertConds();
    const ours = expertOurs();
    const firstCond = conds.length ? conds[(S.list || 0) % conds.length] : ours;
    const letters = ["A", "B", "C", "D", "E", "F"];
    const plan = [{ kind: "consent" }, { kind: "background" }, { kind: "instructions" }];
    (STUDY.practice || []).forEach((it, i) => {
      const avail = conds.filter((c) => it.conditions && it.conditions[c] && it.conditions[c].video);
      const fallback = Object.keys(it.conditions || {}).filter((c) => !HIDDEN_CONDS.has(c));
      const use = avail.length ? avail : fallback;
      const clips = use.map((c, k) => ({ condition: c, label: letters[k] || String(k + 1) }));
      plan.push({ kind: "exitem", practice: true, itemId: it.id, clips, firstCondition: clips[0] && clips[0].condition, n: i + 1, total: STUDY.practice.length });
    });
    const order = STUDY.design.randomizeItems === false ? items.slice() : shuffle(items, rand);
    const half = Math.floor(order.length / 2);
    order.forEach((it, i) => {
      if (i > 0 && i === half) plan.push({ kind: "break", n: i, total: order.length });
      const avail = conds.filter((c) => it.conditions && it.conditions[c] && it.conditions[c].video);
      const first = avail.includes(firstCond) ? firstCond : avail[0];
      const rest = shuffle(avail.filter((c) => c !== first), rand);
      const clipOrder = first ? [first, ...rest] : rest;
      const clips = clipOrder.map((c, k) => ({ condition: c, label: letters[k] || String(k + 1) }));
      plan.push({ kind: "exitem", itemId: it.id, clips, firstCondition: first, n: i + 1, total: order.length });
    });
    plan.push({ kind: "final" }, { kind: "done" });
    return plan;
  }

  function buildPlan() {
    if (S.mode === "expert") return buildExpertPlan();
    if (S.mode === "deaf") return buildDeafPlan();
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
    else if (st && st.kind === "exitem") label = `${st.practice ? t("practice") : t("item")} ${st.n} ${t("of")} ${st.total}`;
    else if (st && st.kind === "break") label = t("ex_break_title");
    else if (st && st.kind === "pair") label = `${t("pair_title")} ${st.n} ${t("of")} ${st.total}`;
    document.getElementById("progressLabel").textContent = label;
    document.getElementById("pidLabel").textContent = S.pid ? (S.mode === "expert" ? `${S.pid} · expert` : S.mode === "deaf" ? `${S.pid} · deaf · L${S.list}` : `${S.pid} · L${S.list}${S.mode === "mod" ? " · mod" : ""}`) : "";
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
    for (let v = 1; v <= 5; v++) {   // STUDY_V5C: 1-5 for every group (comparable with the Deaf study)
      const b = h("button", { type: "button", "aria-pressed": String(value === v), onclick: () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true"); onChange(v);
      } }, String(v));
      btns.push(b); opts.appendChild(b);
    }
    return h("div", { class: "scale", "data-key": key },
      h("div", { class: "q" }, t(qKey)), opts,
      h("div", { class: "ends" }, h("span", null, "1 = " + t(loKey)), h("span", null, "5 = " + t(hiKey))));
  }

  // STUDY_V5B: three-button choice (none / a little / a lot), same look as the scales
  function choiceRow(key, label, options, onChange, big) {
    const btns = [];
    const opts = h("div", { class: (big ? "opts5" : "opts") + " opts3", role: "radiogroup", "aria-label": label });
    options.forEach(([v, txt]) => {
      const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); onChange(v);
      } }, txt);
      btns.push(b); opts.appendChild(b);
    });
    return h("div", { class: big ? "scale5" : "scale", "data-key": key }, h("div", { class: "q" }, label), opts);
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
      item: renderItem, exitem: renderExpertItem, ditem: renderDeafItem, break: renderBreak, pairIntro: renderPairIntro, pair: renderPair, final: renderFinal, done: renderDone }[st.kind];
    fn(st);
    app.focus();
    window.scrollTo(0, 0);
  }

  function renderStart() {
    const card = h("div", { class: "card" }, h("h1", null, L(STUDY.title) || t("start_title")));
    if (STUDY.welcome) card.appendChild(h("p", null, L(STUDY.welcome)));
    const pid = h("input", { type: "text", value: S.pid, autocomplete: "off" });
    const listHint = h("small", { class: "muted" }, S.mode === "expert" ? t("list_expert_hint") : "P01→L0, P02→L1, …");
    const list = h("select", null, Array.from({ length: nLists() }, (_, i) => h("option", { value: String(i) }, `L${i}`)));
    const modeSel = h("select", null, h("option", { value: "self" }, t("mode_self")), h("option", { value: "mod" }, t("mode_mod")), h("option", { value: "expert" }, t("mode_expert")), h("option", { value: "deaf" }, "Sağır katılımcı / Deaf"));
    modeSel.value = S.mode;
    const fillLists = () => {
      const n = nLists();
      list.innerHTML = "";
      for (let i = 0; i < n; i++) list.appendChild(h("option", { value: String(i) }, `L${i}`));
      const m = pid.value.match(/(\d+)\s*$/);
      if (m) list.value = String((parseInt(m[1], 10) - 1 + n) % n);
      else list.value = "0";
      listHint.textContent = S.mode === "expert" ? t("list_expert_hint") : "P01→L0, P02→L1, …";
    };
    modeSel.addEventListener("change", () => { S.mode = modeSel.value; fillLists(); });
    const err = h("div", { class: "error" });
    card.append(
      h("label", { class: "field" }, h("span", null, t("pid")), pid),
      h("label", { class: "field" }, h("span", null, t("list")), list, listHint),
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
      plan: S.plan.filter((p) => p.kind === "item" || p.kind === "pair" || p.kind === "exitem" || p.kind === "break"),
      design: S.mode === "expert" ? {
        expertConditions: expertConds(), ours: expertOurs(),
        firstCondition: expertConds()[(S.list || 0) % Math.max(expertConds().length, 1)],
        list: S.list, nItems: items.length, nVideos: items.length * expertConds().length,
        latinSquare: "first-shown condition = expertConditions[list % 3] for every item; remaining two shuffled per item",
      } : { block1Conditions: shownConds(STUDY.design && STUDY.design.block1Conditions), list: S.list } });
    render();
  }

  function renderConsent() {
    const card = h("div", { class: "card" }, h("h1", null, t("consent_title")));
    const c = MODECFG().consent || STUDY.consent || {};
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
    const qs = MODECFG().background || STUDY.background || [];
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
    const ins = MODECFG().instructions || STUDY.instructions || {};
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

  // Expert screen (STUDY_V5D, Onur 2026-10-05): three clips in sequence (A/B/C).
  //  1. clip A without the Turkish sentence -> write the meaning in Turkish (+ confidence);
  //  2. the Turkish sentence is shown; clip A is rated on six questions (1-5 and none/a little/a lot),
  //     with optional problem tags and a short note;
  //  3. clips B and C: watch, then the same screen. No reveal of which clip is ours.
  function renderExpertItem(st) {
    const item = st.practice ? (STUDY.practice || []).find((p) => p.id === st.itemId) : itemById[st.itemId];
    const clips = (st.clips && st.clips.length)
      ? st.clips.filter((c) => c.condition && !HIDDEN_CONDS.has(c.condition))
      : (st.condition && !HIDDEN_CONDS.has(st.condition) ? [{ condition: st.condition, label: "A" }] : []);
    const R = {
      itemId: item.id, practice: !!st.practice, category: item.category || "", n: st.n, total: st.total,
      firstCondition: st.firstCondition || (clips[0] && clips[0].condition) || "",
      clipOrder: clips.map((c) => ({ label: c.label, condition: c.condition })),
      understood: "", understoodNone: false, confidence: null,
      clips: clips.map((c) => ({
        label: c.label, condition: c.condition,
        ratings: { comp: null, lex: null, gram: null, nat: null, adeq: null, missing: null },
        tags: [], note: "", video: null, t_rate: null,
      })),
      t_start: now(), t_understand: null, t_submit: null,
    };
    let clipIdx = 0, phase = "watch", ended = false, vb = null;
    const letterEl = h("div", { class: "clip-letter" });
    const playerHost = h("div");
    const left = h("div", null, letterEl, playerHost);
    const right = h("div");
    const head = h("h1", null, `${st.practice ? t("practice") : t("item")} ${st.n}${st.practice ? "" : " " + t("of") + " " + st.total}`);
    app.appendChild(h("div", { class: "card" }, head, h("div", { class: "grid2" }, left, right)));
    const source = () => h("div", { class: "source" }, h("div", { class: "muted", style: "font-size:.85rem" }, t("source_label")), item.turkish);

    function loadClip(i) {
      if (vb) { try { vb.destroy(); } catch (e) { /* ignore */ } }
      clipIdx = i; ended = false;
      const clip = clips[clipIdx];
      const cond = (item.conditions && item.conditions[clip.condition]) || {};
      letterEl.textContent = `${t("video_n")} ${clip.label}  (${clipIdx + 1}${t("of")}${clips.length})`;
      letterEl.setAttribute("data-clip-letter", clip.label);
      vb = videoBlock(cond.video, { onEnded: () => { ended = true; refresh(); } });
      playerHost.innerHTML = ""; playerHost.appendChild(vb.el);
    }
    cleanup.push(() => { if (vb) vb.destroy(); });

    const msg = h("div", { class: "error" });
    const nextBtn = h("button", { type: "button", class: "primary" }, t("next"));
    const canSkip = params.get("skip") === "1";
    const free = canSkip || S.mode === "mod";
    const actions = h("div", { class: "actions" });
    if (canSkip) {
      actions.appendChild(h("button", { type: "button", onclick: () => {
        record("expert_item_skipped", { itemId: item.id, clipOrder: R.clipOrder, phase, clipIdx }); go(1);
      } }, t("skip")));
    }
    actions.appendChild(nextBtn);
    function refresh() { nextBtn.disabled = phase === "watch" ? !(ended || canSkip) : false; }

    function showWatch() {
      phase = "watch";
      loadClip(clipIdx);
      right.innerHTML = "";
      const bits = [h("h2", null, t("watch_title")), h("p", { class: "muted" }, t("ex_watch"))];
      if (clipIdx === 0) bits.push(h("p", { class: "muted" }, t("ex_no_turkish"))); else bits.push(source());
      bits.push(msg, actions);
      right.append(...bits);
      refresh();
    }
    function showUnderstand() {
      phase = "understand";
      right.innerHTML = "";
      const ta = h("textarea", { "aria-label": t("understand_q") });
      ta.addEventListener("input", () => { R.understood = ta.value; });
      const none = h("input", { type: "checkbox" });
      none.addEventListener("change", () => { R.understoodNone = none.checked; ta.disabled = none.checked; });
      right.append(
        h("h2", null, t("understand_title")),
        h("p", { class: "muted" }, t("ex_no_turkish")),
        h("label", { class: "field" }, h("span", null, t("understand_q")), ta),
        h("label", { class: "field" }, h("span", null, none, " ", t("understand_none"))),
        scale("conf", "conf_q", "conf_lo", "conf_hi", null, (v) => { R.confidence = v; }),
        msg, actions);
      refresh();
      ta.focus();
    }
    function showRate() {
      phase = "rate";
      const slot = R.clips[clipIdx];
      right.innerHTML = "";
      const chosen = new Set();
      const note = h("input", { type: "text", "aria-label": t("ex_wrong") });
      note.addEventListener("input", () => { slot.note = note.value; });
      right.append(
        h("h2", null, `${t("rate_title")} · ${t("video_n")} ${clips[clipIdx].label}`),
        source(),
        scale("comp", "q_comp", "q_comp_lo", "q_comp_hi", null, (v) => { slot.ratings.comp = v; }),
        scale("lex", "q_lex", "q_lex_lo", "q_lex_hi", null, (v) => { slot.ratings.lex = v; }),
        scale("gram", "q_gram", "q_gram_lo", "q_gram_hi", null, (v) => { slot.ratings.gram = v; }),
        scale("nat", "q_nat", "q_nat_lo", "q_nat_hi", null, (v) => { slot.ratings.nat = v; }),
        scale("adeq", "q_adeq", "q_adeq_lo", "q_adeq_hi", null, (v) => { slot.ratings.adeq = v; }),
        choiceRow("missing", t("q_miss"), [["none", t("miss_none")], ["some", t("miss_some")], ["much", t("miss_much")]], (v) => { slot.ratings.missing = v; }),
        h("h3", null, t("ex_wrong_tags")),
        chipGroup(ITEM_TAGS, chosen, () => { slot.tags = [...chosen]; }),
        h("label", { class: "field" }, h("span", null, t("ex_wrong")), note),
        msg, actions);
      refresh();
    }

    nextBtn.addEventListener("click", () => {
      msg.textContent = "";
      if (phase === "watch") { if (clipIdx === 0) showUnderstand(); else showRate(); return; }
      if (phase === "understand") {
        if (!free && !R.understoodNone && !R.understood.trim()) { msg.textContent = t("need_understand"); return; }
        if (!free && R.confidence == null && !R.understoodNone) { msg.textContent = t("need_understand"); return; }
        R.t_understand = now();
        showRate();
        return;
      }
      if (phase === "rate") {
        const slot = R.clips[clipIdx];
        if (!free && Object.values(slot.ratings).some((v) => v == null)) { msg.textContent = t("need_ratings_ex"); return; }
        slot.t_rate = now();
        if (vb) slot.video = { src: ((item.conditions[clips[clipIdx].condition] || {}).video) || "", plays: vb.state.plays, ended: vb.state.ended, slowUsed: vb.state.slowUsed, loopUsed: vb.state.loopUsed };
        record("expert_clip", {
          itemId: item.id, practice: !!st.practice, n: st.n,
          label: clips[clipIdx].label, condition: clips[clipIdx].condition, clipIndex: clipIdx,
          ratings: slot.ratings, tags: slot.tags, note: slot.note, video: slot.video,
          understood: clipIdx === 0 ? R.understood : undefined,
          understoodNone: clipIdx === 0 ? R.understoodNone : undefined,
          confidence: clipIdx === 0 ? R.confidence : undefined,
        });
        if (clipIdx < clips.length - 1) { clipIdx += 1; showWatch(); return; }
        R.t_submit = now();
        record("expert_item", { ...R, turkish: item.turkish });
        go(1);
      }
    });

    showWatch();
  }

  // Deaf study item (STUDY_V5B, Onur 2026-10-05):
  //  1. watch the video to the end (no Turkish shown);
  //  2. write in Turkish what was understood (or "I did not understand") + rating "understand";
  //  3. the Turkish sentence is revealed (writing is locked) and the remaining questions of
  //     STUDY.deaf.ratings are asked: meaning (1-5), missing / wrong (3 choices), hands, natural, flow, overall.
  function renderDeafItem(st) {
    const D = DEAF();
    const item = (st.practice ? Object.fromEntries((STUDY.practice || []).map((p) => [p.id, p])) : itemById)[st.itemId];
    const cond = (item && item.conditions && item.conditions[st.condition]) || {};
    const qs = D.ratings || [];
    const qStep = (q) => q.step || "rate";
    const R = { itemId: st.itemId, condition: st.condition, practice: !!st.practice, ratings: {},
      understood: "", understoodNone: false, t_start: now(), t_understand: null, t_submit: null };
    const free = S.mode === "mod" || !!params.get("skip");
    let step = "watch";
    const card = h("div", { class: "card deaf" },
      h("h1", null, st.practice ? L(D.practiceTitle || { tr: "Deneme", en: "Practice" }) : `${st.n} / ${st.total}`));
    const vb = videoBlock(cond.video || "", { onEnded: () => { if (step === "watch") showUnderstand(); } });
    cleanup.push(() => vb.destroy());
    const hint = h("p", { class: "muted" }, L(D.watchHint || { tr: "Videoyu sonuna kadar izleyin.", en: "Watch the video to the end." }));
    card.appendChild(hint);
    card.appendChild(vb.el);

    function question(q) {
      if (q.type === "choice3") {
        return choiceRow(q.id, L(q.label), q.options.map((o) => [o.value, L(o.label)]), (v) => { R.ratings[q.id] = v; }, true);
      }
      const btns = [];
      const opts = h("div", { class: "opts5", role: "radiogroup", "aria-label": L(q.label) });
      for (let v = 1; v <= 5; v++) {
        const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => {
          btns.forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); R.ratings[q.id] = v;
        } }, h("span", { class: "num" }, String(v)));
        btns.push(b); opts.appendChild(b);
      }
      return h("div", { class: "scale5", "data-key": q.id }, h("div", { class: "q" }, L(q.label)), opts,
        h("div", { class: "ends" }, h("span", null, "1 = " + L(q.lo)), h("span", null, "5 = " + L(q.hi))));
    }

    // step 2 panel
    const ta = h("textarea", { "aria-label": L(D.understandQ || { tr: "Ne anladınız?", en: "What did you understand?" }) });
    ta.addEventListener("input", () => { R.understood = ta.value; });
    // STUDY_V5C: a large "Hiçbir şey anlamadım" toggle; pressing it also sets question 1 to 1
    const none = h("button", { type: "button", class: "none-btn", "aria-pressed": "false", onclick: () => {
      R.understoodNone = !R.understoodNone;
      none.setAttribute("aria-pressed", String(R.understoodNone)); ta.disabled = R.understoodNone;
      if (R.understoodNone) { const b1 = understandPanel.querySelector('[data-key="understand"] .opts5 button'); if (b1) b1.click(); }
    } }, L(D.understandNone || { tr: "Hiçbir şey anlamadım", en: "I did not understand anything" }));
    const write = D.writeUnderstanding !== false;   // STUDY_V5E: false = no Turkish writing, only question 1
    const understandPanel = h("div", { class: "deaf-understand" },
      ...(write ? [h("label", { class: "field" }, h("span", { class: "q" }, L(D.understandQ || { tr: "Ne anladınız? Türkçe yazın.", en: "What did you understand? Write in Turkish." })), ta), none] : []),
      ...qs.filter((q) => qStep(q) === "understand").map(question));
    understandPanel.hidden = true;
    card.appendChild(understandPanel);

    // step 3 panel
    const revealPanel = h("div", { class: "deaf-rate" },
      h("div", { class: "source" }, h("div", { class: "muted", style: "font-size:.9rem" }, L(D.sourceLabel || { tr: "Türkçe cümle:", en: "Turkish sentence:" })), (item && item.turkish) || ""),
      ...qs.filter((q) => qStep(q) !== "understand").map(question));
    revealPanel.hidden = true;
    card.appendChild(revealPanel);

    const msg = h("p", { class: "error-msg" });
    const nextBtn = h("button", { type: "button", class: "primary" }, t("next"));
    nextBtn.disabled = !free;
    function showUnderstand() {
      step = "understand";
      understandPanel.hidden = false;
      nextBtn.disabled = false;
      if (write) ta.focus();
    }
    nextBtn.addEventListener("click", () => {
      msg.textContent = "";
      if (step === "watch") { showUnderstand(); return; }
      if (step === "understand") {
        const missing = qs.filter((q) => qStep(q) === "understand").some((q) => R.ratings[q.id] == null);
        if (!free && ((write && !R.understoodNone && !R.understood.trim()) || missing)) {
          msg.textContent = L(D.needUnderstand || { tr: "Lütfen ne anladığınızı yazın.", en: "Please write what you understood." }); return;
        }
        R.t_understand = now();
        ta.disabled = true; none.disabled = true;
        understandPanel.querySelectorAll(".opts5 button").forEach((b) => { b.disabled = true; });
        step = "rate";
        revealPanel.hidden = false;
        revealPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (qs.some((q) => R.ratings[q.id] == null) && !free) { msg.textContent = L(D.needRatings || { tr: "Lütfen bütün soruları cevaplayın.", en: "Please answer all questions." }); return; }
      R.t_submit = now();
      R.turkish = (item && item.turkish) || "";
      R.video = { src: cond.video || "", plays: vb.state.plays, ended: vb.state.ended, slowUsed: vb.state.slowUsed, loopUsed: vb.state.loopUsed };
      record("deaf_item", R);
      go(1);
    });
    card.appendChild(msg);
    card.appendChild(h("div", { class: "actions" }, nextBtn));
    app.appendChild(card);
  }

  function renderBreak() {
    const card = h("div", { class: "card" },
      h("h1", null, t("ex_break_title")),
      h("p", null, t("ex_break_text")),
      h("p", { class: "muted" }, t("ex_break")),
      h("div", { class: "actions" }, h("button", { type: "button", class: "primary", onclick: () => { record("break", { step: S.step }); go(1); } }, t("ex_break_next"))));
    app.appendChild(card);
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
    const qs = MODECFG().finalQuestions || STUDY.finalQuestions || [];
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
    if (e.key === "E" && e.shiftKey && (S.mode === "mod" || S.mode === "expert")) downloadJSON();
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
  // Deaf link (?mode=deaf): no code screen; a random code and list are made unless given
  if (S.mode === "deaf" && !S.pid) {
    // the code is kept in this browser, so a reload continues the same session
    const prev = store.get("tidstudy:deafpid");
    S.pid = (prev && prev.pid) || ("D" + Date.now().toString(36).slice(-5).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase());
    if (S.list == null || Number.isNaN(S.list)) S.list = (prev && prev.list != null) ? prev.list : Math.floor(Math.random() * nLists());
    store.set("tidstudy:deafpid", { pid: S.pid, list: S.list });
  }
  if (S.pid && S.mode === "deaf") {
    if (S.list == null || Number.isNaN(S.list)) {
      const m = S.pid.match(/(\d+)\s*$/);
      S.list = m ? (parseInt(m[1], 10) - 1 + nLists()) % nLists() : Math.floor(Math.random() * nLists());
    }
    begin();
  }
  else if (S.pid && S.mode === "expert") {
    if (S.list == null || Number.isNaN(S.list)) {
      const m = S.pid.match(/(\d+)\s*$/);
      S.list = m ? (parseInt(m[1], 10) - 1 + nLists()) % nLists() : 0;
    }
    begin();
  }
  else if (S.pid && S.list != null && !Number.isNaN(S.list)) begin();
  else {
    if (S.pid && (S.list == null || Number.isNaN(S.list))) {
      const m = S.pid.match(/(\d+)\s*$/);
      if (m) { S.list = (parseInt(m[1], 10) - 1 + nLists()) % nLists(); begin(); }
      else render();
    } else render();
  }
})();
