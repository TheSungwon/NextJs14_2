// rafce

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Form from "./Form";

const page = async () => {
  const session = await getServerSession();
  console.log(session);

  if (session) {
    redirect("/");
  }
  return (
    <section className="container h-screen flex items-center justify-center">
      <div className="w-[800]">
        <Form />
      </div>
    </section>
  );
};

export default page;
