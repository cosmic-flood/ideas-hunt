import { Button } from '@/components/ui/shadcn-button';

export default async function HeaderBar() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="text-4xl">
        <strong className="text-primary">R</strong>eddit
        <strong className="text-primary">S</strong>ale
      </div>
      <nav>
        <ul className="flex space-x-4">
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
