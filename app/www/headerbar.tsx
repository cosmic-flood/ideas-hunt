'use client';

import { Button } from '@/components/ui/shadcn-button';
import { getAppUrl } from '@/utils/helpers';

export default function HeaderBar() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="space-x-0.5 text-4xl">
        <strong className="font-extrabold">
          <span className="text-primary">R</span>eddit
        </strong>
        <strong className="font-extrabold">
          <span className="text-primary">S</span>ale
        </strong>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Button
              onClick={() =>
                (window.location.href = getAppUrl(window.location))
              }
            >
              Sign In / Up
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
