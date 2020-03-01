export function proxy (url) {
  return `${process.env.VUE_APP_PROXY}/${encodeURIComponent(url)}`
}
