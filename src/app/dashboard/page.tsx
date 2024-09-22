import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const page = async () => {
  const session = await getServerSession();
  if (!session) {
    return redirect("/login");
  }

  const user = session?.user;

  return (
    <main className="max-w-7xl mx-auto my-12 space-y-5">
      <h1 className="text-2xl font-semibold">welcome back {user?.email}</h1>
    </main>
  );
};

export default page;
