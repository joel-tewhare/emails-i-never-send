import { createRoutesFromElements, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import Playground from './components/Playground.tsx'
import Home from './components/Home.tsx'
import Compose from './components/Compose.tsx'
import SavedEmails from './components/SavedEmails.tsx'
import Profile from './components/Profile.tsx'
import Review from './components/Review.tsx'

export default createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="playground" element={<Playground />} />
      <Route path="compose" element={<Compose />} />
      <Route path="saved" element={<SavedEmails />} />
      <Route path="profile" element={<Profile />} />
      <Route path="review" element={<Review />} />
    </Route>
  </>,
)
