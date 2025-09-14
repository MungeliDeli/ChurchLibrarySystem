import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearError } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../../components/auth/LoginForm";
import splashIcon from "../../assets/splash-icon.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login, isLoading, error } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);

      if (result.success) {
        // Login successful, redirect to intended page
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is already handled by the Redux slice
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src={splashIcon}
            alt="Church Library"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-h2 text-[var(--color-primary-text)] font-bold">
            Church Library
          </h1>
          <p className="mt-2 text-subheading">Admin Dashboard</p>
        </div>

        {error && (
          <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-[var(--color-error)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-[var(--color-error)]">{error}</p>
              </div>
            </div>
          </div>
        )}

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default LoginPage;
