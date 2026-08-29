"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Plus,
  Tag,
  X,
} from "lucide-react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddProjectForm() {
  const router = useRouter();

  // ================================
  // FORM STATES
  // ================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [technologyInput, setTechnologyInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ================================
  // ADD TECHNOLOGY
  // ================================

  function addTechnology() {
    const technology = technologyInput.trim();

    if (!technology) {
      return;
    }

    if (technologies.includes(technology)) {
      setTechnologyInput("");
      return;
    }

    setTechnologies((prev) => [...prev, technology]);
    setTechnologyInput("");
  }

  // ================================
  // REMOVE TECHNOLOGY
  // ================================

  function removeTechnology(technologyToRemove: string) {
    setTechnologies((prev) =>
      prev.filter(
        (technology) => technology !== technologyToRemove
      )
    );
  }

  // ================================
  // ENTER KEY FOR TECHNOLOGY
  // ================================

  function handleTechnologyKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  }

  // ================================
  // URL VALIDATION
  // ================================

  function isValidUrl(value: string) {
    if (!value.trim()) {
      return true;
    }

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  // ================================
  // SUBMIT PROJECT
  // ================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ================================
    // BASIC VALIDATION
    // ================================

    if (!title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a project description.");
      return;
    }

    if (technologies.length === 0) {
      setError(
        "Please add at least one technology."
      );
      return;
    }

    // ================================
    // URL VALIDATION
    // ================================

    if (!isValidUrl(imageUrl)) {
      setError("Please enter a valid image URL.");
      return;
    }

    if (!isValidUrl(githubUrl)) {
      setError("Please enter a valid GitHub URL.");
      return;
    }

    if (!isValidUrl(liveUrl)) {
      setError("Please enter a valid live project URL.");
      return;
    }

    try {
      setLoading(true);

      // ================================
      // SAVE TO FIRESTORE
      // ================================

      await addDoc(collection(db, "projects"), {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl.trim(),
        technologies: technologies,
        createdAt: serverTimestamp(),
      });

      // ================================
      // SUCCESS
      // ================================

      setSuccess(
        "Project added successfully!"
      );

      // Reset form
      setTitle("");
      setDescription("");
      setImageUrl("");
      setGithubUrl("");
      setLiveUrl("");
      setTechnologies([]);
      setTechnologyInput("");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/dashboard/projects");
      }, 1200);

    } catch (err) {
      console.error("Error adding project:", err);

      setError(
        "Failed to add project. Please check your Firebase permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 dark:bg-gray-950">

      {/* ================================
          TOP
      ================================= */}

      <div className="mx-auto max-w-4xl">

        {/* Back Button */}

        <button
          type="button"
          onClick={() =>
            router.push("/admin/dashboard")
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
            py-2
            text-sm
            font-semibold
            text-gray-700
            transition
            hover:border-blue-400
            hover:text-blue-600
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-gray-300
            dark:hover:border-blue-700
            dark:hover:text-blue-400
          "
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Header */}

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
            Add New Project
          </h1>

          <p
            className="
              mt-2
              text-gray-600
              dark:text-gray-400
            "
          >
            Add a new project to your portfolio.
          </p>

        </div>

        {/* ================================
            FORM CARD
        ================================= */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            {/* ================================
                SUCCESS MESSAGE
            ================================= */}

            {success && (
              <div
                className="
                  mb-6
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-green-200
                  bg-green-50
                  p-4
                  text-green-700
                  dark:border-green-900
                  dark:bg-green-950/30
                  dark:text-green-400
                "
              >
                <CheckCircle2 size={21} />

                <span className="text-sm font-semibold">
                  {success}
                </span>
              </div>
            )}

            {/* ================================
                ERROR MESSAGE
            ================================= */}

            {error && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
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

            {/* ================================
                PROJECT TITLE
            ================================= */}

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
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Student Progress System"
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-gray-700
                  dark:bg-gray-950
                  dark:text-white
                  dark:placeholder:text-gray-600
                "
              />

            </div>

            {/* ================================
                DESCRIPTION
            ================================= */}

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
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your project..."
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-gray-700
                  dark:bg-gray-950
                  dark:text-white
                  dark:placeholder:text-gray-600
                "
              />

            </div>

            {/* ================================
                IMAGE URL
            ================================= */}

            <div className="mb-6">

              <label
                htmlFor="imageUrl"
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-gray-800
                  dark:text-gray-200
                "
              >
                <ImageIcon size={17} />
                Project Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
                placeholder="https://example.com/project-image.jpg"
                disabled={loading}
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
                  dark:text-gray-500
                "
              >
                Optional. Use a publicly accessible image URL.
              </p>

            </div>

            {/* ================================
                TECHNOLOGIES
            ================================= */}

            <div className="mb-6">

              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-gray-800
                  dark:text-gray-200
                "
              >
                <Tag size={17} />
                Technologies
                <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={technologyInput}
                  onChange={(e) =>
                    setTechnologyInput(e.target.value)
                  }
                  onKeyDown={handleTechnologyKeyDown}
                  placeholder="e.g. Next.js"
                  disabled={loading}
                  className="
                    min-w-0
                    flex-1
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
                  "
                />

                <button
                  type="button"
                  onClick={addTechnology}
                  disabled={loading}
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    px-4
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Plus size={20} />
                </button>

              </div>

              {/* Technology Tags */}

              {technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">

                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-blue-700
                        dark:bg-blue-950/50
                        dark:text-blue-300
                      "
                    >
                      {technology}

                      <button
                        type="button"
                        onClick={() =>
                          removeTechnology(technology)
                        }
                        disabled={loading}
                        className="
                          rounded-full
                          transition
                          hover:text-red-600
                        "
                        aria-label={`Remove ${technology}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                </div>
              )}

            </div>

            {/* ================================
                LINKS
            ================================= */}

            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >

              {/* GitHub */}

              <div>

                <label
                  htmlFor="githubUrl"
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-gray-800
                    dark:text-gray-200
                  "
                >

                  {/* GitHub SVG */}

                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.486 2 12.02c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.238-.009-.868-.013-1.703-2.782.606-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.908-.622.069-.61.069-.61 1.004.071 1.532 1.033 1.532 1.033.892 1.531 2.341 1.089 2.91.833.091-.647.349-1.089.635-1.34-2.22-.254-4.555-1.114-4.555-4.957 0-1.095.39-1.991 1.029-2.693 0 0-.446-1.274.098-2.654 0 0 .84-.27 2.75 1.027A9.53 9.53 0 0112 6.844a9.53 9.53 0 012.504.34c1.909-1.297 2.748-1.027 2.748-1.027.545 1.38.202 2.401.1 2.654.64.702 1.028 1.598 1.028 2.693 0 3.853-2.339 4.7-4.566 4.95.359.31.678.92.678 1.854 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.024 10.024 0 0022 12.02C22 6.486 17.523 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>

                  GitHub URL

                </label>

                <div className="relative">

                  <input
                    id="githubUrl"
                    type="url"
                    value={githubUrl}
                    onChange={(e) =>
                      setGithubUrl(e.target.value)
                    }
                    placeholder="https://github.com/..."
                    disabled={loading}
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
                    "
                  />

                </div>

              </div>

              {/* Live Project */}

              <div>

                <label
                  htmlFor="liveUrl"
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-gray-800
                    dark:text-gray-200
                  "
                >
                  <LinkIcon size={17} />
                  Live Project URL
                </label>

                <input
                  id="liveUrl"
                  type="url"
                  value={liveUrl}
                  onChange={(e) =>
                    setLiveUrl(e.target.value)
                  }
                  placeholder="https://yourproject.com"
                  disabled={loading}
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
                  "
                />

              </div>

            </div>

            {/* ================================
                ACTIONS
            ================================= */}

            <div
              className="
                mt-8
                flex
                flex-col-reverse
                gap-3
                border-t
                border-gray-200
                pt-6
                sm:flex-row
                sm:justify-end
                dark:border-gray-800
              "
            >

              {/* Cancel */}

              <button
                type="button"
                onClick={() =>
                  router.push("/admin/dashboard")
                }
                disabled={loading}
                className="
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-gray-700
                  transition
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

              {/* Save */}

              <button
                type="submit"
                disabled={loading}
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
                  transition
                  hover:bg-blue-700
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add Project
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}