async function loadEnv() {
  if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv')
    dotenv.config()
  }
}

loadEnv()
  .then(async () => {
    const { default: server } = await import('./server.ts')
    const PORT = process.env.PORT || 3000
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log('Server listening on port', PORT)
    })
  })
  .catch((err) => {
    console.error('Failed to load dotenv: ', err)
  })
