
function getApiBaseUrl(): string {
    // Browser: use same-origin relative paths proxied by Next.js rewrites (avoids CORS).
    if (typeof window !== "undefined") {
        return "";
    }

    const baseUrl =
        process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error(
            "API_BASE_URL or NEXT_PUBLIC_API_BASE_URL is not configured",
        );
    }
    return baseUrl.replace(/\/$/, "");
}

async function apiFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const url = `${getApiBaseUrl()}${path}`;

    // Only send a Content-Type header when there is a request body.
    // Adding it to GET requests makes them "non-simple" CORS requests,
    // which triggers a preflight (OPTIONS) that the API may not handle and
    // causes the browser request to fail even though curl/Postman succeed.
    //
    // For FormData bodies we must NOT set Content-Type: the browser sets it
    // to multipart/form-data with the correct boundary automatically.
    const hasBody = options?.body != null;
    const isFormData =
        typeof FormData !== "undefined" && options?.body instanceof FormData;
    const headers: HeadersInit = {
        ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...options?.headers,
    };

    const res = await fetch(url, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        const message = await res.text().catch(() => res.statusText);
        throw new Error(message || `API error: ${res.status}`);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}

export default apiFetch;
