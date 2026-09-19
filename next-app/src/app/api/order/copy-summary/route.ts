import { NextResponse } from 'next/server';

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get('data');
  let text = '';

  if (data) {
    try {
      text = Buffer.from(data, 'base64url').toString('utf-8');
    } catch {
      text = data;
    }
  } else {
    text = searchParams.get('text') || '';
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Summary - Cake Connection</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px 16px;
      background-color: #0f172a;
      color: #f8fafc;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: #1e293b;
      border-radius: 18px;
      padding: 24px;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      border: 1.5px solid #334155;
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #064e3b;
      color: #6ee7b7;
      border: 1px solid #059669;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 14px;
      transition: all 0.3s;
    }
    h2 {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
    }
    pre {
      background-color: #090d16;
      border: 1.5px solid #334155;
      border-radius: 12px;
      padding: 16px;
      font-family: monospace, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0 0 20px;
      text-align: left;
      color: #e2e8f0;
      max-height: 320px;
      overflow-y: auto;
      user-select: all;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 13px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s, transform 0.1s;
    }
    .btn:active { transform: scale(0.98); }
    .btn-copy { background-color: #be123c; color: #ffffff; }
    .btn-wa { background-color: #25D366; color: #ffffff; }
    .footer-hint {
      margin-top: 14px;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div id="badge" class="badge">
      <span>📋</span> Auto-copying to clipboard...
    </div>
    <h2>Cake Connection Order Text</h2>

    <pre id="summaryText">${escapeHtml(text)}</pre>

    <div class="btn-group">
      <button class="btn btn-copy" onclick="copyText()">📋 Copy Text Again</button>
      <a class="btn btn-wa" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank">📲 Send Directly to Delivery Boy on WhatsApp</a>
    </div>

    <div class="footer-hint">
      You can now switch to WhatsApp or any app and paste!
    </div>
  </div>

  <script>
    function copyText() {
      const el = document.getElementById('summaryText');
      const text = el.innerText || el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const badge = document.getElementById('badge');
        badge.innerHTML = '<span>✅</span> Copied to Clipboard Successfully!';
        badge.style.backgroundColor = '#065f46';
        badge.style.color = '#a7f3d0';
        badge.style.borderColor = '#34d399';
      }).catch(() => {
        const badge = document.getElementById('badge');
        badge.innerHTML = '<span>👆</span> Tap text box to select & copy';
      });
    }

    // Auto copy on page load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(copyText, 150);
    });
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
