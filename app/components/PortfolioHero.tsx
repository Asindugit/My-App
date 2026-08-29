"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Mail, Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* =========================================================
   TYPES
========================================================= */

interface PortfolioSettings {
  name: string;
  profession: string;
  description: string;
  profileImage: string;
  email: string;
  github: string;
  linkedin: string;
  availableForWork: boolean;
}

/* =========================================================
   GITHUB ICON
========================================================= */

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.486 2 12.02c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.238-.009-.868-.013-1.703-2.782.606-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.908-.622.069-.61.069-.61 1.004.071 1.532 1.033 1.532 1.033.892 1.531 2.341 1.089 2.91.833.091-.647.349-1.089.635-1.34-2.22-.254-4.555-1.114-4.555-4.957 0-1.095.39-1.991 1.029-2.693.103-.253-.446-1.274.098-2.654 0 0 .84-.27 2.75 1.027A9.53 9.53 0 0112 6.844a9.53 9.53 0 012.504.34c1.909-1.297 2.748-1.027 2.748-1.027.545 1.38.202 2.401.1 2.654.64.702.1 1.598.1 2.693 0 3.853-2.339 4.7-4.566 4.95.359.31.678.92.678 1.854 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.024 10.024 0 0022 12.02C22 6.486 17.523 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* =========================================================
   LINKEDIN ICON
========================================================= */

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.27 2.373 4.27 5.466v6.276zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.56V8.999h3.554v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/* =========================================================
   PORTFOLIO HERO
========================================================= */

