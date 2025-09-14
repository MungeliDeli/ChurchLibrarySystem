import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../common/Button";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import { clsx } from "clsx";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const LoginForm = ({ onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-md w-full mx-auto shadow-elev-2 border-faint">
      <div className="text-center mb-6">
        <h2 className="text-h3 font-bold text-[color:var(--color-primary)]">
          Welcome Back
        </h2>
        <p className="text-h4 mt-2">Sign in to your Church Library account</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-caption mb-1 text-[color:var(--color-secondary-text)]"
          >
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className={clsx(
              "w-full px-3 py-2 border-faint rounded-md shadow-elev-1 bg-[color:var(--color-background)] text-[color:var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]",
              errors.email &&
                "border-[color:var(--color-error)] focus:ring-[color:var(--color-error)] focus:border-[color:var(--color-error)] text-[color:var(--color-error)]"
            )}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-caption text-[color:var(--color-error)]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-caption mb-1 text-[color:var(--color-secondary-text)]"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              className={clsx(
                "w-full px-3 py-2 pr-10 border-faint rounded-md shadow-elev-1 bg-[color:var(--color-background)] text-[color:var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]",
                errors.password &&
                  "border-[color:var(--color-error)] focus:ring-[color:var(--color-error)] focus:border-[color:var(--color-error)] text-[color:var(--color-error)]"
              )}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[color:var(--color-secondary-text)]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-caption text-[color:var(--color-error)]">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="small" color="white" />
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
