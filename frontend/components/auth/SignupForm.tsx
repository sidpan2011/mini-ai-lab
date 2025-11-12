"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    // Extract only email and password for API call
    const { email, password } = data;
    const result = await signup({ email, password });

    if (!result.success) {
      setError(result.error || "Signup failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          placeholder="your-name@email.com"
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 border  rounded-md "
          disabled={isLoading}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-400 ">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium ">
          Password
        </label>
        <div className="relative">
          <input
            placeholder="password"
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isLoading}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-muted-foreground"
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
          {errors.password && (
            <p id="password-error" className="text-sm text-red-400 ">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium ">
          Confirm Password
        </label>
        <div className="relative">
          <input
            placeholder="confirm password"
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border  rounded-md "
            disabled={isLoading}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-sm text-red-400 ">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-400 rounded-md " role="alert">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
