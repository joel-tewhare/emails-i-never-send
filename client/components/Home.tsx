import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-email-grey">
      <div className="flex h-screen flex-row items-center justify-center gap-4">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="icons graphic"
        />
        <img
          src="/assets/images/landing-page-text-graphic.svg"
          alt="landing page logo"
        />
      </div>

      <p className="max-w-4xl pb-12 text-center text-2xl font-bold">
        Emails aren’t always easy.
      </p>
      <p className="max-w-4xl pb-12 text-center text-2xl font-bold">
        This reflective writing tool uses real-life prompts and AI coaching to
        help you build confidence in professional and emotional communication.
      </p>

      <div className="m-8 flex flex-row flex-wrap items-center justify-center">
        <Card className="m-12 flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-blue p-8">
          <CardHeader>
            <CardTitle>
              <img
                src="/assets/icons/scenarios.svg"
                alt="scenario icons"
                className="h-16"
              />
            </CardTitle>
          </CardHeader>
        </Card>
        <div>
          <Card className="mb-8 max-w-[400px] rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Choose from <span className="italic">everyday</span> scenarios
            </CardContent>
          </Card>
          <p className="max-w-xl text-left text-lg">
            Prompts drawn from real-life scenarios to help you practise writing
            in a way that feels natural and authentic.
          </p>
        </div>
      </div>

      <div className="m-8 flex flex-row flex-wrap items-center justify-center">
        <Card className="m-12 flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-mauve p-8">
          <CardHeader>
            <CardTitle>
              <img
                src="/assets/icons/prompt-moods.svg"
                alt="mood icons"
                className="h-16"
              />
            </CardTitle>
          </CardHeader>
        </Card>
        <div>
          <Card className="mb-8 max-w-lg rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Prompts for <span className="italic">positive</span> and{' '}
              <span className="italic">negative</span> situations
            </CardContent>
          </Card>
          <p className="max-w-xl text-left text-lg">
            Practice writing uplifting messaging or try a harder-to-have
            conversation. Relatable topics we all face from time to time.
          </p>
        </div>
      </div>

      <div className="m-8 flex flex-row flex-wrap items-center justify-center">
        <Card className="m-12 flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-gold p-8">
          <CardHeader>
            <CardTitle>
              <img
                src="/assets/icons/word-time-limits.svg"
                alt="limits icons"
                className="h-16"
              />
            </CardTitle>
          </CardHeader>
        </Card>
        <div>
          <Card className="mb-8 max-w-md rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Add word <span className="italic">limits</span> and time
              <span className="italic"> restrictions</span>
            </CardContent>
          </Card>
          <p className="max-w-xl text-left text-lg">
            Set word and time limits to help you learn to communicate
            effectively and efficiently.
          </p>
        </div>
      </div>

      <div className="m-8 flex flex-row flex-wrap items-center justify-center">
        <Card className="m-12 flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-mint p-8">
          <CardHeader>
            <CardTitle>
              <img
                src="/assets/icons/review.svg"
                alt="review icon"
                className="h-16"
              />
            </CardTitle>
          </CardHeader>
        </Card>
        <div>
          <Card className="mb-8 max-w-lg rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Get <span className="italic">feedback</span> on your tone, clarity
              + more
            </CardContent>
          </Card>
          <p className="max-w-xl text-left text-lg">
            Write and rewrite your email with feedback and AI coaching, giving
            you space to refine your voice and build confidence.
          </p>
        </div>
      </div>

      <p className="max-w-4xl py-12 text-center text-2xl font-bold">
        Sign up and save your best emails for future use
      </p>

      <Button
        asChild
        className="m-4 rounded-xl bg-email-charcoal px-4 py-3 text-lg text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
      >
        <Link to="">Create Account</Link>
      </Button>
      <Button
        asChild
        className="m-4 rounded-xl bg-email-charcoal px-4 py-3 text-lg text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
      >
        <Link to="/compose">Get Started Now</Link>
      </Button>
    </div>
  )
}
