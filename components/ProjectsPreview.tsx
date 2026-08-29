"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectsRef = collection(db, "projects");

        const projectsQuery = query(
          projectsRef,
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(projectsQuery);

        const projectList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        setProjects(projectList);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  return (
    <section
      id="projects"
      className="
        px-5 py-24
        bg-white
        dark:bg-blue-950/30
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* =========================
            SECTION HEADER
        ========================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center">

          <p
            className="
              text-sm font-semibold
              uppercase tracking-widest
              text-blue-600
              dark:text-blue-400
            "
          >
            My Work
          </p>

          <h2
            className="
              mt-3 text-4xl font-bold
              text-gray-950
              dark:text-white
              sm:text-5xl
            "
          >
            Recent Projects
          </h2>

          <p
            className="
              mx-auto mt-4 max-w-2xl
              text-gray-600
              dark:text-gray-300
            "
          >
            Some of the projects I have recently worked on.
          </p>

        </div>

        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2
              size={32}
              className="animate-spin text-blue-600"
            />
          </div>
        )}

        {/* =========================
            NO PROJECTS
        ========================== */}

        {!loading && projects.length === 0 && (
          <div
            className="
              rounded-2xl
              border border-gray-200
              bg-gray-50
              px-6 py-12
              text-center
              dark:border-gray-800
              dark:bg-gray-900/50
            "
          >
            <p
              className="
                text-gray-600
                dark:text-gray-400
              "
            >
              No projects available yet.
            </p>
          </div>
        )}

        {/* =========================
            PROJECTS
        ========================== */}

        {!loading && projects.length > 0 && (
          <div
            className="
              grid gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {projects.map((project) => (
              <article
                key={project.id}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border border-gray-200
                  bg-white
                  shadow-sm
                  transition duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  dark:border-gray-800
                  dark:bg-gray-900
                "
              >

                {/* =========================
                    PROJECT IMAGE
                ========================== */}

                <div
                  className="
                    relative
                    flex h-44
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gray-100
                    dark:bg-gray-800
                  "
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="
                        h-full w-full
                        object-cover
                        transition duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <span
                      className="
                        text-sm
                        font-medium
                        text-gray-400
                      "
                    >
                      Project Image
                    </span>
                  )}

                  {/* Featured Badge */}

                  {project.featured && (
                    <span
                      className="
                        absolute left-4 top-4
                        rounded-full
                        bg-blue-600
                        px-3 py-1
                        text-xs font-semibold
                        text-white
                        shadow-lg
                      "
                    >
                      Featured
                    </span>
                  )}
                </div>

                {/* =========================
                    PROJECT CONTENT
                ========================== */}

                <div className="p-6">

                  <div
                    className="
                      flex items-start
                      justify-between
                      gap-4
                    "
                  >
                    <h3
                      className="
                        text-xl font-bold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {project.title}
                    </h3>

                    <ArrowUpRight
                      className="
                        shrink-0
                        text-gray-400
                        transition
                        group-hover:text-blue-600
                        dark:group-hover:text-blue-400
                      "
                      size={20}
                    />
                  </div>

                  {/* Description */}

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-gray-600
                      dark:text-gray-400
                    "
                  >
                    {project.description}
                  </p>

                  {/* Technologies */}

                  {project.technologies &&
                    project.technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map(
                          (technology) => (
                            <span
                              key={technology}
                              className="
                                rounded-full
                                bg-blue-50
                                px-3 py-1
                                text-xs
                                font-medium
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
                    )}

                  {/* Links */}

                  {(project.githubUrl ||
                    project.liveUrl) && (
                    <div className="mt-6 flex gap-3">

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            rounded-lg
                            border
                            border-gray-200
                            px-3 py-2
                            text-xs
                            font-semibold
                            text-gray-700
                            transition
                            hover:border-blue-500
                            hover:text-blue-600
                            dark:border-gray-700
                            dark:text-gray-300
                            dark:hover:border-blue-400
                            dark:hover:text-blue-400
                          "
                        >
                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            rounded-lg
                            bg-blue-600
                            px-3 py-2
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                          "
                        >
                          Live Demo
                        </a>
                      )}

                    </div>
                  )}

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}