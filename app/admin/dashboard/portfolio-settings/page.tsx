"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  Image as ImageIcon,
  Mail,
  ExternalLink,
  CircleCheck,
  FileText,
  Code2,
  Plus,
  Trash2,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import AdminAuth from "@/app/components/AdminAuth";
import { useRouter } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

interface Skill {
  name: string;
  logo: string;
}

interface PortfolioSettings {
  name: string;
  profession: string;
  description: string;

  profileImage: string;

  email: string;
  github: string;
  linkedin: string;

  availableForWork: boolean;

  /* ABOUT */
  aboutLabel: string;
  aboutTitle: string;
  aboutDescription: string;

  /* SKILLS */
  skillsLabel: string;
  skillsTitle: string;
  skillsDescription: string;
  skills: Skill[];
}

/* =========================================================
   DEFAULT SKILLS
========================================================= */

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
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.27 2.373 4.27 5.466v6.276zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.56V8.999h3.554v11.453zM22.225 0H1.771C.792 0 0 .774.0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/* =========================================================
   INPUT CLASS
========================================================= */

const inputClass = `
  w-full
  rounded-xl
  border
  border-gray-300
  bg-white
  px-4
  py-3
  text-sm
  outline-none
  transition
  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-500/10
  disabled:opacity-60
  dark:border-gray-700
  dark:bg-gray-950
  dark:text-white
`;

/* =========================================================
   PAGE CONTENT
========================================================= */

