"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { auth } from "@/lib/firebase";

interface AdminAuthProps {
  children: React.ReactNode;
}

// ==========================================
// YOUR FIREBASE ADMIN UID
// ==========================================

const ADMIN_UID = "urmOm5bA8oX5Dmqyv41FA66cPh42";

export default function AdminAuth({
  children,
}: AdminAuthProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        // --------------------------------------
        // NOT LOGGED IN
        // --------------------------------------

        if (!currentUser) {
          setUser(null);
          setUnauthorized(false);
          setChecking(false);

          router.replace("/admin/login");

          return;
        }

        // --------------------------------------
        // CHECK ADMIN UID
        // --------------------------------------

        if (currentUser.uid !== ADMIN_UID) {
          console.error(
            "Unauthorized admin access:",
            currentUser.email,
            currentUser.uid
          );

          setUser(null);
          setUnauthorized(true);
          setChecking(false);

          return;
        }

        // --------------------------------------
        // ADMIN USER
        // --------------------------------------

        setUser(currentUser);
        setUnauthorized(false);
        setChecking(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  // ==========================================
  // CHECKING
  // ==========================================

  if (checking) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gray-50
          dark:bg-gray-950
        "
      >
        <div className="flex flex-col items-center gap-4">

          <Loader2
            size={36}
            className="
              animate-spin
              text-blue-600
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-gray-600
              dark:text-gray-400
            "
          >
            Checking administrator access...
          </p>

        </div>
      </main>
    );
  }

  // ==========================================
  // UNAUTHORIZED USER
  // ==========================================

  if (unauthorized) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gray-50
          px-5
          dark:bg-gray-950
        "
      >

        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-red-200
            bg-white
            p-8
            text-center
            shadow-xl
            dark:border-red-900
            dark:bg-gray-900
          "
        >

          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-red-100
              text-2xl
              dark:bg-red-950
            "
          >
            🚫
          </div>

          {/* TITLE */}

          <h1
            className="
              mt-5
              text-2xl
              font-extrabold
              text-gray-950
              dark:text-white
            "
          >
            Access Denied
          </h1>

          {/* MESSAGE */}

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-gray-600
              dark:text-gray-400
            "
          >
            You are signed in, but this account does
            not have administrator permission.
          </p>

          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => router.replace("/")}
            className="
              mt-6
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Back to Website
          </button>

        </div>

      </main>
    );
  }

  // ==========================================
  // NO USER
  // ==========================================

  if (!user) {
    return null;
  }

  // ==========================================
  // ADMIN CONTENT
  // ==========================================

  return <>{children}</>;
}