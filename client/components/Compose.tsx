import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Compose() {
  return (
    <div className="min-h-screen w-full bg-email-grey p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="m-4 w-full space-y-8 md:w-80">
          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-blue p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
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
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>

          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-gold p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="w-full flex-1">Prompt and text area here</div>
      </div>
    </div>
  )
}
