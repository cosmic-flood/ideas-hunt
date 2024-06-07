'use client'

import { Button } from '@/components/ui/shadcn-button';

export default function HeaderBar() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="text-4xl">
        <strong className="text-primary">R</strong>eddit
        <strong className="text-primary">S</strong>ale
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
              <Button onClick={()=>{
                window.location.href = `${window.location.protocol}//app.${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
              }}>Sign In / Up</Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
