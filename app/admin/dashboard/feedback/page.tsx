"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquare,
  Trash2,
  XCircle,
} from "lucide-react";

interface Feedback {
  id: string;
  name?: string;
  email?: string;
  message?: string;
  rating?: number;
  approved?: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function ManageFeedback() {
  const router = useRouter();

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD FEEDBACK
  // ==========================================

  useEffect(() => {
    loadFeedback();
  }, []);

  async function loadFeedback() {
    try {
      setLoading(true);
      setError("");

      const feedbackQuery = query(
        collection(db, "feedback"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(feedbackQuery);

      const feedbackList: Feedback[] = snapshot.docs.map(
        (feedbackDoc) => ({
          id: feedbackDoc.id,
          ...(feedbackDoc.data() as Omit<Feedback, "id">),
        })
      );

      setFeedback(feedbackList);
    } catch (error) {
      console.error("Error loading feedback:", error);

      setError(
        "Unable to load feedback. Please check your Firestore permissions and indexes."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // APPROVE / HIDE FEEDBACK
  // ==========================================

  async function handleApproval(
    id: string,
    approved: boolean
  ) {
    try {
      setUpdatingId(id);
      setError("");

      await updateDoc(doc(db, "feedback", id), {
        approved: approved,
      });

      setFeedback((currentFeedback) =>
        currentFeedback.map((item) =>
          item.id === id
            ? {
                ...item,
                approved: approved,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Approval error:", error);

      setError(
        "Unable to update feedback. Please check your Firestore permissions."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // ==========================================
  // DELETE FEEDBACK
  // ==========================================

  async function handleDelete(
    id: string,
    name: string
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete feedback from "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteDoc(doc(db, "feedback", id));

      setFeedback((currentFeedback) =>
        currentFeedback.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      setError(
        "Unable to delete feedback. Please check your Firestore permissions."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(feedbackItem: Feedback) {
    if (!feedbackItem.createdAt) {
      return "Date unavailable";
    }

    try {
      const date = new Date(
        feedbackItem.createdAt.seconds * 1000
      );

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  }

  // ==========================================
  // LOADING SCREEN
  // ==========================================

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
              font-medium
              text-gray-600
              dark:text-gray-400
            "
          >
            Loading feedback...
          </p>

        </div>
      </main>
    );
  }

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

      {/* ==========================================
          HEADER
      ========================================== */}

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
            px-5
          "
        >

          <button
            type="button"
            onClick={() =>
              router.push("/admin/dashboard")
            }
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

          <div className="ml-3">

            <h1
              className="
                text-sm
                font-bold
                text-gray-950
                dark:text-white
              "
            >
              Manage Feedback
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
              Visitor Feedback Management
            </p>

          </div>

        </div>
      </header>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
        "
      >

        {/* PAGE HEADER */}

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
            Visitor Feedback
          </h2>

          <p
            className="
              mt-2
              text-gray-600
              dark:text-gray-400
            "
          >
            Review, approve, hide, or delete visitor
            feedback.
          </p>

        </div>

        {/* ERROR */}

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

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {feedback.length === 0 ? (

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
              <MessageSquare size={30} />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-bold
              "
            >
              No feedback yet
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
              Visitor feedback submitted through your
              website will appear here.
            </p>

          </div>

        ) : (

          /* ==========================================
             FEEDBACK LIST
          ========================================== */

          <div className="space-y-5">

            {feedback.map((item) => {

              const isUpdating =
                updatingId === item.id;

              const isDeleting =
                deletingId === item.id;

              return (
                <article
                  key={item.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <div className="p-6">

                    {/* TOP */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >

                      <div>

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-blue-100
                              font-bold
                              text-blue-700
                              dark:bg-blue-950
                              dark:text-blue-300
                            "
                          >
                            {(item.name || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <h3
                              className="
                                font-bold
                                text-gray-950
                                dark:text-white
                              "
                            >
                              {item.name ||
                                "Anonymous Visitor"}
                            </h3>

                            {item.email && (
                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                  dark:text-gray-400
                                "
                              >
                                {item.email}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* STATUS */}

                      {item.approved ? (

                        <span
                          className="
                            inline-flex
                            w-fit
                            items-center
                            gap-1.5
                            rounded-full
                            bg-green-100
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-green-700
                            dark:bg-green-950
                            dark:text-green-400
                          "
                        >
                          <CheckCircle2 size={14} />
                          Approved
                        </span>

                      ) : (

                        <span
                          className="
                            inline-flex
                            w-fit
                            items-center
                            gap-1.5
                            rounded-full
                            bg-yellow-100
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-yellow-700
                            dark:bg-yellow-950
                            dark:text-yellow-400
                          "
                        >
                          <Clock3 size={14} />
                          Pending
                        </span>

                      )}

                    </div>

                    {/* RATING */}

                    {item.rating !== undefined && (
                      <div className="mt-5">

                        <div className="flex items-center gap-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <span
                                key={star}
                                className={
                                  star <=
                                  Number(item.rating)
                                    ? "text-yellow-500"
                                    : "text-gray-300 dark:text-gray-700"
                                }
                              >
                                ★
                              </span>
                            )
                          )}

                          <span
                            className="
                              ml-2
                              text-xs
                              font-semibold
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            {item.rating}/5
                          </span>

                        </div>

                      </div>
                    )}

                    {/* MESSAGE */}

                    <div
                      className="
                        mt-5
                        rounded-xl
                        bg-gray-50
                        p-4
                        dark:bg-gray-950
                      "
                    >
                      <p
                        className="
                          text-sm
                          leading-7
                          text-gray-700
                          dark:text-gray-300
                        "
                      >
                        {item.message ||
                          "No message provided."}
                      </p>
                    </div>

                    {/* DATE */}

                    <p
                      className="
                        mt-4
                        text-xs
                        text-gray-500
                        dark:text-gray-500
                      "
                    >
                      Submitted {formatDate(item)}
                    </p>

                    {/* ACTIONS */}

                    <div
                      className="
                        mt-6
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-gray-100
                        pt-5
                        sm:flex-row
                        sm:justify-end
                        dark:border-gray-800
                      "
                    >

                      {/* APPROVE / HIDE */}

                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onClick={() =>
                          handleApproval(
                            item.id,
                            !item.approved
                          )
                        }
                        className={`
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          ${
                            item.approved
                              ? `
                                border
                                border-yellow-200
                                text-yellow-700
                                hover:bg-yellow-50
                                dark:border-yellow-900
                                dark:text-yellow-400
                                dark:hover:bg-yellow-950/30
                              `
                              : `
                                bg-green-600
                                text-white
                                hover:bg-green-700
                              `
                          }
                        `}
                      >

                        {isUpdating ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : item.approved ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}

                        {item.approved
                          ? "Hide Feedback"
                          : "Approve"}

                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={
                          isDeleting ||
                          isUpdating
                        }
                        onClick={() =>
                          handleDelete(
                            item.id,
                            item.name ||
                              "Anonymous Visitor"
                          )
                        }
                        className="
                          inline-flex
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

                        {isDeleting ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        Delete

                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}