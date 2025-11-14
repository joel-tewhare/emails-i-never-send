import { Button } from '../../components/ui/button'
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
      {/* ------------------------------------- */}
      {/* NAVIGATION MENU */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Navigation Menu</h2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2">
                Playground
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* BUTTONS */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Buttons</h2>
        <div className="flex gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <Separator />

      {/* ------------------------------------- */}
      {/* INPUTS / TEXTAREA / SELECT */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Inputs & Form Fields</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="name@example.com" />
          </div>

          <div className="space-y-2">
            <Label>Your Message</Label>
            <Textarea placeholder="Write something..." />
          </div>

          <div className="space-y-2">
            <Label>Choose an option</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">Option One</SelectItem>
                <SelectItem value="two">Option Two</SelectItem>
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

      <Separator />

      {/* ------------------------------------- */}
      {/* DROPDOWN MENU */}
      {/* ------------------------------------- */}

      <section>
        <h2 className="mb-4 font-serif text-2xl">Dropdown Menu</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  )
}
