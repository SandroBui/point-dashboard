import type { NextRequest } from "next/server";

function getApiBaseUrl(): string {
  const baseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "API_BASE_URL or NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }
  return baseUrl.replace(/\/$/, "");
}

// Headers that must NOT be forwarded to the upstream API.
// Cookie is the critical one: the browser attaches same-origin NextAuth cookies
// (e.g. `authjs.callback-url=http://localhost:3000`) on every request. The
// upstream WAF rejects any cookie whose value looks like a URL with 403. The
// upstream API does not need the app's auth cookies, so we drop them entirely.
const STRIPPED_REQUEST_HEADERS = new Set([
  "cookie",
  "host",
  "connection",
  "content-length",
  "origin",
  "referer",
]);

export async function proxyToApi(req: NextRequest): Promise<Response> {
  const { pathname, search } = new URL(req.url);
  const target = `${getApiBaseUrl()}${pathname}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const body = await upstream.arrayBuffer();

  // fetch already decodes the body, so the original encoding/length headers
  // would be wrong if forwarded as-is.
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
