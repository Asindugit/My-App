"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  FolderKanban,
  Code2,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export default function ManageProjects() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  /*
   * =================================
   * LOAD PROJECTS
   * =================================
   */

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(
        collection(db, "projects")
      );

      const projectList: Project[] = snapshot.docs.map(
        (projectDoc) => ({
          id: projectDoc.id,
          ...(projectDoc.data() as Omit<Project, "id">),
        })
      );

      setProjects(projectList);
    } catch (error) {
      console.error("Error loading projects:", error);

      setError(
        "Unable to load projects. Please check your Firestore permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =================================
   * DELETE PROJECT
   * =================================
   */

  async function handleDelete(
    id: string,
    title: string
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const projectRef = doc(
        db,
        "projects",
        id
      );

      await deleteDoc(projectRef);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      setError(
        "Unable to delete the project. Please check your Firestore permissions."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * =================================
   * LOADING SCREEN
   * =================================
   */

  if (loading) {
    return (
      <main
        className="
          flex min-h-screen
          items-center justify-center
          bg-gray-50
          dark:bg-gray-950
        "
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={36}
            className="animate-spin text-blue-600"
          />

          <p
            className="
              text-sm
              font-medium
              text-gray-600
              dark:text-gray-400
            "
          >
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  /*
   * =================================
   * PAGE
   * =================================
   */

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
      {/* =================================
          HEADER
      ================================== */}

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
          {/* LEFT */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/admin/dashboard")
              }
              aria-label="Back to dashboard"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                text-gray-600
                transition
                hover:border-blue-500
                hover:text-blue-600
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:border-blue-400
                dark:hover:text-blue-400
              "
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1
                className="
                  text-sm
                  font-bold
                  text-gray-950
                  dark:text-white
                "
              >
                Manage Projects
              </h1>

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

          {/* ADD PROJECT */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/dashboard/projects/new"
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-blue-600/20
              transition
              hover:bg-blue-700
              hover:shadow-xl
            "
          >
            <Plus size={18} />

            <span className="hidden sm:inline">
              Add Project
            </span>
          </button>
        </div>
      </header>

      {/* =================================
          MAIN CONTENT
      ================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
        "
      >
        {/* PAGE TITLE */}

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
            Portfolio
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-extrabold
              tracking-tight
              sm:text-4xl
            "
          >
            Your Projects
          </h2>

          <p
            className="
              mt-2
              text-gray-600
              dark:text-gray-400
            "
          >
            Manage projects displayed on your
            portfolio website.
          </p>
        </div>

        {/* =================================
            ERROR MESSAGE
        ================================== */}

        {error && (
          <div
            className="
              mb-6
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
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* =================================
            PROJECT COUNT
        ================================== */}

        {projects.length > 0 && (
          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-gray-200
              bg-white
              px-5
              py-4
              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  dark:bg-blue-950/50
                  dark:text-blue-400
                "
              >
                <FolderKanban size={20} />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Total Projects
                </p>

                <p
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Projects stored in Firestore
                </p>
              </div>
            </div>

            <span
              className="
                rounded-full
                bg-blue-100
                px-3
                py-1
                text-sm
                font-bold
                text-blue-700
                dark:bg-blue-950
                dark:text-blue-300
              "
            >
              {projects.length}
            </span>
          </div>
        )}

        {/* =================================
            EMPTY STATE
        ================================== */}

        {projects.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-gray-300
              bg-white
              p-12
              text-center
              dark:border-gray-700
              dark:bg-gray-900
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
                bg-blue-50
                text-blue-600
                dark:bg-blue-950/50
                dark:text-blue-400
              "
            >
              <FolderKanban size={30} />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-bold
              "
            >
              No projects yet
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              You haven't added any projects yet.
              Add your first project to display it
              on your portfolio.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/projects/new"
                )
              }
              className="
                mt-6
                inline-flex
                items-center
                gap-2
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
              <Plus size={18} />

              Add Your First Project
            </button>
          </div>
        ) : (
          /* =================================
              PROJECT GRID
          ================================== */

          <div
            className="
              grid
              gap-6
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
                  border
                  border-gray-200
                  bg-white
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  dark:border-gray-800
                  dark:bg-gray-900
                "
              >
                {/* =================================
                    PROJECT IMAGE
                ================================== */}

                <div
                  className="
                    relative
                    flex
                    h-48
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gray-100
                    dark:bg-gray-800
                  "
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <FolderKanban
                      size={45}
                      className="
                        text-gray-300
                        dark:text-gray-600
                      "
                    />
                  )}
                </div>

                {/* =================================
                    PROJECT DETAILS
                ================================== */}

                <div className="p-6">
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-gray-950
                      dark:text-white
                    "
                  >
                    {project.title}
                  </h3>

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
                    {project.description}
                  </p>

                  {/* =================================
                      TECHNOLOGIES
                  ================================== */}

                  {project.technologies &&
                    project.technologies.length > 0 && (
                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {project.technologies.map(
                          (technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1
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

                  {/* =================================
                      LINKS
                  ================================== */}

                  {(project.githubUrl ||
                    project.liveUrl) && (
                      <div
                        className="
                        mt-5
                        flex
                        flex-wrap
                        gap-4
                      "
                      >
                        {/* GITHUB */}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-semibold
                            text-gray-600
                            transition
                            hover:text-blue-600
                            dark:text-gray-400
                            dark:hover:text-blue-400
                          "
                          >
                            <Code2 size={15} />

                            GitHub
                          </a>
                        )}

                        {/* LIVE DEMO */}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-semibold
                            text-gray-600
                            transition
                            hover:text-blue-600
                            dark:text-gray-400
                            dark:hover:text-blue-400
                          "
                          >
                            <ExternalLink size={15} />

                            Live Demo
                          </a>
                        )}
                      </div>
                    )}

                  {/* =================================
                      ACTIONS
                  ================================== */}

                  <div
                    className="
                      mt-6
                      flex
                      gap-3
                      border-t
                      border-gray-100
                      pt-5
                      dark:border-gray-800
                    "
                  >
                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/dashboard/projects/edit?id=${project.id}`
                        )
                      }
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-gray-700
                        transition
                        hover:border-blue-400
                        hover:text-blue-600
                        dark:border-gray-700
                        dark:text-gray-300
                        dark:hover:border-blue-500
                        dark:hover:text-blue-400
                      "
                    >
                      <Pencil size={16} />

                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          project.id,
                          project.title
                        )
                      }
                      disabled={
                        deletingId === project.id
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-200
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:border-red-900
                        dark:text-red-400
                        dark:hover:bg-red-950/30
                      "
                    >
                      {deletingId === project.id ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />

                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />

                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}