function PortfolioSettingsContent() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<PortfolioSettings>({
      name: "",
      profession: "",
      description: "",

      profileImage: "",

      email: "",
      github: "",
      linkedin: "",

      availableForWork: true,

      aboutLabel: "About Me",
      aboutTitle: "Building useful digital experiences",
      aboutDescription:
        "I am a software developer interested in building reliable, modern and user-friendly applications. I enjoy turning ideas into practical software solutions.",

      skillsLabel: "Technologies",
      skillsTitle: "Tools I Work With",
      skillsDescription:
        "Technologies and tools I use to build modern and reliable applications.",

      skills: defaultSkills,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);

        const settingsRef = doc(
          db,
          "portfolioSettings",
          "main"
        );

        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setSettings({
            name: data.name || "",
            profession: data.profession || "",
            description: data.description || "",

            profileImage: data.profileImage || "",

            email: data.email || "",
            github: data.github || "",
            linkedin: data.linkedin || "",

            availableForWork:
              data.availableForWork !== false,

            aboutLabel:
              data.aboutLabel || "About Me",

            aboutTitle:
              data.aboutTitle ||
              "Building useful digital experiences",

            aboutDescription:
              data.aboutDescription ||
              "I am a software developer interested in building reliable, modern and user-friendly applications. I enjoy turning ideas into practical software solutions.",

            skillsLabel:
              data.skillsLabel || "Technologies",

            skillsTitle:
              data.skillsTitle || "Tools I Work With",

            skillsDescription:
              data.skillsDescription ||
              "Technologies and tools I use to build modern and reliable applications.",

            skills:
              Array.isArray(data.skills)
                ? data.skills
                : defaultSkills,
          });
        }
      } catch (err) {
        console.error(
          "Error loading portfolio settings:",
          err
        );

        setError(
          "Unable to load portfolio settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  }

  /* =======================================================
     UPDATE SKILL
  ======================================================= */

  function updateSkill(
    index: number,
    field: keyof Skill,
    value: string
  ) {
    setSettings((previous) => {
      const updatedSkills = [...previous.skills];

      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: value,
      };

      return {
        ...previous,
        skills: updatedSkills,
      };
    });

    setSuccess("");
    setError("");
  }

  /* =======================================================
     ADD SKILL
  ======================================================= */

  function addSkill() {
    setSettings((previous) => ({
      ...previous,
      skills: [
        ...previous.skills,
        {
          name: "",
          logo: "",
        },
      ],
    }));

    setSuccess("");
    setError("");
  }

  /* =======================================================
     REMOVE SKILL
  ======================================================= */

  function removeSkill(index: number) {
    setSettings((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (_, skillIndex) => skillIndex !== index
      ),
    }));

    setSuccess("");
    setError("");
  }

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!settings.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!settings.profession.trim()) {
      setError("Please enter your profession.");
      return;
    }

    if (!settings.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!settings.aboutTitle.trim()) {
      setError("Please enter the About section title.");
      return;
    }

    try {
      setSaving(true);

      const settingsRef = doc(
        db,
        "portfolioSettings",
        "main"
      );

      const cleanedSkills = settings.skills
        .map((skill) => ({
          name: skill.name.trim(),
          logo: skill.logo.trim(),
        }))
        .filter((skill) => skill.name !== "");

      await setDoc(settingsRef, {
        name: settings.name.trim(),
        profession: settings.profession.trim(),
        description: settings.description.trim(),

        profileImage:
          settings.profileImage.trim(),

        email: settings.email.trim(),
        github: settings.github.trim(),
        linkedin: settings.linkedin.trim(),

        availableForWork:
          settings.availableForWork,

        /* ABOUT */

        aboutLabel:
          settings.aboutLabel.trim(),

        aboutTitle:
          settings.aboutTitle.trim(),

        aboutDescription:
          settings.aboutDescription.trim(),

        /* SKILLS */

        skillsLabel:
          settings.skillsLabel.trim(),

        skillsTitle:
          settings.skillsTitle.trim(),

        skillsDescription:
          settings.skillsDescription.trim(),

        skills: cleanedSkills,

        updatedAt: new Date(),
      });

      setSettings((previous) => ({
        ...previous,
        skills: cleanedSkills,
      }));

      setSuccess(
        "Portfolio settings updated successfully!"
      );
    } catch (err) {
      console.error(
        "Portfolio settings update error:",
        err
      );

      setError(
        "Unable to update portfolio settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
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
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={38}
            className="
              animate-spin
              text-blue-600
              dark:text-blue-400
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
            Loading portfolio settings...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        px-4
        py-6
        text-gray-900
        dark:bg-gray-950
        dark:text-white
        sm:px-6
        sm:py-8
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.push("/admin/dashboard")
              }
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                border border-gray-200
                bg-white
                text-gray-700
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-blue-400
                hover:text-blue-600
                dark:border-gray-800
                dark:bg-gray-900
                dark:text-gray-300
              "
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-blue-600
                  dark:text-blue-400
                "
              >
                Admin Panel
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  tracking-tight
                  sm:text-3xl
                "
              >
                Portfolio Settings
              </h1>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/dashboard")
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-bold
              text-gray-700
              shadow-sm
              transition
              hover:border-blue-400
              hover:text-blue-600
              dark:border-gray-800
              dark:bg-gray-900
              dark:text-gray-300
            "
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-blue-100
            bg-blue-50
            p-4
            dark:border-blue-900/50
            dark:bg-blue-950/20
          "
        >
          <p
            className="
              text-sm
              leading-6
              text-blue-800
              dark:text-blue-300
            "
          >
            Manage your personal information, About
            section, skills, social links and availability
            from one place.
          </p>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

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
              className="mt-0.5 shrink-0"
            />

            <p>{success}</p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

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
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSave}>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div
            className="
              mb-6
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
              sm:p-7
            "
          >

            <div className="mb-6 flex items-center gap-4">

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  dark:bg-blue-950
                  dark:text-blue-400
                "
              >
                <User size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Basic information for your portfolio.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Full Name
                </label>

                <input
                  name="name"
                  type="text"
                  value={settings.name}
                  onChange={handleChange}
                  placeholder="Asindu Himansha"
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Profession
                </label>

                <div className="relative">

                  <Briefcase
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    name="profession"
                    type="text"
                    value={settings.profession}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    disabled={saving}
                    className={`${inputClass} pl-11`}
                  />

                </div>
              </div>

            </div>

            <div className="mt-5">

              <label className="mb-2 block text-sm font-bold">
                Description
              </label>

              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                rows={4}
                disabled={saving}
                className={`${inputClass} resize-none`}
                placeholder="Write a short description..."
              />

            </div>

          </div>

          {/* =================================================
              ABOUT SECTION
          ================================================= */}

          <div
            className="
              mb-6
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
              sm:p-7
            "
          >

            <div className="mb-6 flex items-center gap-4">

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-indigo-100
                  text-indigo-600
                  dark:bg-indigo-950
                  dark:text-indigo-400
                "
              >
                <FileText size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  About Section
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Change the content displayed in your About Me section.
                </p>
              </div>

            </div>

            {/* LABEL */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-bold">
                Section Label
              </label>

              <input
                name="aboutLabel"
                type="text"
                value={settings.aboutLabel}
                onChange={handleChange}
                placeholder="About Me"
                disabled={saving}
                className={inputClass}
              />

            </div>

            {/* TITLE */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-bold">
                About Title
              </label>

              <input
                name="aboutTitle"
                type="text"
                value={settings.aboutTitle}
                onChange={handleChange}
                placeholder="Building useful digital experiences"
                disabled={saving}
                className={inputClass}
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                About Description
              </label>

              <textarea
                name="aboutDescription"
                value={settings.aboutDescription}
                onChange={handleChange}
                rows={7}
                disabled={saving}
                className={`${inputClass} resize-none`}
                placeholder="Write about yourself..."
              />

            </div>

          </div>

          {/* =================================================
              SKILLS SECTION
          ================================================= */}

          <div
            className="
              mb-6
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
              sm:p-7
            "
          >

            <div
              className="
                mb-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-xl
                    bg-orange-100
                    text-orange-600
                    dark:bg-orange-950
                    dark:text-orange-400
                  "
                >
                  <Code2 size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Skills & Technologies
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Add, edit or remove technologies from your portfolio.
                  </p>
                </div>

              </div>

              {/* ADD BUTTON */}

              <button
                type="button"
                onClick={addSkill}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:opacity-60
                "
              >
                <Plus size={17} />
                Add Skill
              </button>

            </div>

            {/* SKILLS SECTION SETTINGS */}

            <div className="mb-7 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Section Label
                </label>

                <input
                  name="skillsLabel"
                  type="text"
                  value={settings.skillsLabel}
                  onChange={handleChange}
                  placeholder="Technologies"
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Section Title
                </label>

                <input
                  name="skillsTitle"
                  type="text"
                  value={settings.skillsTitle}
                  onChange={handleChange}
                  placeholder="Tools I Work With"
                  disabled={saving}
                  className={inputClass}
                />
              </div>

            </div>

            <div className="mb-7">

              <label className="mb-2 block text-sm font-bold">
                Section Description
              </label>

              <textarea
                name="skillsDescription"
                value={settings.skillsDescription}
                onChange={handleChange}
                rows={3}
                disabled={saving}
                className={`${inputClass} resize-none`}
                placeholder="Technologies and tools I use..."
              />

            </div>

            {/* SKILLS LIST */}

            <div className="space-y-4">

              {settings.skills.map(
                (skill, index) => (

                  <div
                    key={index}
                    className="
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      p-4
                      dark:border-gray-800
                      dark:bg-gray-950
                    "
                  >

                    <div
                      className="
                        mb-4
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            bg-blue-100
                            text-sm
                            font-bold
                            text-blue-600
                            dark:bg-blue-950
                            dark:text-blue-400
                          "
                        >
                          {index + 1}
                        </div>

                        <p className="text-sm font-bold">
                          Skill {index + 1}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(index)
                        }
                        disabled={saving}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          px-3
                          py-2
                          text-xs
                          font-bold
                          text-red-600
                          transition
                          hover:bg-red-50
                          dark:text-red-400
                          dark:hover:bg-red-950/30
                        "
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>

                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                      {/* NAME */}

                      <div>

                        <label className="mb-2 block text-xs font-bold text-gray-600 dark:text-gray-400">
                          Skill Name
                        </label>

                        <input
                          type="text"
                          value={skill.name}
                          onChange={(event) =>
                            updateSkill(
                              index,
                              "name",
                              event.target.value
                            )
                          }
                          placeholder="React"
                          disabled={saving}
                          className={inputClass}
                        />

                      </div>

                      {/* LOGO */}

                      <div>

                        <label className="mb-2 block text-xs font-bold text-gray-600 dark:text-gray-400">
                          Logo URL
                        </label>

                        <input
                          type="text"
                          value={skill.logo}
                          onChange={(event) =>
                            updateSkill(
                              index,
                              "logo",
                              event.target.value
                            )
                          }
                          placeholder="/tech/react.svg"
                          disabled={saving}
                          className={inputClass}
                        />

                      </div>

                    </div>

                    {/* LOGO PREVIEW */}

                    {skill.logo && (
                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          p-3
                          dark:border-gray-800
                          dark:bg-gray-900
                        "
                      >

                        <img
                          src={skill.logo}
                          alt={skill.name || "Skill"}
                          className="
                            h-10
                            w-10
                            object-contain
                          "
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Logo preview
                        </span>

                      </div>
                    )}

                  </div>

                )
              )}

            </div>

            {settings.skills.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-gray-300
                  p-8
                  text-center
                  dark:border-gray-700
                "
              >
                <Code2
                  size={35}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold">
                  No skills added
                </p>

                <button
                  type="button"
                  onClick={addSkill}
                  className="
                    mt-4
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Add Your First Skill
                </button>
              </div>
            )}

          </div>

          {/* =================================================
              PROFILE IMAGE + SOCIAL LINKS
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* PROFILE IMAGE */}

            <div
              className="
                rounded-3xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                dark:border-gray-800
                dark:bg-gray-900
                sm:p-7
              "
            >

              <div className="mb-6 flex items-center gap-4">

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-xl
                    bg-purple-100
                    text-purple-600
                    dark:bg-purple-950
                    dark:text-purple-400
                  "
                >
                  <ImageIcon size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Profile Image
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Image displayed on your homepage.
                  </p>
                </div>

              </div>

              <label className="mb-2 block text-sm font-bold">
                Profile Image URL
              </label>

              <input
                name="profileImage"
                type="text"
                value={settings.profileImage}
                onChange={handleChange}
                placeholder="/profile.png"
                disabled={saving}
                className={inputClass}
              />

              <div
                className="
                  mt-5
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-100
                  dark:border-gray-800
                  dark:bg-gray-950
                "
              >
                {settings.profileImage ? (
                  <img
                    src={settings.profileImage}
                    alt="Profile preview"
                    className="h-64 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div
                    className="
                      flex h-64
                      items-center justify-center
                      text-sm text-gray-400
                    "
                  >
                    No image URL
                  </div>
                )}
              </div>

            </div>

            {/* SOCIAL LINKS */}

            <div
              className="
                rounded-3xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                dark:border-gray-800
                dark:bg-gray-900
                sm:p-7
              "
            >

              <div className="mb-6 flex items-center gap-4">

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-xl
                    bg-gray-100
                    text-gray-700
                    dark:bg-gray-800
                    dark:text-gray-200
                  "
                >
                  <ExternalLink size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Social Links
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Links shown on your portfolio.
                  </p>
                </div>

              </div>

              {/* GITHUB */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold">
                  GitHub
                </label>

                <div className="relative">

                  <div
                    className="
                      absolute left-4 top-1/2
                      flex -translate-y-1/2
                      text-gray-600
                      dark:text-gray-300
                    "
                  >
                    <GithubIcon />
                  </div>

                  <input
                    name="github"
                    type="url"
                    value={settings.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    disabled={saving}
                    className={`${inputClass} pl-12`}
                  />

                </div>

              </div>

              {/* LINKEDIN */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold">
                  LinkedIn
                </label>

                <div className="relative">

                  <div
                    className="
                      absolute left-4 top-1/2
                      flex -translate-y-1/2
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    <LinkedinIcon />
                  </div>

                  <input
                    name="linkedin"
                    type="url"
                    value={settings.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    disabled={saving}
                    className={`${inputClass} pl-12`}
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-bold">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={saving}
                    className={`${inputClass} pl-11`}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <div
            className="
              mt-6
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
              sm:p-7
            "
          >

            <div className="mb-6 flex items-center gap-4">

              <div
                className={`
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  ${
                    settings.availableForWork
                      ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }
                `}
              >
                <CircleCheck size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Availability
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Control your work availability status.
                </p>
              </div>

            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setSettings((previous) => ({
                  ...previous,
                  availableForWork:
                    !previous.availableForWork,
                }));

                setSuccess("");
                setError("");
              }}
              className="
                flex w-full
                items-center justify-between
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                p-4
                text-left
                transition
                hover:border-blue-300
                dark:border-gray-800
                dark:bg-gray-950
              "
            >

              <div>

                <p className="font-bold">
                  Available for work
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {settings.availableForWork
                    ? "Your homepage will show that you are currently available."
                    : "Your homepage will hide the available-for-work indicator."}
                </p>

              </div>

              <div
                className={`
                  relative
                  h-7 w-12
                  shrink-0
                  rounded-full
                  transition
                  ${
                    settings.availableForWork
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-700"
                  }
                `}
              >

                <span
                  className={`
                    absolute top-1
                    h-5 w-5
                    rounded-full
                    bg-white
                    shadow
                    transition-transform
                    ${
                      settings.availableForWork
                        ? "translate-x-6"
                        : "translate-x-1"
                    }
                  `}
                />

              </div>

            </button>

          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <div
            className="
              mt-6
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
                router.push("/admin/dashboard")
              }
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-gray-700
                transition
                hover:border-gray-400
                hover:bg-gray-50
                disabled:opacity-60
                dark:border-gray-800
                dark:bg-gray-900
                dark:text-gray-300
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
                px-7
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

      </div>
    </main>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function PortfolioSettingsPage() {
  return (
    <AdminAuth>
      <PortfolioSettingsContent />
    </AdminAuth>
  );
}