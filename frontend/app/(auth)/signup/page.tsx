import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight ">
            Create an account
          </h1>
          <p className="mt-2 text-sm">Sign up to start using AI Studio</p>
        </div>

        <div className=" shadow-md rounded-lg px-8 py-10">
          <SignupForm />
          <div className="mt-6 text-center text-sm ">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 ">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
