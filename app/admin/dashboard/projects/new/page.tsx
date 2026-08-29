"use client";

import AddProjectForm from "@/app/components/AddProjectForm";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";


export default function NewProjectPage() {
  const router = useRouter();

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
      <div className="mx-auto max-w-4xl">

        {/* ================================
            BACK BUTTON
        ================================= */}

        <button
          onClick={() => router.push("/admin/dashboard")}
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
            hover:border-blue-500
            hover:text-blue-600
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-gray-300
            dark:hover:border-blue-400
            dark:hover:text-blue-400
          "
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* ================================
            PAGE HEADER
        ================================= */}

        <div
          className="
            mb-8
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
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-white
                shadow-lg
                shadow-blue-600/20
              "
            >
              <FolderPlus size={24} />
            </div>

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
                Portfolio
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-gray-950
                  dark:text-white
                  sm:text-3xl
                "
              >
                Add New Project
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Add a project to your portfolio. The project
                will be stored in Firebase Firestore.
              </p>
            </div>

          </div>
        </div>

        {/* ================================
            ADD PROJECT FORM
        ================================= */}

        <AddProjectForm/>

      </div>
    </main>
  );
}