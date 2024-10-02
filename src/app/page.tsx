import { getServerSession } from "next-auth";
import Dashboard from "../../components/Dashboard";
import LoginForm from "./login/Form";

export default async function Home() {
  const session = await getServerSession();
  return <div>Home</div>;
}
