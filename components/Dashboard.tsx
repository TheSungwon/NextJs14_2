"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      {session ? (
        <>
          <h1 className="text-3xl text-green-500 font-bold">
            {JSON.stringify(session)}
          </h1>
          <button
            className="border border-black rounded-lg bg-red-400 py-1 px-5"
            onClick={() => signOut()}
          >
            sign out
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-red-500 font-bold">
            you are not logged in
          </h1>
          <div className="flex space-x-5">
            <button
              className="border border-black rounded-lg  py-1 px-5"
              onClick={() => signIn("google")}
            >
              Sign in with google
            </button>
            <button
              className="border border-black rounded-lg  py-1 px-5"
              onClick={() => signIn("a")}
            >
              Credentials
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
