import { Button } from '@/components/ui/shadcn-button';
import { FaDiscord } from 'react-icons/fa';

export default async function HeaderBar() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="text-4xl">
        <strong className="text-primary">R</strong>eddit
        <strong className="text-primary">S</strong>ale
      </div>
      <nav>
        <ul className="flex space-x-4">
          {/* <li>
            <a
              href="https://discord.gg/kqRNEWeaJ7"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
            <Button>
              <FaDiscord className="mr-2 text-lg" /> Discord
            </Button>
            </a>
          </li> */}
          <li>
            <a href="/signin">
              <Button>Sign In / Up</Button>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
