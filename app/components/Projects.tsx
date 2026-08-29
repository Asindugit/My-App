"use client";

import { useEffect, useMemo, useState } from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  ArrowLeft,
  ArrowRight,
  Code2,
  ExternalLink,
  FolderKanban,
  Loader2,
  X,
} from "lucide-react";

/* =========================================================
   PROJECT TYPE
========================================================= */

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

/* =========================================================
   PROJECTS
========================================================= */

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * We start at the first real project.
   *
   * The carousel adds cloned projects before and after
   * the real projects so the carousel can loop smoothly.
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [isTransitioning, setIsTransitioning] =
    useState(true);

  /* =======================================================
     LOAD PROJECTS
  ======================================================= */

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const projectsQuery = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(projectsQuery);

        const projectList: Project[] =
          snapshot.docs.map((projectDoc) => {
            const data = projectDoc.data();

            return {
              id: projectDoc.id,

              title: data.title || "",

              description:
                data.description || "",

              technologies:
                Array.isArray(data.technologies)
                  ? data.technologies
                  : [],

              github:
                data.github || "",

              githubUrl:
                data.githubUrl || "",

              liveUrl:
                data.liveUrl || "",

              imageUrl:
                data.imageUrl || "",
            };
          });

        setProjects(projectList);

        /*
         * Start from the first REAL project.
         */
        setCurrentIndex(
          projectList.length >= 3 ? 3 : 1
        );
      } catch (err) {
        console.error(
          "Error loading projects:",
          err
        );

        setError(
          "Unable to load projects. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  /* =======================================================
     NUMBER OF VISIBLE PROJECTS
     
     MOBILE  = 1
     DESKTOP = 3
     
     CSS controls actual visibility.
     We use 3 clones for safe desktop looping.
  ======================================================= */

  const carouselProjects = useMemo(() => {
    if (projects.length === 0) {
      return [];
    }

    /*
     * For 3 or more projects:
     *
     * [last3] [all projects] [first3]
     *
     * Example:
     *
     * A B C | A B C D E | A B C
     */
    if (projects.length >= 3) {
      const firstThree = projects.slice(0, 3);

      const lastThree =
        projects.slice(-3);

      return [
        ...lastThree,
        ...projects,
        ...firstThree,
      ];
    }

    /*
     * For 2 projects:
     *
     * [last2] [A B] [first2]
     */
    if (projects.length === 2) {
      return [
        ...projects,
        ...projects,
        ...projects,
      ];
    }

    /*
     * One project.
     */
    return projects;
  }, [projects]);

  /* =======================================================
     REAL PROJECT INDEX
     
     Used for dots.
  ======================================================= */

  const realProjectIndex = useMemo(() => {
    if (projects.length === 0) {
      return 0;
    }

    if (projects.length === 1) {
      return 0;
    }

    const offset =
      projects.length >= 3 ? 3 : projects.length;

    const index =
      currentIndex - offset;

    return (
      ((index % projects.length) +
        projects.length) %
      projects.length
    );
  }, [currentIndex, projects.length]);

  /* =======================================================
     NEXT PROJECT
  ======================================================= */

  const nextProject = () => {
    if (projects.length <= 1) {
      return;
    }

    setIsTransitioning(true);

    setCurrentIndex((current) => {
      return current + 1;
    });
  };

  /* =======================================================
     PREVIOUS PROJECT
  ======================================================= */

  const previousProject = () => {
    if (projects.length <= 1) {
      return;
    }

    setIsTransitioning(true);

    setCurrentIndex((current) => {
      return current - 1;
    });
  };

  /* =======================================================
     GO TO PROJECT
  ======================================================= */

  const goToProject = (index: number) => {
    if (projects.length <= 1) {
      return;
    }

    setIsTransitioning(true);

    const offset =
      projects.length >= 3
        ? 3
        : projects.length;

    setCurrentIndex(offset + index);
  };

  /* =======================================================
     INFINITE LOOP RESET
     
     After reaching cloned projects,
     instantly move back to the real project.
  ======================================================= */

  const handleTransitionEnd = () => {
    if (projects.length === 0) {
      return;
    }

    /*
     * 3+ projects
     */
    if (projects.length >= 3) {
      /*
       * We have:
       *
       * [last3] [REAL] [first3]
       *
       * If we reach the first clones:
       * reset to first real project.
       */
      if (
        currentIndex >=
        projects.length + 3
      ) {
        setIsTransitioning(false);

        setCurrentIndex(3);

        /*
         * Turn animation back on
         * after browser renders reset.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }

      /*
       * If we move backwards into the
       * cloned projects at the beginning.
       */
      if (currentIndex < 3) {
        setIsTransitioning(false);

        setCurrentIndex(
          projects.length + 2
        );

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }

      return;
    }

    /*
     * 2 projects
     */
    if (projects.length === 2) {
      if (currentIndex >= 4) {
        setIsTransitioning(false);

        setCurrentIndex(2);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }

      if (currentIndex < 2) {
        setIsTransitioning(false);

        setCurrentIndex(3);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }
    }
  };

  /* =======================================================
     AUTOMATIC SLIDE
  ======================================================= */

  useEffect(() => {
    if (projects.length <= 1) {
      return;
    }

    if (selectedProject) {
      return;
    }

    const interval = setInterval(() => {
      nextProject();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    projects.length,
    selectedProject,
  ]);

  /* =======================================================
     ESC + KEYBOARD ARROWS
  ======================================================= */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      /*
       * Close popup
       */
      if (event.key === "Escape") {
        setSelectedProject(null);
        return;
      }

      /*
       * Don't move carousel while popup is open.
       */
      if (selectedProject) {
        return;
      }

      if (event.key === "ArrowRight") {
        nextProject();
      }

      if (event.key === "ArrowLeft") {
        previousProject();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedProject,
    projects.length,
  ]);

  /* =======================================================
     STOP BODY SCROLL WHEN POPUP IS OPEN
  ======================================================= */

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        id="projects"
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          bg-white
          px-5
          py-20
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
              text-gray-500
              dark:text-gray-400
            "
          >
            Loading projects...
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section
        id="projects"
        className="
          bg-white
          px-5
          py-20
          dark:bg-gray-950
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-500
              dark:bg-red-950/40
            "
          >
            <FolderKanban size={30} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Projects unavailable
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {error}
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     NO PROJECTS
  ======================================================= */

  if (projects.length === 0) {
    return (
      <section
        id="projects"
        className="
          bg-white
          px-5
          py-20
          dark:bg-gray-950
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            text-center
          "
        >
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
            Portfolio
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-extrabold
              tracking-tight
              text-gray-950
              dark:text-white
              sm:text-4xl
            "
          >
            My Projects
          </h2>

          <div
            className="
              mx-auto
              mt-10
              max-w-xl
              rounded-2xl
              border
              border-dashed
              border-gray-300
              p-10
              dark:border-gray-700
            "
          >
            <FolderKanban
              size={40}
              className="
                mx-auto
                text-gray-300
                dark:text-gray-600
              "
            />

            <p
              className="
                mt-4
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              No projects available yet.
            </p>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Projects added from the Admin
              Dashboard will appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <>
      <section
        id="projects"
        className="
          overflow-hidden
          bg-white
          px-5
          py-20
          dark:bg-gray-950
          sm:py-24
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              mx-auto
              max-w-2xl
              text-center
            "
          >
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
              Portfolio
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-extrabold
                tracking-tight
                text-gray-950
                dark:text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              My Projects
            </h2>

            <p
              className="
                mt-4
                text-base
                leading-7
                text-gray-600
                dark:text-gray-400
              "
            >
              A selection of projects I have
              designed and developed using
              modern technologies.
            </p>
          </div>

          {/* =================================================
              SLIDER
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              mt-12
              max-w-6xl
            "
          >
            {/* =================================================
                LEFT ARROW
            ================================================= */}

            {projects.length > 1 && (
              <button
                type="button"
                onClick={previousProject}
                aria-label="Previous project"
                className="
                  absolute
                  left-0
                  top-1/2
                  z-30
                  flex
                  h-10
                  w-10
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  shadow-xl
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:border-blue-500
                  hover:text-blue-600
                  active:scale-95
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-200
                  dark:hover:border-blue-400
                  dark:hover:text-blue-400
                  sm:h-12
                  sm:w-12
                "
              >
                <ArrowLeft size={20} />
              </button>
            )}

            {/* =================================================
                VIEWPORT
            ================================================= */}

            <div
              className="
                overflow-hidden
                px-1
                py-3
                sm:px-2
              "
            >
              {/* =================================================
                  TRACK
                  
                  MOBILE:
                  1 CARD
                  
                  DESKTOP:
                  3 CARDS
              ================================================= */}

              <div
                onTransitionEnd={
                  handleTransitionEnd
                }
                className={`
                  flex
                  ${
                    isTransitioning
                      ? "transition-transform duration-700 ease-in-out"
                      : ""
                  }
                `}
                style={{
                  transform: `translateX(-${
                    projects.length >= 3
                      ? currentIndex *
                        (100 / 3)
                      : projects.length === 2
                      ? currentIndex * 50
                      : 0
                  }%)`,
                }}
              >
                {carouselProjects.map(
                  (project, index) => {
                    const githubLink =
                      project.github ||
                      project.githubUrl;

                    return (
                      <div
                        key={`${project.id}-${index}`}
                        className="
                          w-full
                          shrink-0
                          px-1.5
                          sm:px-2
                          md:w-1/3
                        "
                      >
                        {/* =================================================
                            PROJECT CARD
                        ================================================= */}

                        <article
                          onClick={() =>
                            setSelectedProject(
                              project
                            )
                          }
                          className="
                            group
                            flex
                            h-full
                            cursor-pointer
                            flex-col
                            overflow-hidden
                            rounded-3xl
                            border
                            border-gray-200
                            bg-white
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-2
                            hover:shadow-2xl
                            dark:border-gray-800
                            dark:bg-gray-900
                          "
                        >
                          {/* =================================================
                              IMAGE - 1:1
                          ================================================= */}

                          <div
                            className="
                              relative
                              aspect-square
                              w-full
                              overflow-hidden
                              bg-gray-100
                              dark:bg-gray-800
                            "
                          >
                            {project.imageUrl ? (
                              <img
                                src={
                                  project.imageUrl
                                }
                                alt={
                                  project.title
                                }
                                loading="lazy"
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                  transition-transform
                                  duration-700
                                  group-hover:scale-105
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-full
                                  w-full
                                  items-center
                                  justify-center
                                  bg-gradient-to-br
                                  from-blue-50
                                  to-gray-100
                                  dark:from-blue-950/40
                                  dark:to-gray-800
                                "
                              >
                                <FolderKanban
                                  size={55}
                                  className="
                                    text-blue-200
                                    dark:text-blue-800
                                  "
                                />
                              </div>
                            )}

                            {/* IMAGE OVERLAY */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/60
                                via-transparent
                                to-transparent
                                opacity-0
                                transition-opacity
                                duration-300
                                group-hover:opacity-100
                              "
                            />

                            {/* VIEW DETAILS */}

                            <div
                              className="
                                absolute
                                bottom-4
                                right-4
                                rounded-full
                                bg-white/95
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-gray-900
                                opacity-0
                                shadow-lg
                                backdrop-blur
                                transition-all
                                duration-300
                                group-hover:opacity-100
                                dark:bg-gray-900/95
                                dark:text-white
                              "
                            >
                              View Details
                            </div>
                          </div>

                          {/* =================================================
                              CONTENT
                          ================================================= */}

                          <div
                            className="
                              flex
                              min-h-[255px]
                              flex-1
                              flex-col
                              p-5
                              sm:p-6
                            "
                          >
                            {/* TITLE */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <h3
                                className="
                                  line-clamp-2
                                  text-lg
                                  font-bold
                                  text-gray-950
                                  dark:text-white
                                  sm:text-xl
                                "
                              >
                                {project.title}
                              </h3>

                              <ArrowRight
                                size={19}
                                className="
                                  mt-1
                                  shrink-0
                                  text-gray-400
                                  transition-all
                                  duration-300
                                  group-hover:translate-x-1
                                  group-hover:text-blue-600
                                  dark:group-hover:text-blue-400
                                "
                              />
                            </div>

                            {/* DESCRIPTION */}

                            <p
                              className="
                                mt-3
                                line-clamp-3
                                text-sm
                                leading-6
                                text-gray-600
                                dark:text-gray-400
                              "
                            >
                              {
                                project.description
                              }
                            </p>

                            {/* TECHNOLOGIES */}

                            {project
                              .technologies
                              .length > 0 && (
                              <div
                                className="
                                  mt-5
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >
                                {project.technologies
                                  .slice(0, 5)
                                  .map(
                                    (
                                      technology,
                                      techIndex
                                    ) => (
                                      <span
                                        key={`${technology}-${techIndex}`}
                                        className="
                                          rounded-full
                                          bg-blue-50
                                          px-3
                                          py-1.5
                                          text-xs
                                          font-semibold
                                          text-blue-700
                                          dark:bg-blue-950
                                          dark:text-blue-300
                                        "
                                      >
                                        {
                                          technology
                                        }
                                      </span>
                                    )
                                  )}
                              </div>
                            )}

                            {/* LINKS */}

                            {(githubLink ||
                              project.liveUrl) && (
                              <div
                                className="
                                  mt-auto
                                  flex
                                  flex-wrap
                                  gap-3
                                  border-t
                                  border-gray-100
                                  pt-5
                                  dark:border-gray-800
                                "
                              >
                                {/* GITHUB */}

                                {githubLink && (
                                  <a
                                    href={
                                      githubLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(
                                      event
                                    ) =>
                                      event.stopPropagation()
                                    }
                                    className="
                                      inline-flex
                                      items-center
                                      gap-2
                                      rounded-xl
                                      border
                                      border-gray-200
                                      px-4
                                      py-2.5
                                      text-xs
                                      font-bold
                                      text-gray-700
                                      transition
                                      hover:border-blue-500
                                      hover:text-blue-600
                                      dark:border-gray-700
                                      dark:text-gray-300
                                      dark:hover:border-blue-500
                                      dark:hover:text-blue-400
                                    "
                                  >
                                    <Code2
                                      size={16}
                                    />

                                    GitHub
                                  </a>
                                )}

                                {/* LIVE */}

                                {project.liveUrl && (
                                  <a
                                    href={
                                      project.liveUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(
                                      event
                                    ) =>
                                      event.stopPropagation()
                                    }
                                    className="
                                      inline-flex
                                      items-center
                                      gap-2
                                      rounded-xl
                                      bg-blue-600
                                      px-4
                                      py-2.5
                                      text-xs
                                      font-bold
                                      text-white
                                      shadow-md
                                      shadow-blue-600/20
                                      transition
                                      hover:bg-blue-700
                                      hover:shadow-lg
                                    "
                                  >
                                    <ExternalLink
                                      size={16}
                                    />

                                    Live Demo
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </article>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                RIGHT ARROW
            ================================================= */}

            {projects.length > 1 && (
              <button
                type="button"
                onClick={nextProject}
                aria-label="Next project"
                className="
                  absolute
                  right-0
                  top-1/2
                  z-30
                  flex
                  h-10
                  w-10
                  translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  shadow-xl
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:border-blue-500
                  hover:text-blue-600
                  active:scale-95
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-200
                  dark:hover:border-blue-400
                  dark:hover:text-blue-400
                  sm:h-12
                  sm:w-12
                "
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>

          {/* =================================================
              DOTS
          ================================================= */}

          {projects.length > 1 && (
            <div
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {projects.map(
                (project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    aria-label={`Go to project ${
                      index + 1
                    }`}
                    onClick={() =>
                      goToProject(index)
                    }
                    className={`
                      h-2.5
                      rounded-full
                      transition-all
                      duration-500
                      ${
                        index ===
                        realProjectIndex
                          ? "w-8 bg-blue-600"
                          : "w-2.5 bg-gray-300 hover:bg-blue-400 dark:bg-gray-700"
                      }
                    `}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          PROJECT DETAILS POPUP
      ===================================================== */}

      {selectedProject && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setSelectedProject(null)
          }
        >
          {/* =================================================
              POPUP
          ================================================= */}

          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-3xl
              overflow-y-auto
              rounded-3xl
              border
              border-gray-200
              bg-white
              shadow-2xl
              dark:border-gray-700
              dark:bg-gray-900
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setSelectedProject(null)
              }
              aria-label="Close project details"
              className="
                absolute
                right-4
                top-4
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black/60
                text-white
                backdrop-blur
                transition
                hover:scale-110
                hover:bg-black/80
              "
            >
              <X size={21} />
            </button>

            {/* =================================================
                POPUP IMAGE
            ================================================= */}

            <div
              className="
                relative
                aspect-square
                w-full
                overflow-hidden
                bg-gray-100
                dark:bg-gray-800
                sm:aspect-[16/9]
              "
            >
              {selectedProject.imageUrl ? (
                <img
                  src={
                    selectedProject.imageUrl
                  }
                  alt={
                    selectedProject.title
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                    text-gray-400
                  "
                >
                  <FolderKanban
                    size={60}
                  />
                </div>
              )}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/10
                  to-transparent
                "
              />
            </div>

            {/* =================================================
                POPUP CONTENT
            ================================================= */}

            <div className="p-6 sm:p-8">
              {/* TITLE */}

              <h3
                className="
                  text-2xl
                  font-extrabold
                  text-gray-950
                  dark:text-white
                  sm:text-3xl
                "
              >
                {selectedProject.title}
              </h3>

              {/* DESCRIPTION */}

              <div className="mt-6">
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  About this project
                </p>

                <p
                  className="
                    mt-3
                    whitespace-pre-line
                    text-base
                    leading-8
                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  {
                    selectedProject.description
                  }
                </p>
              </div>

              {/* TECHNOLOGIES */}

              {selectedProject
                .technologies.length >
                0 && (
                <div className="mt-7">
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    Technologies Used
                  </p>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {selectedProject
                      .technologies
                      .map(
                        (
                          technology,
                          index
                        ) => (
                          <span
                            key={`${technology}-${index}`}
                            className="
                              rounded-full
                              bg-blue-50
                              px-4
                              py-2
                              text-sm
                              font-semibold
                              text-blue-700
                              dark:bg-blue-950
                              dark:text-blue-300
                            "
                          >
                            {technology}
                          </span>
                        )
                      )}
                  </div>
                </div>
              )}

              {/* =================================================
                  LINKS
              ================================================= */}

              {(
                selectedProject.github ||
                selectedProject.githubUrl ||
                selectedProject.liveUrl
              ) && (
                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                  "
                >
                  {/* GITHUB */}

                  {(selectedProject.github ||
                    selectedProject.githubUrl) && (
                    <a
                      href={
                        selectedProject.github ||
                        selectedProject.githubUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border-2
                        border-gray-200
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-gray-800
                        transition-all
                        hover:-translate-y-1
                        hover:border-blue-500
                        hover:text-blue-600
                        hover:shadow-lg
                        dark:border-gray-700
                        dark:bg-gray-800
                        dark:text-gray-200
                        dark:hover:border-blue-400
                        dark:hover:text-blue-400
                      "
                    >
                      <Code2 size={18} />

                      View on GitHub
                    </a>
                  )}

                  {/* LIVE DEMO */}

                  {selectedProject.liveUrl && (
                    <a
                      href={
                        selectedProject.liveUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        shadow-blue-600/20
                        transition-all
                        hover:-translate-y-1
                        hover:bg-blue-700
                        hover:shadow-xl
                      "
                    >
                      <ExternalLink
                        size={18}
                      />

                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}