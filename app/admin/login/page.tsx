"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  /*
   * ================================
   * CHECK EXISTING LOGIN
   * ================================
   */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  /*
   * ================================
   * LOGIN
   * ================================
   */

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      router.replace("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Incorrect email or password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please try again later."
          );
          break;

        default:
          setError(
            "Unable to sign in. Please check your Firebase configuration."
          );
      }

      setLoading(false);
    }
  }

  /*
   * ================================
   * AUTH CHECKING
   * ================================
   */

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-gray-50
        px-5
        py-10
        dark:bg-gray-950
      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-96
          w-96
          rounded-full
          bg-blue-100
          blur-3xl
          dark:bg-blue-950/40
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-40
          h-96
          w-96
          rounded-full
          bg-blue-100
          blur-3xl
          dark:bg-blue-950/30
        "
      />

      {/* Login Card */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-gray-200
            bg-white
            p-7
            shadow-2xl
            shadow-gray-900/10
            sm:p-9
            dark:border-gray-800
            dark:bg-gray-900
          "
        >
          {/* Icon */}

          <div className="flex justify-center">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-white
                shadow-xl
                shadow-blue-600/25
              "
            >
              <ShieldCheck size={32} />
            </div>
          </div>

          {/* Heading */}

          <div className="mt-6 text-center">
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-blue-600
                dark:text-blue-400
              "
            >
              Admin Panel
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-extrabold
                tracking-tight
                text-gray-950
                dark:text-white
              "
            >
              Welcome Back
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              Sign in to manage your portfolio.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div
              className="
                mt-6
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                font-medium
                text-red-700
                dark:border-red-900
                dark:bg-red-950/40
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-800
                  dark:text-gray-200
                "
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-11
                    pr-4
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:border-gray-700
                    dark:bg-gray-950
                    dark:text-white
                  "
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-800
                  dark:text-gray-200
                "
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-11
                    pr-12
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:border-gray-700
                    dark:bg-gray-950
                    dark:text-white
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    p-2
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                    dark:hover:bg-gray-800
                    dark:hover:text-gray-200
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-blue-700
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}

          <div
            className="
              mt-7
              border-t
              border-gray-100
              pt-5
              text-center
              dark:border-gray-800
            "
          >
            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-500
              "
            >
              Secure administrator access
            </p>
          </div>
        </div>

        {/* Back to portfolio */}

        <div className="mt-5 text-center">
          <a
            href="/"
            className="
              text-sm
              font-semibold
              text-gray-500
              transition
              hover:text-blue-600
              dark:text-gray-400
              dark:hover:text-blue-400
            "
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    </main>
  );
}