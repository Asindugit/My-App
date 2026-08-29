"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  Send,
  Star,
} from "lucide-react";

import { db } from "@/lib/firebase";

export default function ContactPreview() {
  // =========================================
  // COLLAPSE / EXPAND
  // =========================================

  // Mobile starts collapsed.
  // Desktop will automatically show the forms using lg:block.
  const [contactOpen, setContactOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // =========================================
  // CONTACT FORM
  // =========================================

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [sendingContact, setSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  // =========================================
  // FEEDBACK FORM
  // =========================================

  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [rating, setRating] = useState(5);

  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  // =========================================
  // CONTACT SUBMIT
  // =========================================

  async function handleContactSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setContactSuccess("");
    setContactError("");

    if (!contactName.trim()) {
      setContactError("Please enter your name.");
      return;
    }

    if (!contactEmail.trim()) {
      setContactError("Please enter your email.");
      return;
    }

    if (!contactSubject.trim()) {
      setContactError("Please enter a subject.");
      return;
    }

    if (!contactMessage.trim()) {
      setContactError("Please enter your message.");
      return;
    }

    try {
      setSendingContact(true);

      await addDoc(collection(db, "contactMessages"), {
        name: contactName.trim(),
        email: contactEmail.trim(),
        subject: contactSubject.trim(),
        message: contactMessage.trim(),
        status: "new",
        createdAt: serverTimestamp(),
      });

      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");

      setContactSuccess(
        "Your message has been sent successfully!"
      );
    } catch (error) {
      console.error("Contact message error:", error);

      setContactError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSendingContact(false);
    }
  }

  // =========================================
  // FEEDBACK SUBMIT
  // =========================================

  async function handleFeedbackSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFeedbackSuccess("");
    setFeedbackError("");

    if (!feedbackName.trim()) {
      setFeedbackError("Please enter your name.");
      return;
    }

    if (!feedbackMessage.trim()) {
      setFeedbackError("Please enter your feedback.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setFeedbackError("Please select a rating.");
      return;
    }

    try {
      setSendingFeedback(true);

      await addDoc(collection(db, "feedback"), {
        name: feedbackName.trim(),
        email: feedbackEmail.trim(),
        message: feedbackMessage.trim(),
        rating: rating,
        approved: false,
        createdAt: serverTimestamp(),
      });

      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackMessage("");
      setRating(5);

      setFeedbackSuccess(
        "Thank you! Your feedback has been submitted for review."
      );
    } catch (error) {
      console.error("Feedback submission error:", error);

      setFeedbackError(
        "Unable to submit your feedback. Please try again."
      );
    } finally {
      setSendingFeedback(false);
    }
  }

  return (
    <section
      id="contact"
      className="
        bg-white
        px-5
        py-14
        dark:bg-gray-950
        sm:py-20
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* =====================================
            SECTION HEADER
        ====================================== */}

        <div className="text-center">

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.22em]
              text-blue-600
              dark:text-blue-400
              sm:text-sm
            "
          >
            Get In Touch
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-extrabold
              tracking-tight
              text-gray-950
              dark:text-white
              sm:mt-3
              sm:text-4xl
            "
          >
            Let's Connect
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-gray-600
              dark:text-gray-400
              sm:text-base
            "
          >
            Send me a message or share your feedback
            about my portfolio.
          </p>

        </div>

        {/* =====================================
            FORM CARDS
        ====================================== */}

        <div
          className="
            mt-8
            grid
            gap-4
            lg:mt-10
            lg:grid-cols-2
            lg:gap-6
          "
        >

          {/* ===================================
              CONTACT CARD
          ==================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              shadow-sm
              transition-all
              duration-300
              hover:shadow-md
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            {/* =================================
                CONTACT HEADER
            ================================== */}

            <button
              type="button"
              onClick={() =>
                setContactOpen(!contactOpen)
              }
              className="
                flex
                w-full
                items-center
                justify-between
                p-5
                text-left
                transition
                hover:bg-gray-100
                dark:hover:bg-gray-800
                lg:cursor-default
              "
            >

              <div className="flex items-center gap-4">

                {/* ICON */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    dark:bg-blue-950
                    dark:text-blue-400
                  "
                >
                  <Mail size={21} />
                </div>

                {/* TITLE */}

                <div>

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-gray-950
                      dark:text-white
                      sm:text-xl
                    "
                  >
                    Contact Me
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                      sm:text-sm
                    "
                  >
                    Have a project idea or question?
                  </p>

                </div>

              </div>

              {/* ARROW */}

              <ChevronDown
                size={21}
                className={`
                  shrink-0
                  text-gray-500
                  transition-transform
                  duration-300
                  dark:text-gray-400
                  lg:hidden
                  ${contactOpen ? "rotate-180" : ""}
                `}
              />

            </button>

            {/* =================================
                CONTACT FORM
            ================================== */}

            <div
              className={`
                grid
                transition-all
                duration-300
                ease-in-out
                lg:grid-rows-[1fr]
                lg:opacity-100
                ${
                  contactOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 lg:opacity-100"
                }
              `}
            >

              <div className="overflow-hidden">

                <div className="border-t border-gray-200 p-5 dark:border-gray-800 sm:p-7">

                  {/* SUCCESS */}

                  {contactSuccess && (
                    <div
                      className="
                        mb-5
                        flex
                        items-start
                        gap-3
                        rounded-xl
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
                        size={19}
                        className="mt-0.5 shrink-0"
                      />

                      <p>{contactSuccess}</p>
                    </div>
                  )}

                  {/* ERROR */}

                  {contactError && (
                    <div
                      className="
                        mb-5
                        rounded-xl
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
                      {contactError}
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit}>

                    {/* NAME */}

                    <div className="mb-4">

                      <label
                        htmlFor="contact-name"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Name
                      </label>

                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(event) =>
                          setContactName(event.target.value)
                        }
                        placeholder="Your name"
                        disabled={sendingContact}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* EMAIL */}

                    <div className="mb-4">

                      <label
                        htmlFor="contact-email"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Email
                      </label>

                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(event) =>
                          setContactEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        disabled={sendingContact}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* SUBJECT */}

                    <div className="mb-4">

                      <label
                        htmlFor="contact-subject"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Subject
                      </label>

                      <input
                        id="contact-subject"
                        type="text"
                        value={contactSubject}
                        onChange={(event) =>
                          setContactSubject(event.target.value)
                        }
                        placeholder="Project inquiry"
                        disabled={sendingContact}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* MESSAGE */}

                    <div className="mb-5">

                      <label
                        htmlFor="contact-message"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Message
                      </label>

                      <textarea
                        id="contact-message"
                        value={contactMessage}
                        onChange={(event) =>
                          setContactMessage(event.target.value)
                        }
                        placeholder="Write your message..."
                        rows={4}
                        disabled={sendingContact}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* BUTTON */}

                    <button
                      type="submit"
                      disabled={sendingContact}
                      className="
                        inline-flex
                        w-full
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
                        disabled:opacity-60
                      "
                    >

                      {sendingContact ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}

                    </button>

                  </form>

                </div>

              </div>

            </div>

          </div>

          {/* ===================================
              FEEDBACK CARD
          ==================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              shadow-sm
              transition-all
              duration-300
              hover:shadow-md
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            {/* =================================
                FEEDBACK HEADER
            ================================== */}

            <button
              type="button"
              onClick={() =>
                setFeedbackOpen(!feedbackOpen)
              }
              className="
                flex
                w-full
                items-center
                justify-between
                p-5
                text-left
                transition
                hover:bg-gray-100
                dark:hover:bg-gray-800
                lg:cursor-default
              "
            >

              <div className="flex items-center gap-4">

                {/* ICON */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-yellow-100
                    text-yellow-600
                    dark:bg-yellow-950
                    dark:text-yellow-400
                  "
                >
                  <Star
                    size={21}
                    fill="currentColor"
                  />
                </div>

                {/* TITLE */}

                <div>

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-gray-950
                      dark:text-white
                      sm:text-xl
                    "
                  >
                    Share Your Feedback
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                      sm:text-sm
                    "
                  >
                    Tell me what you think
                  </p>

                </div>

              </div>

              {/* ARROW */}

              <ChevronDown
                size={21}
                className={`
                  shrink-0
                  text-gray-500
                  transition-transform
                  duration-300
                  dark:text-gray-400
                  lg:hidden
                  ${feedbackOpen ? "rotate-180" : ""}
                `}
              />

            </button>

            {/* =================================
                FEEDBACK FORM
            ================================== */}

            <div
              className={`
                grid
                transition-all
                duration-300
                ease-in-out
                lg:grid-rows-[1fr]
                lg:opacity-100
                ${
                  feedbackOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 lg:opacity-100"
                }
              `}
            >

              <div className="overflow-hidden">

                <div className="border-t border-gray-200 p-5 dark:border-gray-800 sm:p-7">

                  {/* SUCCESS */}

                  {feedbackSuccess && (
                    <div
                      className="
                        mb-5
                        flex
                        items-start
                        gap-3
                        rounded-xl
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
                        size={19}
                        className="mt-0.5 shrink-0"
                      />

                      <p>{feedbackSuccess}</p>
                    </div>
                  )}

                  {/* ERROR */}

                  {feedbackError && (
                    <div
                      className="
                        mb-5
                        rounded-xl
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
                      {feedbackError}
                    </div>
                  )}

                  <form onSubmit={handleFeedbackSubmit}>

                    {/* NAME */}

                    <div className="mb-4">

                      <label
                        htmlFor="feedback-name"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Name
                      </label>

                      <input
                        id="feedback-name"
                        type="text"
                        value={feedbackName}
                        onChange={(event) =>
                          setFeedbackName(event.target.value)
                        }
                        placeholder="Your name"
                        disabled={sendingFeedback}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* EMAIL */}

                    <div className="mb-4">

                      <label
                        htmlFor="feedback-email"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Email
                        <span
                          className="
                            ml-1
                            font-normal
                            text-gray-400
                          "
                        >
                          (optional)
                        </span>
                      </label>

                      <input
                        id="feedback-email"
                        type="email"
                        value={feedbackEmail}
                        onChange={(event) =>
                          setFeedbackEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        disabled={sendingFeedback}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* RATING */}

                    <div className="mb-4">

                      <label
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Rating
                      </label>

                      <div className="flex items-center gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              disabled={sendingFeedback}
                              onClick={() =>
                                setRating(star)
                              }
                              aria-label={`${star} star`}
                              className="
                                transition
                                hover:scale-110
                                disabled:opacity-60
                              "
                            >
                              <Star
                                size={25}
                                fill={
                                  star <= rating
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  star <= rating
                                    ? "text-yellow-500"
                                    : "text-gray-300 dark:text-gray-700"
                                }
                              />
                            </button>
                          )
                        )}

                        <span
                          className="
                            ml-2
                            text-sm
                            font-semibold
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {rating}/5
                        </span>

                      </div>

                    </div>

                    {/* MESSAGE */}

                    <div className="mb-5">

                      <label
                        htmlFor="feedback-message"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Feedback
                      </label>

                      <textarea
                        id="feedback-message"
                        value={feedbackMessage}
                        onChange={(event) =>
                          setFeedbackMessage(event.target.value)
                        }
                        placeholder="Write your feedback..."
                        rows={4}
                        disabled={sendingFeedback}
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
                          disabled:opacity-60
                          dark:border-gray-700
                          dark:bg-gray-950
                          dark:text-white
                        "
                      />

                    </div>

                    {/* BUTTON */}

                    <button
                      type="submit"
                      disabled={sendingFeedback}
                      className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gray-900
                        px-6
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        transition
                        hover:bg-gray-800
                        disabled:opacity-60
                        dark:bg-white
                        dark:text-gray-900
                        dark:hover:bg-gray-200
                      "
                    >

                      {sendingFeedback ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Feedback
                        </>
                      )}

                    </button>

                    <p
                      className="
                        mt-3
                        text-center
                        text-xs
                        text-gray-500
                        dark:text-gray-500
                      "
                    >
                      Your feedback will be reviewed before
                      it appears publicly.
                    </p>

                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}