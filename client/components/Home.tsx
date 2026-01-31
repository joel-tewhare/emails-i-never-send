import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-email-grey">
      <div className="mx-6 my-24 h-96 flex-row items-center justify-center gap-4 md:mx-0 md:my-0 md:flex md:h-screen">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="icons graphic"
          className="block md:hidden"
        />
        <img
          src="/assets/images/landing-page-text-graphic.svg"
          alt="landing page logo"
          className="hidden md:block"
        />
      </div>

      <p className="max-w-4xl pb-12 text-center text-2xl font-bold">
        Emails aren’t always easy.
      </p>
      <p className="max-w-4xl pb-12 text-center text-2xl font-bold">
        This reflective writing tool uses real-life prompts and AI coaching to
        simulate outcomes and help you build confidence in professional and
        emotional communication.
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
            Set word and time limits to help you communicate effectively and
            efficiently.
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
          <Card className="mb-8 max-w-xs rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              <span className="italic">Reflect</span> before you revise
            </CardContent>
          </Card>
          <p className="max-w-xl text-left text-lg">
            Your AI coach rates the impact of your email, sharing key takeaways
            and reflections to help you decide what to change before a final
            review.
          </p>
        </div>
      </div>

      <Button
        asChild
        className="w-42 mb-16 mt-12 flex h-14 items-center justify-center rounded-xl bg-email-charcoal px-6 text-lg font-semibold text-email-white shadow-md transition-colors duration-150 hover:bg-email-charcoal/80 hover:shadow-md active:bg-email-white/20"
      >
        <Link to="/compose">Get Started Now</Link>
      </Button>
    </div>
  )
}
