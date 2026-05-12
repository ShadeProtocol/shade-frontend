import { SignInClient } from "./sign-in-client";

export const metadata = {
  title: "Sign in | Shade",
  description: "Connect and verify your Stellar wallet to access Shade.",
};

export default function SignInPage() {
  return <SignInClient />;
}
