import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default function NavbarComponent() {
   return (
      <div className="w-full shadow-sm px-16 py-3">
         <div className="flex items-center justify-between">
            <div className="font-bold text-xl">
               Logo
            </div>
            <NavigationMenu>
               <NavigationMenuList className="space-x-10 ">
                  <NavigationMenuItem className="hover-">
                     <Link href="/admin/dashboard" className="text-sm">
                        Dashboard
                     </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="hover-">
                     <Link href="/admin/users" className="text-sm">
                        Users
                     </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="hover-">
                     <Link href="/admin/quiz" className="text-sm">
                        Quiz
                     </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="hover-">

                  </NavigationMenuItem>
               </NavigationMenuList>
            </NavigationMenu>
            <div className="flex flex-row gap-4 items-center">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <Link href="/api/auth/signout" className="text-sm">
                  <LogOut size={18} className="text-red-400" />
               </Link>
            </div>
         </div>
      </div>
   )
}
