import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
          Page Not Found
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>

          <Link to="/dashboard">
            <Button variant="outline" size="large" fullWidth>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
