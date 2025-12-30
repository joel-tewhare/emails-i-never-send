import { createRoutesFromElements, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import Playground from './components/Playground.tsx'
import Home from './components/Home.tsx'

export default createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="playground" element={<Playground />} />
    </Route>
  </>,
)
