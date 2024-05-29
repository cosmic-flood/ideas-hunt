import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/shadcn-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import NavLinks from '@/components/ui/navlinks';
import { createClient } from '@/utils/supabase/server';

export default async function Header() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <GuestUserHeader />;
  }

  return <AuthenticatedUserHeader />;
}

function AuthenticatedUserHeader() {
  return (
    <div className="w-full border-b p-4 sm:px-6 sm:py-0 md:gap-8">
      <header className="flex items-center justify-between py-2">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 space-x-0.5" aria-label="Logo">
            <span className="font-extrabold">R</span>eddit
            <span className="font-extrabold">L</span>eads
          </Link>
          <NavLinks></NavLinks>
        </div>
        <User />
      </header>
    </div>
  );
}

function GuestUserHeader() {
  return (
    <div className="w-full border-b p-4 sm:px-6 sm:py-0 md:gap-8">
      <header className="flex items-center justify-between py-2">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6" aria-label="Logo">
            <span className="font-extrabold">R</span>eddit
            <span className="font-extrabold">L</span>eads
          </Link>
        </div>
      </header>
    </div>
  );
}

function User() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
