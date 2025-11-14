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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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
import { Form } from '@/components/ui/form'

export default function ComponentPlayground() {
  return (
    <div className="space-y-12 p-8">
      {/* TAILWIND NOTES
        - rounded-xl for rounded corners
        - hover:underline for underline highlight of link
        - px / py is padding for sides / top & bottom
        - hover:bg ... /80 sets opacity of 80% for bg when hovering over button
      
      */}

      {/* ------------------------------------- */}
      {/* NAVIGATION MENU */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Navigation Menu</h2>
        {/* WHOLE navbar */}
        <div className="flex w-full items-center py-4">
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
              <DropdownMenuItem className="hover:bg-email-charcoal/80 hover:text-email-white justify-end py-2 pl-5">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-email-charcoal/80 hover:text-email-white justify-end py-2 pl-5">
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
              <SelectTrigger className="px-2">
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
      {/* CARD */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Card</h2>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Example</CardTitle>
          </CardHeader>
          <CardContent>A simple card with header and content.</CardContent>
        </Card>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* TABS */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Tabs</h2>

        <Tabs defaultValue="one" className="w-full max-w-xl">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>

          <TabsContent value="one">Content for tab one</TabsContent>
          <TabsContent value="two">Content for tab two</TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* SCROLL AREA */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Scroll Area</h2>

        <ScrollArea className="h-32 w-64 border p-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eros
            lorem, lacinia at est non, tempus fermentum urna. Vestibulum feugiat
            dolor magna, non dignissim libero lacinia id. Phasellus porttitor mi
            nec nisi gravida, at viverra leo laoreet.
          </p>
        </ScrollArea>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* BADGE */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Badge</h2>

        <Badge>Badge</Badge>
      </section>
    </div>
  )
}
