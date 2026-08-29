"use client";

import { useEffect, useState } from "react";
import { signOut, User } from "firebase/auth";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import {
  FolderKanban,
  Plus,
  MessageSquare,
  Mail,
  LogOut,
  UserCircle,
  ArrowRight,
  LayoutDashboard,
  Settings,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import AdminAuth from "@/app/components/AdminAuth";

interface AdminDashboardContentProps {
  user: User;
}

function AdminDashboardContent({
  user,
}: AdminDashboardContentProps) {
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================
  // COUNTS
  // ==========================================

  const [projectCount, setProjectCount] = useState<number | null>(
    null
  );

  const [feedbackCount, setFeedbackCount] = useState<number | null>(
    null
  );

  const [contactCount, setContactCount] = useState<number | null>(
    null
  );

  const [newContactCount, setNewContactCount] = useState<number | null>(
    null
  );

  const [loadingStats, setLoadingStats] = useState(true);

  // ==========================================
  // LOAD DASHBOARD STATISTICS
  // ==========================================

  useEffect(() => {
    let mounted = true;

    async function loadStatistics() {
      try {
        if (mounted) {
          setLoadingStats(true);
        }

        const projectsQuery = collection(
          db,
          "projects"
        );

        const feedbackQuery = collection(
          db,
          "feedback"
        );

        const contactQuery = collection(
          db,
          "contactMessages"
        );

        const newContactQuery = query(
          collection(db, "contactMessages"),
          where("status", "==", "new")
        );

        const [
          projectsSnapshot,
          feedbackSnapshot,
          contactSnapshot,
          newContactSnapshot,
        ] = await Promise.all([
          getCountFromServer(projectsQuery),

          getCountFromServer(feedbackQuery),

          getCountFromServer(contactQuery),

          getCountFromServer(newContactQuery),
        ]);

        if (!mounted) {
          return;
        }

        setProjectCount(
          projectsSnapshot.data().count
        );

        setFeedbackCount(
          feedbackSnapshot.data().count
        );

        setContactCount(
          contactSnapshot.data().count
        );

        setNewContactCount(
          newContactSnapshot.data().count
        );

      } catch (error) {
        console.error(
          "Dashboard statistics error:",
          error
        );

        if (mounted) {
          setProjectCount(null);
          setFeedbackCount(null);
          setContactCount(null);
          setNewContactCount(null);
        }
      } finally {
        if (mounted) {
          setLoadingStats(false);
        }
      }
    }

    // Load immediately
    loadStatistics();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      loadStatistics();
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut(auth);

      router.replace("/admin/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      setLoggingOut(false);
    }
  }

  // ==========================================
  // DISPLAY COUNT
  // ==========================================

  function displayCount(
    count: number | null
  ) {
    if (loadingStats) {
      return "…";
    }

    if (count === null) {
      return "0";
    }

    return count;
  }

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        text-gray-900
        dark:bg-gray-950
        dark:text-white
      "
    >

      {/* =====================================
          TOP NAVIGATION
      ====================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-gray-200
          bg-white/90
          backdrop-blur-xl
          dark:border-gray-800
          dark:bg-gray-950/90
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-5
          "
        >

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-lg
                shadow-blue-600/20
              "
            >
              <LayoutDashboard size={20} />
            </div>

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-950
                  dark:text-white
                "
              >
                Admin Panel
              </p>

              <p
                className="
                  hidden
                  text-xs
                  text-gray-500
                  sm:block
                  dark:text-gray-400
                "
              >
                Portfolio Management
              </p>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            {/* VIEW PORTFOLIO */}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                px-4
                py-2
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:border-blue-500
                hover:text-blue-600
                sm:flex
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:border-blue-400
                dark:hover:text-blue-400
              "
            >
              View Portfolio

              <ExternalLink size={15} />
            </a>

            {/* USER */}

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                bg-gray-100
                px-3
                py-2
                md:flex
                dark:bg-gray-900
              "
            >

              <UserCircle
                size={18}
                className="text-gray-500"
              />

              <span
                className="
                  max-w-[180px]
                  truncate
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                {user.email}
              </span>

            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                px-3
                py-2
                text-sm
                font-semibold
                text-red-600
                transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:border-red-900
                dark:text-red-400
                dark:hover:bg-red-950/40
              "
            >

              {loggingOut ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <LogOut size={17} />
              )}

              <span className="hidden sm:inline">
                Logout
              </span>

            </button>

          </div>

        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-8
          sm:py-10
        "
      >

        {/* WELCOME */}

        <div className="mb-8">

          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.2em]
              text-blue-600
              dark:text-blue-400
            "
          >
            Dashboard
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-extrabold
              tracking-tight
              text-gray-950
              sm:text-4xl
              dark:text-white
            "
          >
            Welcome back 👋
          </h1>

          <p
            className="
              mt-2
              text-gray-600
              dark:text-gray-400
            "
          >
            Manage your portfolio content from one place.
          </p>

        </div>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {/* PROJECTS */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Projects
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-extrabold
                    text-gray-950
                    dark:text-white
                  "
                >
                  {displayCount(projectCount)}
                </p>

              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  dark:bg-blue-950/50
                  dark:text-blue-400
                "
              >
                <FolderKanban size={22} />
              </div>

            </div>

            <p
              className="
                mt-3
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Projects stored in Firestore
            </p>

          </div>

          {/* FEEDBACK */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Feedback
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-extrabold
                    text-gray-950
                    dark:text-white
                  "
                >
                  {displayCount(feedbackCount)}
                </p>

              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-50
                  text-purple-600
                  dark:bg-purple-950/50
                  dark:text-purple-400
                "
              >
                <MessageSquare size={22} />
              </div>

            </div>

            <p
              className="
                mt-3
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Visitor feedback
            </p>

          </div>

          {/* =================================
              CONTACT MESSAGES
          ================================= */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Messages
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-extrabold
                    text-gray-950
                    dark:text-white
                  "
                >
                  {displayCount(contactCount)}
                </p>

              </div>

              {/* MAIL ICON + NEW BADGE */}

              <div className="relative">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-50
                    text-orange-600
                    dark:bg-orange-950/50
                    dark:text-orange-400
                  "
                >
                  <Mail size={22} />
                </div>

                {/* RED NOTIFICATION BADGE */}

                {newContactCount !== null &&
                  newContactCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-2
                        -top-2
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-red-600
                        px-1.5
                        text-xs
                        font-bold
                        text-white
                        shadow-lg
                        ring-2
                        ring-white
                        dark:ring-gray-900
                      "
                    >
                      {newContactCount > 99
                        ? "99+"
                        : newContactCount}
                    </span>
                  )}

              </div>

            </div>

            {/* CONTACT DESCRIPTION */}

            <div className="mt-3 flex items-center gap-2">

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Contact form messages
              </p>

              {/* NEW COUNT */}

              {newContactCount !== null &&
                newContactCount > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-red-100
                      px-2
                      py-0.5
                      text-[10px]
                      font-bold
                      text-red-600
                      dark:bg-red-950
                      dark:text-red-400
                    "
                  >
                    {newContactCount} new
                  </span>
                )}

            </div>

          </div>

          {/* ACCOUNT */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Account
                </p>

                <p
                  className="
                    mt-2
                    text-lg
                    font-extrabold
                    text-gray-950
                    dark:text-white
                  "
                >
                  Administrator
                </p>

              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                  dark:bg-green-950/50
                  dark:text-green-400
                "
              >
                <UserCircle size={22} />
              </div>

            </div>

            <p
              className="
                mt-3
                truncate
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              {user.email}
            </p>

          </div>

        </div>

        {/* =====================================
            MANAGEMENT
        ====================================== */}

        <div className="mt-8">

          <h2
            className="
              text-xl
              font-bold
              text-gray-950
              dark:text-white
            "
          >
            Manage Portfolio
          </h2>

          <div
            className="
              mt-5
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {/* ADD PROJECT */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/projects/new"
                )
              }
              className="
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-300
                hover:shadow-xl
                dark:border-gray-800
                dark:bg-gray-900
                dark:hover:border-blue-800
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    text-white
                    shadow-lg
                    shadow-blue-600/20
                  "
                >
                  <Plus size={24} />
                </div>

                <ArrowRight
                  size={20}
                  className="
                    text-gray-400
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-blue-600
                  "
                />

              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-gray-950
                  dark:text-white
                "
              >
                Add New Project
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Add a completed project to your portfolio
                without changing your website code.
              </p>

            </button>

            {/* MANAGE PROJECTS */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/projects"
                )
              }
              className="
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-300
                hover:shadow-xl
                dark:border-gray-800
                dark:bg-gray-900
                dark:hover:border-purple-800
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-600
                    text-white
                    shadow-lg
                    shadow-purple-600/20
                  "
                >
                  <FolderKanban size={24} />
                </div>

                <ArrowRight
                  size={20}
                  className="
                    text-gray-400
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-purple-600
                  "
                />

              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-gray-950
                  dark:text-white
                "
              >
                Manage Projects
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Edit, delete and organize projects already
                published on your portfolio.
              </p>

            </button>

            {/* MANAGE FEEDBACK */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/feedback"
                )
              }
              className="
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-green-300
                hover:shadow-xl
                dark:border-gray-800
                dark:bg-gray-900
                dark:hover:border-green-800
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-600
                    text-white
                    shadow-lg
                    shadow-green-600/20
                  "
                >
                  <MessageSquare size={24} />
                </div>

                <ArrowRight
                  size={20}
                  className="
                    text-gray-400
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-green-600
                  "
                />

              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-gray-950
                  dark:text-white
                "
              >
                Manage Feedback
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Review visitor feedback and control which
                feedback appears on your portfolio.
              </p>

            </button>

            {/* CONTACT MESSAGES */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/contact"
                )
              }
              className="
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-300
                hover:shadow-xl
                dark:border-gray-800
                dark:bg-gray-900
                dark:hover:border-blue-800
              "
            >

              <div className="flex items-start justify-between">

                <div className="relative">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-600
                      text-white
                      shadow-lg
                      shadow-blue-600/20
                    "
                  >
                    <Mail size={24} />
                  </div>

                  {/* CARD BADGE */}

                  {newContactCount !== null &&
                    newContactCount > 0 && (
                      <span
                        className="
                          absolute
                          -right-2
                          -top-2
                          flex
                          h-6
                          min-w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-red-600
                          px-1.5
                          text-[10px]
                          font-bold
                          text-white
                          shadow-lg
                          ring-2
                          ring-white
                          dark:ring-gray-900
                        "
                      >
                        {newContactCount > 99
                          ? "99+"
                          : newContactCount}
                      </span>
                    )}

                </div>

                <ArrowRight
                  size={20}
                  className="
                    text-gray-400
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-blue-600
                  "
                />

              </div>

              <div className="mt-5 flex items-center gap-2">

                <h3
                  className="
                    text-xl
                    font-bold
                    text-gray-950
                    dark:text-white
                  "
                >
                  Contact Messages
                </h3>

              </div>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                "
              >
                View and manage messages submitted through
                your website contact form.
              </p>

              {/* NEW MESSAGE TEXT */}

              {newContactCount !== null &&
                newContactCount > 0 && (
                  <div
                    className="
                      mt-4
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-red-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-red-600
                      dark:bg-red-950/40
                      dark:text-red-400
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-red-600" />

                    {newContactCount} new message
                    {newContactCount !== 1
                      ? "s"
                      : ""}
                  </div>
                )}

            </button>

            {/* SETTINGS */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/portfolio-settings"
                )
              }
              className="
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-gray-300
                hover:shadow-xl
                dark:border-gray-800
                dark:bg-gray-900
                dark:hover:border-gray-700
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-gray-100
                    text-gray-700
                    dark:bg-gray-800
                    dark:text-gray-300
                  "
                >
                  <Settings size={24} />
                </div>

                <ArrowRight
                  size={20}
                  className="
                    text-gray-400
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />

              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-gray-950
                  dark:text-white
                "
              >
                Portfolio Settings
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Manage portfolio information and general
                website settings.
              </p>

            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

/*
 * ==========================================
 * ADMIN DASHBOARD
 * ==========================================
 */

export default function AdminDashboard() {
  return (
    <AdminAuth>
      <AdminDashboardWrapper />
    </AdminAuth>
  );
}

/*
 * ==========================================
 * GET CURRENT USER
 * ==========================================
 */

function AdminDashboardWrapper() {
  const [user, setUser] = useState<User | null>(
    auth.currentUser
  );

  useEffect(() => {
    const unsubscribe =
      auth.onIdTokenChanged((currentUser) => {
        setUser(currentUser);
      });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <AdminDashboardContent user={user} />
  );
}