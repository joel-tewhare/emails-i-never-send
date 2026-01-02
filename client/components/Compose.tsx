import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import scenarios from '../../public/assets/icons/scenarios.svg'
import moods from '../../public/assets/icons/prompt-moods.svg'
import limits from '../../public/assets/icons/word-time-limits.svg'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getScenarios } from '../apis/scenarios'
import { getMoods } from '../apis/moods'
import { getWordLimits } from '../apis/word-limits'

export default function Compose() {
  const {
    data: scenariosData,
    isPending: isPendingScenarios,
    error: scenariosError,
  } = useQuery({
    queryKey: ['scenarios'],
    queryFn: getScenarios,
  })

  const {
    data: moodsData,
    isPending: isPendingMoods,
    error: moodsError,
  } = useQuery({
    queryKey: ['moods'],
    queryFn: getMoods,
  })

  const {
    data: wordLimitsData,
    isPending: isPendingWordLimits,
    error: wordLimitsError,
  } = useQuery({
    queryKey: ['wordLimits'],
    queryFn: getWordLimits,
  })

  if (isPendingScenarios || isPendingMoods || isPendingWordLimits) {
    return <div>Loading...</div>
  }

  if (scenariosError || moodsError || wordLimitsError) {
    return <div>Error loading data</div>
  }

  if (!scenariosData || !moodsData || !wordLimitsData) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen w-full bg-email-grey p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="m-4 w-full space-y-8 md:w-80">
          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-blue p-4">
            <CardHeader>
              <CardTitle>
                <img src={scenarios} alt="scenario icons" />
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="space-y-2">
            <Label>Scenario</Label>
            <Select>
              <SelectTrigger className="bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="px-2 py-1 hover:bg-email-charcoal/80 hover:text-email-white"
                  value="one"
                >
                  Option One
                </SelectItem>
                <SelectItem
                  className="px-2 py-1 hover:bg-email-charcoal/80 hover:text-email-white"
                  value="two"
                >
                  Option Two
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-mauve p-4">
            <CardTitle className="p-10">
              <img src={moods} alt="mood icons" />
            </CardTitle>
          </Card>

          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-gold p-4">
            <CardTitle className="p-10">
              <img src={limits} alt="word and time icons" />
            </CardTitle>
          </Card>

          <Button className="rounded-xl bg-email-charcoal px-4 py-3 text-email-charcoal text-email-white hover:shadow-md">
            Get Prompt
          </Button>
        </div>
        <div className="w-full flex-1">
          <Card className="mb-8 max-w-xl bg-email-white">
            <CardHeader className="pl-3 pt-2 font-serif">
              <CardTitle>Prompt:</CardTitle>
            </CardHeader>
            <CardContent className="font-style: pb-3 pl-3 pt-2 font-serif text-xl italic">
              Write an email to your colleague Jamie. Congratulate them on
              completing a challenging project and highlight a moment where
              their leadership stood out.
            </CardContent>
          </Card>

          <Card className="max-w-xl rounded-none bg-email-white">
            <div className="flex flex-row justify-end">
              <CardContent className="pb-3 pl-3 pr-4 pt-2 text-sm font-bold">
                Word Limit:
              </CardContent>
              <CardContent className="pb-3 pl-3 pr-12 pt-2 text-sm font-bold">
                Timer:
              </CardContent>
            </div>
          </Card>
          <p>
            * Word Limit and Timer can be replaced with graphics in
            public/assets/images
          </p>

          <Textarea
            className="h-80 px-2 py-2 text-sm"
            placeholder="Write your email here..."
          />

          <Card className="h-16 max-w-xl rounded-none bg-email-white">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button className="rounded-xl bg-email-mint px-4 py-3 text-email-charcoal hover:shadow-md">
                  Review
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
