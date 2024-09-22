// rafce

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import LoginForm from "./Form";

const page = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }
  return (
    <section className="container h-screen flex items-center justify-center">
      <div className="w-[800]">
        <LoginForm />
      </div>
    </section>
  );
};

export default page;
