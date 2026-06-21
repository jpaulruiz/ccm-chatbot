import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const botId = searchParams.get('botId');

  if (!botId) {
    return new NextResponse('// Missing botId', { status: 400, headers: { 'Content-Type': 'application/javascript' } });
  }

  // Derive base URL from request host
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const script = `
(function() {
  if (window.__ccmLoaded) return;
  window.__ccmLoaded = true;

  var BOT_ID = "${botId}";
  var BASE_URL = "${baseUrl}";

  // Floating button
  var btn = document.createElement('button');
  btn.id = '__ccm_btn';
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#2d9d6f,#3b82f6);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(45,157,111,0.4);z-index:999999;transition:transform .2s';
  btn.onmouseenter = function(){ btn.style.transform = 'scale(1.08)'; };
  btn.onmouseleave = function(){ btn.style.transform = 'scale(1)'; };

  // iframe container
  var frame = document.createElement('iframe');
  frame.src = BASE_URL + '/embed/' + BOT_ID;
  frame.id = '__ccm_frame';
  frame.style.cssText = 'position:fixed;bottom:96px;right:24px;width:380px;height:560px;border:none;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.35);z-index:999998;display:none;transition:opacity .2s';
  frame.allow = 'microphone';

  document.body.appendChild(btn);
  document.body.appendChild(frame);

  var open = false;
  btn.onclick = function() {
    open = !open;
    frame.style.display = open ? 'block' : 'none';
    btn.innerHTML = open
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>';
  };
})();
`;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store',
    },
  });
}
