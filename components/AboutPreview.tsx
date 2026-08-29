"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface AboutData {
  aboutLabel: string;
  aboutTitle: string;
  aboutDescription: string;
}

export default function AboutPreview() {
  const [about, setAbout] = useState<AboutData>({
    aboutLabel: "About Me",
    aboutTitle: "Building useful digital experiences",
    aboutDescription:
      "I am a software developer interested in building reliable, modern and user-friendly applications. I enjoy turning ideas into practical software solutions.",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const settingsRef = doc(
          db,
          "portfolioSettings",
          "main"
        );

        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setAbout({
            aboutLabel:
              data.aboutLabel || "About Me",

            aboutTitle:
              data.aboutTitle ||
              "Building useful digital experiences",

            aboutDescription:
              data.aboutDescription ||
              "I am a software developer interested in building reliable, modern and user-friendly applications. I enjoy turning ideas into practical software solutions.",
          });
        }
      } catch (error) {
        console.error(
          "Error loading About section:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAbout();
  }, []);

  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-gray-50
        px-5
        py-24
        dark:bg-gray-950
        sm:py-28
      "
    >

      {/* =================================
          BACKGROUND DECORATION
      ================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-10
          h-80
          w-80
          rounded-full
          bg-blue-100/50
          blur-3xl
          dark:bg-blue-950/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          -bottom-40
          h-80
          w-80
          rounded-full
          bg-blue-50
          blur-3xl
          dark:bg-blue-950/20
        "
      />

      {/* =================================
          CONTENT
      ================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-4xl
          text-center
        "
      >

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2
              size={32}
              className="
                animate-spin
                text-blue-600
                dark:text-blue-400
              "
            />
          </div>
        ) : (
          <>

            {/* SECTION LABEL */}

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.25em]
                text-blue-600
                dark:text-blue-400
              "
            >
              {about.aboutLabel}
            </p>

            {/* TITLE */}

            <h2
              className="
                mt-4
                text-4xl
                font-extrabold
                tracking-tight
                text-gray-950
                dark:text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              {about.aboutTitle}
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-7
                max-w-3xl
                whitespace-pre-line
                text-base
                leading-8
                text-gray-600
                dark:text-gray-400
                sm:text-lg
              "
            >
              {about.aboutDescription}
            </p>

            {/* DIVIDER */}

            <div
              className="
                mx-auto
                mt-9
                h-1
                w-14
                rounded-full
                bg-blue-600
                dark:bg-blue-400
              "
            />

          </>
        )}

      </div>

    </section>
  );
}