export default function PortfolioHero() {
  const [settings, setSettings] =
    useState<PortfolioSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD FIRESTORE DATA
  ======================================================= */

  useEffect(() => {
    async function loadPortfolioSettings() {
      try {
        setLoading(true);
        setError("");

        const settingsRef = doc(
          db,
          "portfolioSettings",
          "main"
        );

        const snapshot = await getDoc(settingsRef);

        if (!snapshot.exists()) {
          setError("Portfolio information not found.");
          return;
        }

        const data = snapshot.data();

        setSettings({
          name: data.name || "",
          profession: data.profession || "",
          description: data.description || "",
          profileImage: data.profileImage || "",
          email: data.email || "",
          github: data.github || "",
          linkedin: data.linkedin || "",

          /*
           * IMPORTANT:
           * If the Firestore value is false,
           * this will remain false.
           *
           * true  = Available for work
           * false = I am Busy
           */
          availableForWork:
            data.availableForWork !== false,
        });
      } catch (err) {
        console.error(
          "Error loading portfolio settings:",
          err
        );

        setError(
          "Unable to load portfolio information."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioSettings();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        id="home"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-white
          dark:bg-gray-950
        "
      >
        <div className="flex flex-col items-center gap-4">

          <Loader2
            size={40}
            className="
              animate-spin
              text-blue-600
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-gray-500
              dark:text-gray-400
            "
          >
            Loading portfolio...
          </p>

        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !settings) {
    return (
      <section
        id="home"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-white
          px-5
          dark:bg-gray-950
        "
      >
        <div className="text-center">

          <p
            className="
              text-lg
              font-semibold
              text-red-500
            "
          >
            {error || "Unable to load portfolio."}
          </p>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Please try again later.
          </p>

        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN HERO
  ======================================================= */

  return (
    <section
      id="home"
      className="
        relative
        flex
        min-h-screen
        items-center
        overflow-hidden
        bg-white
        px-5
        pt-20
        dark:bg-gray-950
      "
    >

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

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
          bg-blue-50
          blur-3xl
          dark:bg-blue-950/30
        "
      />

      {/* SMALL DECORATIVE CIRCLE */}

      <div
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[25%]
          h-3
          w-3
          animate-pulse
          rounded-full
          bg-blue-500/40
        "
      />

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-6xl
          items-center
          gap-16
          py-16
          md:grid-cols-2
          md:gap-20
        "
      >

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="max-w-3xl">

          {/* INTRODUCTION */}

          <p
            className="
              hero-fade-up
              hero-delay-1
              mb-5
              text-sm
              font-bold
              uppercase
              tracking-[0.25em]
              text-blue-700
              dark:text-blue-400
            "
          >
            Hello, I'm
          </p>

          {/* NAME */}

          <h1
            className="
              hero-fade-up
              hero-delay-2
              text-5xl
              font-extrabold
              tracking-tight
              text-gray-950
              dark:text-white
              sm:text-6xl
              md:text-7xl
            "
          >
            {settings.name}
          </h1>

          {/* PROFESSION */}

          <h2
            className="
              hero-fade-up
              hero-delay-3
              mt-5
              text-2xl
              font-bold
              leading-tight
              text-gray-800
              dark:text-gray-200
              sm:text-3xl
            "
          >
            {settings.profession}
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              hero-fade-up
              hero-delay-4
              mt-6
              max-w-2xl
              text-lg
              leading-8
              text-gray-700
              dark:text-gray-300
            "
          >
            {settings.description}
          </p>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            className="
              hero-fade-up
              hero-delay-5
              mt-8
              flex
              flex-wrap
              gap-4
            "
          >

            {/* VIEW PROJECTS */}

            <a
              href="#projects"
              className="
                group
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-bold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:scale-[1.02]
                hover:bg-blue-700
                hover:shadow-xl
                active:translate-y-0
                active:scale-95
              "
            >
              View My Projects

              <ArrowDown
                size={17}
                className="
                  ml-2
                  rotate-[-90deg]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </a>

            {/* CONTACT */}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-gray-300
                  bg-white
                  px-6
                  py-3
                  font-bold
                  text-gray-900
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.02]
                  hover:border-blue-600
                  hover:text-blue-700
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-95
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                  dark:hover:border-blue-400
                  dark:hover:text-blue-400
                "
              >
                Contact Me
              </a>
            )}

          </div>

          {/* =================================================
              SOCIAL LINKS
          ================================================= */}

          <div
            className="
              hero-fade-up
              hero-delay-5
              mt-8
              flex
              items-center
              gap-4
            "
          >

            {/* GITHUB */}

            {settings.github && (
              <a
                href={settings.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-gray-200
                  bg-white
                  text-gray-800
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-600
                  hover:text-blue-700
                  hover:shadow-md
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-200
                  dark:hover:border-blue-400
                  dark:hover:text-blue-400
                "
              >
                <GithubIcon />
              </a>
            )}

            {/* LINKEDIN */}

            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-gray-200
                  bg-white
                  text-gray-800
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-600
                  hover:text-blue-700
                  hover:shadow-md
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-200
                  dark:hover:border-blue-400
                  dark:hover:text-blue-400
                "
              >
                <LinkedinIcon />
              </a>
            )}

            {/* EMAIL */}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                aria-label="Email"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-gray-200
                  bg-white
                  text-gray-800
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-600
                  hover:text-blue-700
                  hover:shadow-md
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-200
                  dark:hover:border-blue-400
                  dark:hover:text-blue-400
                "
              >
                <Mail size={20} />
              </a>
            )}

          </div>

          {/* =================================================
              SCROLL
          ================================================= */}

          <a
            href="#projects"
            className="
              hero-fade-up
              hero-delay-5
              mt-10
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-gray-600
              transition-colors
              hover:text-blue-700
              dark:text-gray-400
              dark:hover:text-blue-400
            "
          >
            Scroll to explore

            <ArrowDown
              size={16}
              className="animate-bounce"
            />
          </a>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            justify-center
            md:justify-end
          "
        >

          <div className="relative">

            {/* =================================================
                MAIN GLOW
            ================================================= */}

            <div
              className="
                absolute
                -inset-8
                rounded-full
                bg-blue-200/50
                blur-3xl
                dark:bg-blue-900/30
              "
            />

            {/* =================================================
                TOP RIGHT RING
            ================================================= */}

            <div
              className="
                absolute
                -right-6
                -top-6
                z-0
                h-24
                w-24
                rounded-full
                border-2
                border-blue-300/60
                dark:border-blue-700/60
              "
            />

            {/* =================================================
                BOTTOM LEFT RING
            ================================================= */}

            <div
              className="
                absolute
                -bottom-8
                -left-8
                z-0
                h-20
                w-20
                rounded-full
                border
                border-blue-200
                dark:border-blue-800
              "
            />

            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div
              className="
                relative
                z-10
                h-[360px]
                w-[290px]
                overflow-hidden
                rounded-[2.5rem]
                border
                border-white
                bg-gray-100
                shadow-2xl
                shadow-blue-900/10
                dark:border-gray-700
                dark:bg-gray-900
                sm:h-[440px]
                sm:w-[350px]
                md:h-[480px]
                md:w-[390px]
                lg:h-[520px]
                lg:w-[420px]
              "
            >

              {/* PROFILE IMAGE */}

              {settings.profileImage ? (
                <img
                  src={settings.profileImage}
                  alt={settings.name}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    hover:scale-105
                  "
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-gray-100
                    text-gray-400
                    dark:bg-gray-900
                  "
                >
                  No Profile Image
                </div>
              )}

              {/* IMAGE GRADIENT */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-52
                  bg-gradient-to-t
                  from-black/80
                  via-black/30
                  to-transparent
                "
              />

              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}

              <div
                className="
                  absolute
                  bottom-3
                  left-0
                  right-0
                  p-6
                  text-white
                "
              >

                <h3
                  className="
                    mt-1
                    text-2xl
                    font-bold
                  "
                >
                  {settings.name}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-200
                  "
                >
                  {settings.profession}
                </p>

              </div>

            </div>

            {/* =================================================
                WORK STATUS
            ================================================= */}

            <div
              className={`
                absolute
                -bottom-6
                -left-5
                z-20
                flex
                items-center
                gap-3
                rounded-2xl
                border
                px-5
                py-2
                shadow-xl
                shadow-gray-900/10
                sm:-left-8

                ${
                  settings.availableForWork
                    ? `
                      border-green-200
                      bg-white
                      dark:border-green-900
                      dark:bg-gray-900
                    `
                    : `
                      border-red-200
                      bg-white
                      dark:border-red-900
                      dark:bg-gray-900
                    `
                }
              `}
            >

              {/* STATUS DOT */}

              <span className="relative flex h-3 w-3">

                {/* GREEN ANIMATION ONLY WHEN AVAILABLE */}

                {settings.availableForWork && (
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-green-400
                      opacity-75
                    "
                  />
                )}

                {/* MAIN DOT */}

                <span
                  className={`
                    relative
                    inline-flex
                    h-3
                    w-3
                    rounded-full

                    ${
                      settings.availableForWork
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  `}
                />

              </span>

              {/* STATUS TEXT */}

              <div>

                <p
                  className="
                    text-[11px]
                    font-medium
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Currently
                </p>

                <p
                  className={`
                    text-sm
                    font-bold

                    ${
                      settings.availableForWork
                        ? `
                          text-green-700
                          dark:text-green-400
                        `
                        : `
                          text-red-600
                          dark:text-red-400
                        `
                    }
                  `}
                >
                  {settings.availableForWork
                    ? "Available for work"
                    : "I am Busy"}
                </p>

              </div>

            </div>

            {/* =================================================
                TECHNOLOGY CARD
            ================================================= */}

            <div
              className="
                absolute
                -right-4
                top-10
                z-20
                hidden
                rounded-2xl
                border
                border-gray-200
                bg-white/95
                px-4
                py-2
                shadow-xl
                backdrop-blur
                dark:border-gray-700
                dark:bg-gray-900/95
                sm:block
              "
            >

              <p
                className="
                  text-[11px]
                  font-medium
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Specializing in
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                Modern Web Apps
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}