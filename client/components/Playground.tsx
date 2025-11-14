import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

export default function ComponentPlayground() {
  return (
    <div className="bg-email-grey space-y-12 p-8">
      {/* TAILWIND NOTES
        - rounded-xl for rounded corners
        - hover:underline for underline highlight of link
        - px / py is padding for sides / top & bottom
        - hover:bg ... /80 sets opacity of 80% for bg when hovering over button
        - grid sets container as grid
        - sm:grid-cols-2 / lg:grid-cols-3 means small screen 2 columns / large 3
        - flex flex-col items-start stacks items as column and keeps to left side
      
      */}

      {/* ------------------------------------- */}
      {/* NAVIGATION MENU */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Navigation Menu</h2>
        {/* WHOLE navbar */}
        <div className="border-email-charcoal flex w-full items-center border-b py-4">
          {/* LEFT section */}
          <div className="flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href=""
                    className="decoration-email-charcoal px-4 py-2 underline-offset-2 hover:underline"
                  >
                    {'< back to compose'}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* MIDDLE section */}
          <div className="flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href=""
                    className="px-4 py-2 text-sm font-bold"
                  >
                    EMAILS I NEVER SEND
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-1 justify-end">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="" className="px-4 py-2">
                    Log In
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href=""
                    className="bg-email-charcoal text-email-white hover:bg-email-charcoal/80 rounded-xl px-4 py-3 hover:shadow-md"
                  >
                    Get Started
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* BUTTONS */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Buttons</h2>
        <div className="flex gap-4">
          {/* BUTTON 1 */}
          <Button className="bg-email-mint text-email-charcoal rounded-xl px-4 py-3 hover:shadow-md">
            Action 1
          </Button>

          {/* BUTTON 2 */}
          <Button className="bg-email-charcoal text-email-white hover:bg-email-charcoal/80 rounded-xl px-4 py-3 hover:shadow-md">
            Action 2
          </Button>

          {/* BUTTON - DISABLED */}
          <Button
            disabled
            className="bg-email-charcoal text-email-white hover:bg-email-charcoal/80 rounded-xl px-4 py-3 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
          >
            Disabled
          </Button>
        </div>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* DROPDOWN MENU */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Dropdown Menu</h2>
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-email-white text-email-charcoal hover:bg-email-charcoal/80 border-email-charcoal hover:text-email-white border-2 px-4 py-3 hover:shadow-md">
                Username
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="hover:bg-email-charcoal/80 hover:text-email-white bg-email-white justify-end py-2 pl-5">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-email-charcoal/80 hover:text-email-white bg-email-white justify-end py-2 pl-5">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* INPUTS / TEXTAREA / SELECT */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Inputs & Form Fields</h2>

        {/* SIMPLE LABEL & FORM */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              className="py-2 pl-2 text-sm"
              placeholder="name@example.com"
            />
          </div>

          {/* TEXT BOX */}
          <div className="space-y-2">
            <Label>Email Text Area</Label>
            <Textarea
              className="h-80 px-2 py-2 text-sm"
              placeholder="Write your email here..."
            />
          </div>

          {/* DROPDOWN SELECT */}
          <div className="space-y-2">
            <Label>Choose an option</Label>
            <Select>
              <SelectTrigger className="bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-email-charcoal/80 hover:text-email-white px-2 py-1"
                  value="one"
                >
                  Option One
                </SelectItem>
                <SelectItem
                  className="hover:bg-email-charcoal/80 hover:text-email-white px-2 py-1"
                  value="two"
                >
                  Option Two
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* ICON CARD */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Icon Card</h2>
        <p>
          * These are for individual use. There is a group (column) graphic in
          public/assets/images
        </p>
        <div className="grid gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* BLUE */}
          <Card className="bg-email-blue border-email-charcoal flex h-20 w-64 items-center justify-center border p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>

          {/* MAUVE */}
          <Card className="bg-email-mauve border-email-charcoal flex h-20 w-64 items-center justify-center border p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>

          {/* GOLD */}
          <Card className="bg-email-gold border-email-charcoal flex h-20 w-64 items-center justify-center border p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>

          {/* MINT */}
          <Card className="bg-email-mint border-email-charcoal flex h-20 w-64 items-center justify-center border p-4">
            <CardHeader>
              <CardTitle>icon graphic here</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* CARD */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Card</h2>
        <div className="space-y-6">
          {/* PROMPT */}
          <Card className="bg-email-white max-w-xl">
            <CardHeader className="pl-3 pt-2 font-serif">
              <CardTitle>Prompt:</CardTitle>
            </CardHeader>
            <CardContent className="font-style: pb-3 pl-3 pt-2 font-serif text-xl italic">
              Write an email to your colleague Jamie. Congratulate them on
              completing a challenging project and highlight a moment where
              their leadership stood out.
            </CardContent>
          </Card>

          {/* ORIGINAL EMAIL */}
          <Card className="bg-email-mint max-w-xl overflow-y-auto rounded-none">
            <CardHeader className="pl-3 pt-2">
              <CardTitle>Original email:</CardTitle>
            </CardHeader>
            <ScrollArea className="font-style: h-64 p-3 text-sm ">
              Original email content goes here...
            </ScrollArea>
          </Card>

          {/* WORD & TIME LIMIT */}
          <Card className="bg-email-white max-w-xl rounded-none">
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

          {/* EMAIL ACTION BUTTON */}
          <Card className="bg-email-white h-16 max-w-xl rounded-none">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                [Action Button here]
              </CardContent>
            </div>
          </Card>

          {/* PROFILE HEADER */}
          <Card className="bg-email-white max-w-xl rounded-none">
            <div className="flex flex-row justify-center">
              <CardContent className="text-md pb-3 pl-3 pr-4 pt-2 font-bold">
                Your Details
              </CardContent>
            </div>
          </Card>

          {/* SAVED EMAIL COLOUR KEY */}
          <Card className="bg-email-white max-w-xxl rounded-none">
            <div className="flex flex-row justify-center">
              <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
                <div className="bg-email-blue h-4 w-4 rounded-sm"></div>
                <p>Work</p>
              </CardContent>
              <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
                <div className="bg-email-gold h-4 w-4 rounded-sm"></div>
                <p>Relationships</p>
              </CardContent>
              <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
                <div className="bg-email-mauve h-4 w-4 rounded-sm"></div>
                <p>Customer Service</p>
              </CardContent>
              <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
                <div className="bg-email-mint h-4 w-4 rounded-sm"></div>
                <p>Emotional Honesty</p>
              </CardContent>
              <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
                <div className="bg-email-white border-email-charcoal/50 h-4 w-4 rounded-sm border"></div>
                <p>Conflict Resolution</p>
              </CardContent>
            </div>
          </Card>

          {/* AI REVIEW */}
          <Card className="bg-email-charcoal text-email-white h-96 max-w-md overflow-y-auto rounded-none">
            <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
              <CardTitle>Here&apos;s your review,</CardTitle>
            </CardHeader>
            <ScrollArea className="text-md h-80 p-3 px-6 font-serif">
              AI review goes here...
            </ScrollArea>
          </Card>

          {/* SAVED EMAILS */}
          <Card className="bg-email-white text-email-charcoal h-96 max-w-md overflow-y-auto rounded-none">
            <CardHeader className="py-6 pl-3 text-center text-lg font-bold">
              <CardTitle>SAVED EMAILS</CardTitle>
            </CardHeader>
            <div className="w-full">
              <Button className="bg-email-blue border-email-charcoal/10 hover:border-email-charcoal/50 flex w-full flex-col items-start space-y-2 border-b px-3 py-3 text-sm hover:border">
                <p className="font-bold">15/11/25</p>
                <p>First few words of email here ...</p>
              </Button>
              <Button className="bg-email-gold hover:border-email-charcoal/50 border-email-charcoal/10 flex w-full flex-col items-start space-y-2 border-b px-3 py-3 text-sm hover:border">
                <p className="font-bold">12/11/25</p>
                <p>First few words of email here ...</p>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
