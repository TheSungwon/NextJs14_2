import { getServerSession } from "next-auth";
import Dashboard from "../../components/Dashboard";
import LoginForm from "./login/Form";

export default async function Home() {
  const session = await getServerSession();
  return (
    <main className="max-w-7xl mx-auto my-12 space-y-5">
      <Dashboard />
      {!session?.user && (
        <div>
          <LoginForm />
        </div>
      )}
    </main>
  );
}
