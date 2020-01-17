export function getImageUrl (url) {
  // Fix images in development
  if (process.env.VUE_APP_GUIJS_DEV && url.charAt(0) === '/') {
    return `http://localhost:${process.env.VUE_APP_GRAPHQL_PORT}${url}`
  }
  return url
}
