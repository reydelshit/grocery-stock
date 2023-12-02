import pfp from '../assets/pfp.jpg';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="h-[8rem] border-2 text-center flex items-center justify-center">
      <h1 className="text-3xl font-bold uppercase">
        Grocery stock monitoring system
      </h1>
    </header>
  );
}
