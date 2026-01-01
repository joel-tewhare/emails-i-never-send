import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default function Compose() {
  return (
    <div className="min-h-screen w-full bg-email-grey p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-80">
          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-blue p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>

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
