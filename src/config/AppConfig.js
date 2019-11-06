export default {
  server: process.env.NODE_ENV === 'production' ? 'https://api.production.com' : 'https://api.development.com',
}
