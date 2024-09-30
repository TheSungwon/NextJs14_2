"use client";

import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { getNavItems, NavItemsType } from "@/contents/navItems";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [navItems, setNavItems] = useState<NavItemsType>({} as NavItemsType);

  useEffect(() => {
    setNavItems(getNavItems(status === "authenticated"));
  }, [status]);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signOut();
  };

  return (
    <nav>
      <div className="flex justify-around items-center rounded-full bg-white/10 p-2 py-4 my-4 mx-4">
        <ThemeToggle />
        {Object.entries(navItems).map(([key, path]) => (
          <Link
            key={key}
            href={path}
            onClick={key === "logout" ? handleLogout : undefined}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
