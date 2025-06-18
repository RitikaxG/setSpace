import SignIn from "@/components/SignIn";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  // If session exists automatically redirect the user to "/"

  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/");
  }
  return <SignIn />;
}
