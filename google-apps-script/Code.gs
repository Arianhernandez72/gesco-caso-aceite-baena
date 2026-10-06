/**
 * AOP Baena — saves the website's form submissions into this Google Sheet.
 * Paste this file into Extensiones → Apps Script of the spreadsheet and deploy it
 * as a web app (see the README, "Guardar los formularios en Google Sheets").
 */
const SHEET_NAME = 'Formularios';
const COLUMNS = ['createdAt', 'kind', 'email', 'name', 'city', 'source', 'company', 'type', 'volume', 'vat', 'message', 'lang', 'page'];
const KINDS = ['newsletter', 'oleotourisme', 'checkout-optin', 'signup', 'b2b', 'contact'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (KINDS.indexOf(data.kind) === -1 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email || ''))) {
      return reply_(false);
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    sheet.appendRow(COLUMNS.map(function (c) { return clean_(data[c]); }));
    return reply_(true);
  } catch (err) {
    return reply_(false);
  } finally {
    lock.releaseLock();
  }
}

/* Text only, capped, and never read as a formula by Sheets. */
function clean_(v) {
  if (v === undefined || v === null) return '';
  v = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reply_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON);
}
