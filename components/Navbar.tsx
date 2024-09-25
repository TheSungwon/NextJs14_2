import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
export function Navbar() {
  return (
    <nav>
      <div className="flex justify-around items-center rounded-full bg-white/10 p-2 py-4 my-4 mx-4">
        <ThemeToggle />
        <Link className="hover:underline hover:text-gray-500" href="#">
          Home
        </Link>
        <Link className="hover:underline hover:text-gray-500" href="#">
          About
        </Link>
        <Link className="hover:underline hover:text-gray-500" href="#">
          Contact
        </Link>
      </div>
    </nav>
  );
}
