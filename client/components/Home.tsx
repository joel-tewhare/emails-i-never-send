import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-email-grey px-4 pb-12 pt-8 md:px-6 md:pb-0 md:pt-0">
      <div className="mb-24 mt-20 flex h-96 flex-col items-center justify-center gap-4 md:my-0 md:mb-0 md:h-screen md:flex-row">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="icons graphic"
          className="block"
        />
        <img
          src="/assets/images/landing-page-text-graphic.svg"
          alt="landing page logo"
          className="hidden md:block"
        />
      </div>

      <p className="max-w-4xl px-2 pb-10 pt-6 text-center text-2xl font-bold md:pb-12 md:pt-0">
        Emails aren’t always easy.
      </p>
      <p className="max-w-4xl px-2 pb-10 text-center text-2xl font-bold md:pb-12">
        This reflective writing tool uses real-life prompts and AI coaching to
        simulate outcomes and help you build confidence in professional and
        emotional communication.
      </p>

      <div className="mx-4 my-10 flex flex-col flex-wrap items-center justify-center gap-8 md:mx-8 md:my-6 md:flex-row md:gap-0">
        <Card className="flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-blue p-8 md:m-12">
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
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Card className="mb-4 max-w-[400px] rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center md:mb-8">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Choose from <span className="italic">everyday</span> scenarios
            </CardContent>
          </Card>
          <p className="max-w-xl text-lg">
            Prompts drawn from real-life scenarios to help you practise writing
            in a way that feels natural and authentic.
          </p>
        </div>
      </div>

      <div className="mx-4 my-10 flex flex-col flex-wrap items-center justify-center gap-8 md:mx-8 md:my-6 md:flex-row md:gap-0">
        <Card className="flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-mauve p-8 md:m-12">
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
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Card className="mb-4 max-w-lg rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center md:mb-8">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Prompts for <span className="italic">positive</span> and{' '}
              <span className="italic">negative</span> situations
            </CardContent>
          </Card>
          <p className="max-w-xl text-lg">
            Practice writing uplifting messaging or try a harder-to-have
            conversation. Relatable topics we all face from time to time.
          </p>
        </div>
      </div>

      <div className="mx-4 my-10 flex flex-col flex-wrap items-center justify-center gap-8 md:mx-8 md:my-6 md:flex-row md:gap-0">
        <Card className="flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-gold p-8 md:m-12">
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
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Card className="mb-4 max-w-md rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center md:mb-8">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              Add word <span className="italic">limits</span> and time
              <span className="italic"> restrictions</span>
            </CardContent>
          </Card>
          <p className="max-w-xl text-lg">
            Set word and time limits to help you communicate effectively and
            efficiently.
          </p>
        </div>
      </div>

      <div className="mx-4 my-10 flex flex-col flex-wrap items-center justify-center gap-8 md:mx-8 md:my-6 md:flex-row md:gap-0">
        <Card className="flex h-20 w-64 items-center justify-center border-2 border-email-charcoal bg-email-mint p-8 md:m-12">
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
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Card className="mb-4 max-w-xs rounded-none border-2 border-email-charcoal bg-email-white p-2 text-center md:mb-8">
            <CardContent className="font-style: p-2 font-serif text-2xl">
              <span className="italic">Reflect</span> before you revise
            </CardContent>
          </Card>
          <p className="max-w-xl text-lg">
            Your AI coach rates the impact of your email, sharing key takeaways
            and reflections to help you decide what to change before a final
            review.
          </p>
        </div>
      </div>

      <Button
        asChild
        className="w-42 mb-12 mt-10 flex h-14 items-center justify-center rounded-xl bg-email-charcoal px-6 text-lg font-semibold text-email-white shadow-md transition-colors duration-150 hover:bg-email-charcoal/80 hover:shadow-md active:bg-email-white/20 md:mb-16 md:mt-12"
      >
        <Link to="/compose">Get Started Now</Link>
      </Button>
    </div>
  )
}
