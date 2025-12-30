import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

export default function Navbar() {
  return (
    <div>
      <div className="flex w-full items-center border-b border-email-charcoal py-4">
        <div className="flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href=""
                  className="px-4 py-2 decoration-email-charcoal underline-offset-2 hover:underline"
                >
                  {'< back to compose'}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

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
                  className="rounded-xl bg-email-charcoal px-4 py-3 text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
                >
                  Get Started
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  )
}
