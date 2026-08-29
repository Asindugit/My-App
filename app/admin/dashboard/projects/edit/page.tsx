"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  X,
} from "lucide-react";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { auth, db } from "@/lib/firebase";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * Get project ID from:
   *
   * /admin/dashboard/projects/edit?id=PROJECT_ID
   */
  const projectId = searchParams.get("id");

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  /*
   * =====================================
   * CHECK AUTHENTICATION
   * =====================================
   */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          router.replace("/admin/login");
          return;
        }

        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, [router]);

  /*
   * =====================================
   * CHECK PROJECT ID
   * =====================================
   */

  useEffect(() => {
    if (!projectId) {
      setError("Project ID is missing.");
      setLoading(false);
    }
  }, [projectId]);

  /*
   * =====================================
   * LOAD PROJECT
   * =====================================
   */

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const projectRef = doc(
          db,
          "projects",
          projectId
        );

        const projectSnapshot = await getDoc(
          projectRef
        );

        if (!projectSnapshot.exists()) {
          setError("Project not found.");
          setLoading(false);
          return;
        }

        const data =
          projectSnapshot.data() as Project;

        setTitle(data.title || "");

        setDescription(
          data.description || ""
        );

        setTechnologies(
          Array.isArray(data.technologies)
            ? data.technologies.join(", ")
            : ""
        );

        setGithubUrl(
          data.githubUrl || ""
        );

        setLiveUrl(
          data.liveUrl || ""
        );

        setImageUrl(
          data.imageUrl || ""
        );

      } catch (err) {
        console.error(
          "Error loading project:",
          err
        );

        setError(
          "Unable to load the project. Please check your Firestore permissions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  /*
   * =====================================
   * UPDATE PROJECT
   * =====================================
   */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Validation
     */

    if (!title.trim()) {
      setError(
        "Project title is required."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Project description is required."
      );
      return;
    }

    if (!technologies.trim()) {
      setError(
        "Please enter at least one technology."
      );
      return;
    }

    if (!projectId) {
      setError(
        "Project ID is missing."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Convert:
       *
       * Next.js, Firebase, TypeScript
       *
       * into:
       *
       * ["Next.js", "Firebase", "TypeScript"]
       */

      const technologyArray =
        technologies
          .split(",")
          .map(
            (technology) =>
              technology.trim()
          )
          .filter(
            (technology) =>
              technology.length > 0
          );

      const projectRef = doc(
        db,
        "projects",
        projectId
      );

      await updateDoc(projectRef, {
        title: title.trim(),

        description:
          description.trim(),

        technologies:
          technologyArray,

        githubUrl:
          githubUrl.trim(),

        liveUrl:
          liveUrl.trim(),

        imageUrl:
          imageUrl.trim(),

        updatedAt:
          serverTimestamp(),
      });

      setSuccess(
        "Project updated successfully!"
      );

      /*
       * Go back to projects list
       */

      setTimeout(() => {
        router.push(
          "/admin/dashboard/projects"
        );
      }, 1000);

    } catch (err) {
      console.error(
        "Error updating project:",
        err
      );

      setError(
        "Failed to update project. Please check your Firestore permissions."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =====================================
   * LOADING SCREEN
   * =====================================
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
        <div
          className="
            flex flex-col
            items-center
            gap-4
          "
        >
          <Loader2
            size={34}
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
            Loading project...
          </p>
        </div>
      </main>
    );
  }

  /*
   * =====================================
   * PAGE
   * =====================================
   */

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        px-5
        py-8
        text-gray-900
        dark:bg-gray-950
        dark:text-white
        sm:py-12
      "
    >
      <div className="mx-auto max-w-3xl">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/dashboard/projects"
            )
          }
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-gray-700
            transition
            hover:-translate-y-0.5
            hover:border-blue-400
            hover:text-blue-600
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-gray-300
            dark:hover:border-blue-600
            dark:hover:text-blue-400
          "
        >
          <ArrowLeft size={17} />

          Back to Projects
        </button>

        {/* HEADER */}

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
            Project Management
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-extrabold
              tracking-tight
              text-gray-950
              dark:text-white
              sm:text-4xl
            "
          >
            Edit Project
          </h1>

          <p
            className="
              mt-2
              text-gray-600
              dark:text-gray-400
            "
          >
            Update the project information
            shown on your portfolio.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
              text-sm
              text-red-700
              dark:border-red-900
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            <X
              size={20}
              className="
                mt-0.5
                shrink-0
              "
            />

            <p>{error}</p>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-green-200
              bg-green-50
              p-4
              text-sm
              text-green-700
              dark:border-green-900
              dark:bg-green-950/30
              dark:text-green-400
            "
          >
            <CheckCircle2
              size={20}
              className="
                mt-0.5
                shrink-0
              "
            />

            <p>{success}</p>
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            rounded-3xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            sm:p-8
          "
        >

          {/* TITLE */}

          <div className="mb-6">

            <label
              htmlFor="title"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              Project Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="e.g. Student Progress System"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:placeholder:text-gray-600
              "
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mb-6">

            <label
              htmlFor="description"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe your project..."
              rows={5}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:placeholder:text-gray-600
              "
            />

          </div>

          {/* TECHNOLOGIES */}

          <div className="mb-6">

            <label
              htmlFor="technologies"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              Technologies
            </label>

            <input
              id="technologies"
              type="text"
              value={technologies}
              onChange={(event) =>
                setTechnologies(
                  event.target.value
                )
              }
              placeholder="Next.js, TypeScript, Firebase"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:placeholder:text-gray-600
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Separate technologies with
              commas.
            </p>

          </div>

          {/* GITHUB */}

          <div className="mb-6">

            <label
              htmlFor="githubUrl"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              GitHub URL
            </label>

            <input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(event) =>
                setGithubUrl(
                  event.target.value
                )
              }
              placeholder="https://github.com/username/project"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:placeholder:text-gray-600
              "
            />

          </div>

          {/* LIVE URL */}

          <div className="mb-6">

            <label
              htmlFor="liveUrl"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              Live Project URL
            </label>

            <input
              id="liveUrl"
              type="url"
              value={liveUrl}
              onChange={(event) =>
                setLiveUrl(
                  event.target.value
                )
              }
              placeholder="https://yourproject.com"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:placeholder:text-gray-600
              "
            />

          </div>

          {/* IMAGE URL */}

          <div className="mb-8">

            <label
              htmlFor="imageUrl"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              Project Image URL
            </label>

            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(event) =>
                setImageUrl(
                  event.target.value
                )
              }
              placeholder="https://example.com/project-image.jpg"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:placeholder:text-gray-600
              "
            />

          </div>

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/projects"
                )
              }
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-300
                bg-white
                px-5
                py-3
                text-sm
                font-bold
                text-gray-700
                transition
                hover:border-gray-400
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-gray-300
                dark:hover:bg-gray-800
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition-all
                hover:-translate-y-0.5
                hover:bg-blue-700
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Save Changes
                </>
              )}

            </button>

          </div>

        </form>

        {/* ADMIN INFO */}

        <p
          className="
            mt-5
            text-center
            text-xs
            text-gray-500
            dark:text-gray-500
          "
        >
          Signed in as {user?.email}
        </p>

      </div>
    </main>
  );
}