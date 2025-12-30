import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Button
        asChild
        className="m-4 rounded-xl bg-email-charcoal px-4 py-3 text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
      >
        <Link to="">Create Account</Link>
      </Button>
      <Button
        asChild
        className="m-4 rounded-xl bg-email-charcoal px-4 py-3 text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
      >
        <Link to="/compose">Get Started Now</Link>
      </Button>
    </div>
  )
}
