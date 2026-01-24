import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useLocation } from 'react-router'

export default function Navbar() {
  const location = useLocation()
  const showStartNewEmail =
    location.pathname === '/review' || location.pathname === '/final'
  const hideGetStarted = location.pathname !== '/'
  return (
    <div>
      <div className="flex w-full items-center border-b border-email-charcoal bg-email-grey py-4">
        <div className="flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {showStartNewEmail && (
                  <NavigationMenuLink
                    href="/compose"
                    className="border border-email-charcoal px-4 py-2 font-serif text-xl font-semibold decoration-email-charcoal underline-offset-2 shadow-md transition-colors duration-150 hover:bg-email-charcoal/10 active:bg-email-charcoal/20"
                  >
                    Start <span className="italic">new</span> email
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="fex-row flex items-center gap-2 px-4 text-xl font-bold"
                >
                  Emails I Never Send
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 justify-end">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {!hideGetStarted && (
                  <NavigationMenuLink
                    href="/compose"
                    className="rounded-xl bg-email-charcoal px-4 py-3 font-semibold text-email-white shadow-md transition-colors duration-150 hover:bg-email-charcoal/80 active:bg-email-white/20"
                  >
                    Get Started
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  )
}
