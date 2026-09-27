/**
 * Google Apps Script backend for the TİD signer study.
 *
 * Setup (about 5 minutes):
 *  1. Create a new Google Sheet (e.g. "TID signer study responses").
 *  2. Extensions → Apps Script. Replace the default code with this file. Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the web-app URL (ends with /exec).
 *  4. Paste the URL into web/study_config.js → endpoint: "https://script.google.com/.../exec"
 *  5. Test: open the study with ?pid=TEST01, finish one item, check that rows
 *     appear in the "item" sheet. Delete the TEST rows before real sessions.
 *
 * Each event type gets its own sheet (session_start, consent, background,
 * item, pair, final, session_end, item_skipped, pair_skipped). Every row keeps
 * the complete event as JSON in the last column, so nothing is lost if the
 * columns change. Re-deploy (Manage deployments → Edit → New version) after
 * editing this script.
 */

const COLUMNS = {
  item: ["ts", "pid", "list", "mode", "itemId", "condition", "category", "practice",
         "understood", "understoodNone", "confidence",
         "rating_comp", "rating_adeq", "rating_gram", "rating_nat",
         "itemTags", "segTags", "comment", "modNotes",
         "plays", "slowUsed", "segPlays", "t_start", "t_understand", "t_reveal", "t_submit"],
  pair: ["ts", "pid", "list", "mode", "pairId", "itemId", "ablation", "swap",
         "leftCondition", "rightCondition", "choice", "preferred", "reasons", "comment", "modNotes",
         "t_start", "t_submit"],
};

function flatten_(ev) {
  if (ev.type === "item") {
    const r = ev.ratings || {};
    const v = ev.video || {};
    return {
      ...ev,
      rating_comp: r.comp, rating_adeq: r.adeq, rating_gram: r.gram, rating_nat: r.nat,
      itemTags: (ev.itemTags || []).join("|"),
      segTags: (ev.segTags || []).map((x) => `${x.gloss}:${x.tags.join("+")}${x.note ? "(" + x.note + ")" : ""}`).join(" | "),
      plays: v.plays, slowUsed: v.slowUsed, segPlays: v.segPlays,
    };
  }
  if (ev.type === "pair") return { ...ev, reasons: (ev.reasons || []).join("|") };
  if (ev.answers) return { ...ev, ...Object.fromEntries(Object.entries(ev.answers).map(([k, x]) => ["a_" + k, x])) };
  return ev;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ev = JSON.parse(e.postData.contents);
    const type = String(ev.type || "unknown").replace(/[^a-z_]/gi, "").slice(0, 40) || "unknown";
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(type);
    const flat = flatten_(ev);
    let cols = COLUMNS[type];
    if (!cols) cols = ["ts", "pid", "list", "mode"].concat(Object.keys(flat).filter((k) =>
      !["ts", "pid", "list", "mode", "answers", "type", "study", "version", "plan", "ratings", "video"].includes(k)).sort());
    if (!sh) {
      sh = ss.insertSheet(type);
      sh.appendRow(cols.concat(["json"]));
      sh.setFrozenRows(1);
    }
    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = header.map((h) => {
      if (h === "json") return JSON.stringify(ev);
      const x = flat[h];
      if (x === undefined || x === null) return "";
      return typeof x === "object" ? JSON.stringify(x) : x;
    });
    sh.appendRow(row);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("TİD study endpoint is running.");
}
