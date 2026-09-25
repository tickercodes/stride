// Stride early-access emails → Google Sheet

function doPost(e) {
  var email = String(e.parameter.email || '').trim().toLowerCase();
  var source = String(e.parameter.source || 'unknown').trim();

  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    return jsonResponse({ ok: false, error: 'Invalid email' });
  }

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([
    new Date(),
    email,
    source,
  ]);

  return jsonResponse({ ok: true });
}

function doGet(e) {
  return doPost(e);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
