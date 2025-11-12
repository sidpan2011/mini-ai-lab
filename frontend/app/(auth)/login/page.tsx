import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm ">Log in to your AI Studio account</p>
        </div>

        <div className=" shadow-md rounded-lg px-8 py-10">
          <LoginForm />

          <div className="mt-6 text-center text-sm ">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
