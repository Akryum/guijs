export function proxy (url) {
  return `${import.meta.env.VITE_PROXY}/${encodeURIComponent(url)}`
}
