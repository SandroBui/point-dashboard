
function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
    }
    return baseUrl.replace(/\/$/, "");
}

async function apiFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const url = `${getApiBaseUrl()}${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
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
