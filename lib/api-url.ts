/**
 * API path for client form POSTs. Uses a same-origin relative URL so submissions
 * work whether the visitor is on www or the apex host (cross-origin POSTs are
 * blocked by the browser and surface as "NetworkError when attempting to fetch").
 */
export function apiUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
