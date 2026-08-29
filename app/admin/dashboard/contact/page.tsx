"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import {
  CheckCircle2,
  Clock,
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  MessageSquare,
  User,
  ArrowLeft,
  Inbox,
} from "lucide-react";

import { db } from "@/lib/firebase";
import AdminAuth from "@/app/components/AdminAuth";
import { useRouter } from "next/navigation";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read";
  createdAt: any;
}

/* =========================================================
   CONTACT MESSAGES CONTENT
========================================================= */

function ContactMessagesContent() {
  const router = useRouter();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* =======================================================
     LOAD MESSAGES
  ======================================================= */

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const data: ContactMessage[] = snapshot.docs.map(
          (document) => {
            const item = document.data();

            return {
              id: document.id,
              name: item.name || "",
              email: item.email || "",
              subject: item.subject || "",
              message: item.message || "",
              status: item.status || "new",
              createdAt: item.createdAt,
            };
          }
        );

        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Contact messages error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =======================================================
     MARK AS READ
  ======================================================= */

  async function markAsRead(id: string) {
    try {
      await updateDoc(
        doc(db, "contactMessages", id),
        {
          status: "read",
        }
      );
    } catch (error) {
      console.error(
        "Mark as read error:",
        error
      );
    }
  }

  /* =======================================================
     DELETE MESSAGE
  ======================================================= */

  async function deleteMessage(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);

      await deleteDoc(
        doc(db, "contactMessages", id)
      );
    } catch (error) {
      console.error(
        "Delete message error:",
        error
      );
    } finally {
      setDeleting(null);
    }
  }

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  function formatDate(timestamp: any) {
    if (!timestamp) {
      return "Just now";
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString();
    } catch {
      return "Unknown date";
    }
  }

  /* =======================================================
     STATISTICS
  ======================================================= */

  const newMessages = messages.filter(
    (message) => message.status === "new"
  ).length;

  const readMessages = messages.filter(
    (message) => message.status === "read"
  ).length;

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
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-100
              text-blue-600
              dark:bg-blue-950/50
              dark:text-blue-400
            "
          >
            <Loader2
              size={28}
              className="animate-spin"
            />
          </div>

          <p
            className="
              text-sm
              font-medium
              text-gray-600
              dark:text-gray-400
            "
          >
            Loading contact messages...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        px-4
        py-5
        text-gray-900
        dark:bg-gray-950
        dark:text-white
        sm:px-6
        sm:py-8
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            MODERN HEADER
        ================================================== */}

        <header
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
          <div
            className="
              flex
              flex-col
              gap-6
              p-5
              sm:p-7
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* LEFT SIDE */}

            <div className="flex items-start gap-4">

              {/* ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-100
                  text-blue-600
                  dark:bg-blue-950/50
                  dark:text-blue-400
                "
              >
                <Inbox size={27} />
              </div>

              {/* TITLE */}

              <div>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
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
                  </span>

                  {newMessages > 0 && (
                    <span
                      className="
                        rounded-full
                        bg-blue-100
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        text-blue-700
                        dark:bg-blue-950
                        dark:text-blue-400
                      "
                    >
                      {newMessages} New
                    </span>
                  )}
                </div>

                <h1
                  className="
                    mt-1
                    text-2xl
                    font-extrabold
                    tracking-tight
                    sm:text-3xl
                  "
                >
                  Contact Messages
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  View and manage messages from your
                  website visitors.
                </p>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
              "
            >

              {/* STAT */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  dark:border-gray-800
                  dark:bg-gray-950
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    dark:bg-blue-950/50
                    dark:text-blue-400
                  "
                >
                  <Mail size={19} />
                </div>

                <div>
                  <p
                    className="
                      text-xl
                      font-extrabold
                    "
                  >
                    {messages.length}
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Total messages
                  </p>
                </div>
              </div>

              {/* BACK BUTTON */}

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
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-gray-800
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-blue-300
                  hover:bg-blue-50
                  hover:text-blue-700
                  active:translate-y-0
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-200
                  dark:hover:border-blue-800
                  dark:hover:bg-blue-950/40
                  dark:hover:text-blue-400
                "
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </button>

            </div>

          </div>

          {/* HEADER STATS */}

          <div
            className="
              grid
              grid-cols-2
              border-t
              border-gray-200
              dark:border-gray-800
              sm:grid-cols-3
            "
          >

            {/* TOTAL */}

            <div
              className="
                flex
                items-center
                gap-3
                px-5
                py-4
                sm:px-7
              "
            >
              <Mail
                size={18}
                className="
                  text-blue-600
                  dark:text-blue-400
                "
              />

              <div>
                <p className="text-lg font-bold">
                  {messages.length}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Total
                </p>
              </div>
            </div>

            {/* NEW */}

            <div
              className="
                flex
                items-center
                gap-3
                border-l
                border-gray-200
                px-5
                py-4
                sm:px-7
                dark:border-gray-800
              "
            >
              <MailOpen
                size={18}
                className="
                  text-blue-600
                  dark:text-blue-400
                "
              />

              <div>
                <p className="text-lg font-bold">
                  {newMessages}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Unread
                </p>
              </div>
            </div>

            {/* READ */}

            <div
              className="
                hidden
                items-center
                gap-3
                border-l
                border-gray-200
                px-7
                py-4
                sm:flex
                dark:border-gray-800
              "
            >
              <CheckCircle2
                size={18}
                className="
                  text-green-600
                  dark:text-green-400
                "
              />

              <div>
                <p className="text-lg font-bold">
                  {readMessages}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Read
                </p>
              </div>
            </div>

          </div>

        </header>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {messages.length === 0 ? (
          <div
            className="
              mt-6
              rounded-3xl
              border
              border-gray-200
              bg-white
              px-6
              py-16
              text-center
              shadow-sm
              dark:border-gray-800
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
                rounded-full
                bg-gray-100
                text-gray-500
                dark:bg-gray-800
                dark:text-gray-400
              "
            >
              <Mail size={28} />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
              "
            >
              No Contact Messages
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Messages submitted through your website
              contact form will appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/dashboard")
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
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>
          </div>
        ) : (

          /* =================================================
             MESSAGE LIST
          ================================================== */

          <div className="mt-6 space-y-5">

            {messages.map((message) => (
              <div
                key={message.id}
                className="
                  group
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  dark:border-gray-800
                  dark:bg-gray-900
                  sm:p-6
                "
              >

                {/* =================================================
                    TOP
                ================================================== */}

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

                  <div className="flex items-start gap-4">

                    {/* USER ICON */}

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-100
                        text-blue-600
                        dark:bg-blue-950/50
                        dark:text-blue-400
                      "
                    >
                      <User size={21} />
                    </div>

                    {/* USER INFO */}

                    <div className="min-w-0">

                      <h2
                        className="
                          truncate
                          text-lg
                          font-bold
                        "
                      >
                        {message.name}
                      </h2>

                      <a
                        href={`mailto:${message.email}`}
                        className="
                          mt-1
                          block
                          truncate
                          text-sm
                          text-blue-600
                          transition
                          hover:underline
                          dark:text-blue-400
                        "
                      >
                        {message.email}
                      </a>

                    </div>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`
                      inline-flex
                      w-fit
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      ${
                        message.status === "new"
                          ? `
                            bg-blue-100
                            text-blue-700
                            dark:bg-blue-950
                            dark:text-blue-400
                          `
                          : `
                            bg-green-100
                            text-green-700
                            dark:bg-green-950
                            dark:text-green-400
                          `
                      }
                    `}
                  >
                    {message.status === "new" ? (
                      <Mail size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}

                    {message.status === "new"
                      ? "New"
                      : "Read"}
                  </span>

                </div>

                {/* =================================================
                    SUBJECT
                ================================================== */}

                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-gray-50
                    p-4
                    dark:bg-gray-950
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-gray-500
                    "
                  >
                    Subject
                  </p>

                  <p
                    className="
                      mt-1
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {message.subject}
                  </p>
                </div>

                {/* =================================================
                    MESSAGE
                ================================================== */}

                <div className="mt-5">

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-bold
                    "
                  >
                    <MessageSquare size={17} />
                    Message
                  </div>

                  <p
                    className="
                      mt-2
                      whitespace-pre-wrap
                      text-sm
                      leading-7
                      text-gray-600
                      dark:text-gray-400
                    "
                  >
                    {message.message}
                  </p>

                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div
                  className="
                    mt-6
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-gray-200
                    pt-5
                    dark:border-gray-800
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    <Clock size={14} />

                    {formatDate(
                      message.createdAt
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {/* MARK READ */}

                    {message.status === "new" && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(message.id)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-green-200
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-green-600
                          transition
                          hover:bg-green-50
                          dark:border-green-900
                          dark:text-green-400
                          dark:hover:bg-green-950/40
                        "
                      >
                        <MailOpen size={16} />
                        <span className="hidden sm:inline">
                          Mark Read
                        </span>
                        <span className="sm:hidden">
                          Read
                        </span>
                      </button>
                    )}

                    {/* DELETE */}

                    <button
                      type="button"
                      disabled={
                        deleting === message.id
                      }
                      onClick={() =>
                        deleteMessage(message.id)
                      }
                      className="
                        inline-flex
                        items-center
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
                        disabled:opacity-60
                        dark:border-red-900
                        dark:text-red-400
                        dark:hover:bg-red-950/40
                      "
                    >
                      {deleting === message.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}

                      <span className="hidden sm:inline">
                        Delete
                      </span>
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ContactMessagesPage() {
  return (
    <AdminAuth>
      <ContactMessagesContent />
    </AdminAuth>
  );
}