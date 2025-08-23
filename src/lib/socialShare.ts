import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (opts: { appId: string; xfbml?: boolean; version: string }) => void;
      ui: (p: { method: 'share'; href: string }, cb?: (res: unknown) => void) => void;
    };
  }
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}

export async function uploadImageToSupabase(
  bucket: string,
  path: string,
  blob: Blob
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    cacheControl: "3600",
    upsert: true,
    contentType: "image/jpeg",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadHtmlToSupabase(
  bucket: string,
  path: string,
  html: string
): Promise<string> {
  const file = new Blob([html], { type: "text/html" });
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "60",
    upsert: true,
    contentType: "text/html",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function esc(s = ""): string {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ]!)
  );
}

export function buildShareHtml(opts: {
  title: string;
  description: string;
  imageUrl: string;  // public HTTPS to the JPEG you uploaded
  pageUrl: string;   // canonical URL pointing to THIS HTML file
}) {
  const esc = (s = '') =>
    s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));
  const { title, description, imageUrl, pageUrl } = opts;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- Open Graph for Facebook preview -->
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${esc(pageUrl)}" />
<meta property="og:image" content="${esc(imageUrl)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />

<!-- Redirect normal browsers straight to the image -->
<meta http-equiv="refresh" content="0; url=${esc(imageUrl)}" />
<script>
  (function () {
    // JS redirect as a backup if meta refresh is blocked
    try { window.location.replace(${JSON.stringify(imageUrl)}); } catch (_) {}
  })();
</script>

<style>
  body { margin:0; display:flex; min-height:100vh; align-items:center; justify-content:center; background:#111; color:#fff; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  a { color:#4ea1ff; }
</style>
</head>
<body>
  <div>
    <p>If you are not redirected automatically, <a href="${esc(imageUrl)}" rel="noopener">click here to view the image</a>.</p>
  </div>
</body>
</html>`;
}

let sdkState: 'idle' | 'loading' | 'ready' | 'failed' = 'idle';
let sdkPromise: Promise<void> | null = null;

export function loadFacebookSdk(appId?: string, timeoutMs = 4000): Promise<void> {
  if (!appId) {
    console.warn('[FB] No appId provided; will use sharer fallback.');
    sdkState = 'failed';
    return Promise.resolve(); // we’ll fallback later
  }
  if (sdkState === 'ready') return Promise.resolve();
  if (sdkState === 'loading' && sdkPromise) return sdkPromise;

  sdkState = 'loading';
  sdkPromise = new Promise<void>((resolve) => {
    let settled = false;

    // Timeout → mark failed but resolve so caller can fallback
    const t = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        sdkState = 'failed';
        console.warn('[FB] SDK load timed out; using sharer fallback.');
        resolve();
      }
    }, timeoutMs);

    // FB init callback
    window.fbAsyncInit = () => {
      try {
        window.FB?.init({ appId, xfbml: false, version: 'v21.0' });
        sdkState = 'ready';
        settled = true;
        window.clearTimeout(t);
        console.log('[FB] SDK ready');
        resolve();
      } catch (e) {
        sdkState = 'failed';
        settled = true;
        window.clearTimeout(t);
        console.error('[FB] SDK init error:', e);
        resolve(); // allow fallback
      }
    };

    // Inject script (with onerror)
    const id = 'facebook-jssdk';
    if (document.getElementById(id)) return; // already appended
    const js = document.createElement('script');
    js.id = id;
    js.async = true;
    js.defer = true;
    js.crossOrigin = 'anonymous';
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    js.onerror = () => {
      if (!settled) {
        settled = true;
        sdkState = 'failed';
        window.clearTimeout(t);
        console.error('[FB] Failed to load sdk.js (blocked by CSP/adblock/network).');
        resolve(); // allow fallback
      }
    };
    document.body.appendChild(js);
  });

  return sdkPromise;
}

export function openShareDialog(href: string, preOpened?: Window | null): void {
  // If SDK is ready, try UI. Otherwise fallback to sharer.
  if (window.FB?.ui) {
    try {
      window.FB.ui({ method: 'share', href, }, () => {});
      return;
    } catch (e) {
      console.warn('[FB] FB.ui threw; falling back:', e);
    }
  }
  const sharer = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`;
  if (preOpened && !preOpened.closed) {
    preOpened.location.href = sharer // avoids popup blockers
  } else {
    window.open(sharer, '_blank', 'noopener,noreferrer');
  }
}
