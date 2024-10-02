import navItems from "@/contents/navItems";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
export function Navbar() {
  return (
    <nav>
      <div className="flex justify-around items-center rounded-full bg-white/10 p-2 py-4 my-4 mx-4">
        <ThemeToggle />
        {Object.entries(navItems).map(([key, path]) => (
          <Link key={key} href={path}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Link>
        ))}
        <div>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
