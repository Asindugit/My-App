"use client";

import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Loader2, Code2 } from "lucide-react";

interface Skill {
  name: string;
  logo: string;
}

interface SkillsData {
  skillsLabel: string;
  skillsTitle: string;
  skillsDescription: string;
  skills: Skill[];
}

const defaultSkills: Skill[] = [
  {
    name: "Java",
    logo: "/tech/java.svg",
  },
  {
    name: "Spring Boot",
    logo: "/tech/springboot.svg",
  },
  {
    name: "Next.js",
    logo: "/tech/nextjs.svg",
  },
  {
    name: "React",
    logo: "/tech/react.svg",
  },
  {
    name: "TypeScript",
    logo: "/tech/typescript.svg",
  },
  {
    name: "JavaScript",
    logo: "/tech/javascript.svg",
  },
  {
    name: "PHP",
    logo: "/tech/php.svg",
  },
  {
    name: "Firebase",
    logo: "/tech/firebase.svg",
  },
  {
    name: "MySQL",
    logo: "/tech/mysql.svg",
  },
  {
    name: "Git",
    logo: "/tech/git.svg",
  },
  {
    name: "GitHub",
    logo: "/tech/github.svg",
  },
  {
    name: "Docker",
    logo: "/tech/docker.svg",
  },
];

export default function Skills() {
  const [data, setData] = useState<SkillsData>({
    skillsLabel: "Technologies",
    skillsTitle: "Tools I Work With",
    skillsDescription:
      "Technologies and tools I use to build modern and reliable applications.",
    skills: defaultSkills,
  });

  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD SKILLS
  ======================================================= */

  useEffect(() => {
    async function loadSkills() {
      try {
        const settingsRef = doc(
          db,
          "portfolioSettings",
          "main"
        );

        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
          const firestoreData = snapshot.data();

          const firestoreSkills =
            Array.isArray(firestoreData.skills)
              ? firestoreData.skills
              : defaultSkills;

          setData({
            skillsLabel:
              firestoreData.skillsLabel ||
              "Technologies",

            skillsTitle:
              firestoreData.skillsTitle ||
              "Tools I Work With",

            skillsDescription:
              firestoreData.skillsDescription ||
              "Technologies and tools I use to build modern and reliable applications.",

            skills:
              firestoreSkills,
          });
        }
      } catch (error) {
        console.error(
          "Error loading skills:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  /* =======================================================
     DUPLICATE FOR INFINITE SLIDER
  ======================================================= */

  const animatedSkills = [
    ...data.skills,
    ...data.skills,
  ];

  return (
    <section
      id="skills"
      className="
        overflow-hidden
        border-y
        border-gray-200
        bg-gray-50
        px-5
        py-24
        dark:border-gray-800
        dark:bg-gray-950
      "
    >

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center">

          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.25em]
              text-blue-700
              dark:text-blue-400
            "
          >
            {data.skillsLabel}
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-extrabold
              text-gray-950
              dark:text-white
              sm:text-5xl
            "
          >
            {data.skillsTitle}
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-base
              leading-7
              text-gray-700
              dark:text-gray-300
            "
          >
            {data.skillsDescription}
          </p>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div
            className="
              flex
              items-center
              justify-center
              py-20
            "
          >
            <Loader2
              size={34}
              className="
                animate-spin
                text-blue-600
                dark:text-blue-400
              "
            />
          </div>
        ) : data.skills.length === 0 ? (

          /* =================================================
              EMPTY
          ================================================= */

          <div
            className="
              mx-auto
              mt-14
              max-w-xl
              rounded-2xl
              border
              border-dashed
              border-gray-300
              p-10
              text-center
              dark:border-gray-700
            "
          >

            <Code2
              size={42}
              className="
                mx-auto
                text-gray-300
                dark:text-gray-700
              "
            />

            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-gray-600
                dark:text-gray-400
              "
            >
              No skills added yet.
            </p>

          </div>

        ) : (

          /* =================================================
              SLIDER
          ================================================= */

          <div
            className="
              relative
              mt-14
              overflow-hidden
            "
          >

            {/* LEFT FADE */}

            <div
              className="
                pointer-events-none
                absolute
                left-0
                top-0
                z-10
                h-full
                w-24
                bg-gradient-to-r
                from-gray-50
                to-transparent
                dark:from-gray-950
              "
            />

            {/* RIGHT FADE */}

            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                z-10
                h-full
                w-24
                bg-gradient-to-l
                from-gray-50
                to-transparent
                dark:from-gray-950
              "
            />

            {/* MOVING SKILLS */}

            <div
              className="
                flex
                w-max
                animate-technologies
                hover:[animation-play-state:paused]
              "
            >

              {animatedSkills.map(
                (skill, index) => (

                  <div
                    key={`${skill.name}-${index}`}
                    className="
                      group
                      mx-3
                      flex
                      h-32
                      w-40
                      shrink-0
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:border-blue-500
                      hover:shadow-xl
                      dark:border-gray-800
                      dark:bg-gray-900
                      dark:hover:border-blue-400
                    "
                  >

                    {/* LOGO */}

                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                      "
                    >

                      {skill.logo ? (
                        <img
                          src={skill.logo}
                          alt={`${skill.name} logo`}
                          loading="lazy"
                          className="
                            h-12
                            w-12
                            object-contain
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <Code2
                          size={38}
                          className="
                            text-gray-300
                            dark:text-gray-700
                          "
                        />
                      )}

                    </div>

                    {/* NAME */}

                    <span
                      className="
                        mt-4
                        text-sm
                        font-semibold
                        text-gray-800
                        dark:text-gray-200
                      "
                    >
                      {skill.name}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </section>
  );
}