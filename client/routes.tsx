import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App.tsx'
import ComponentPlayground from './components/Playground.tsx'

export default createRoutesFromElements(
  <>
    <Route index element={<App />} />

    <Route path="playground" element={<ComponentPlayground />} />
  </>,
)
