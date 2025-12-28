import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <>
      <header>
        <h1>Emails I Never Send</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  )
}
