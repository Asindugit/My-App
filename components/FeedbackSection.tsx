"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  MessageSquare,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { db } from "@/lib/firebase";

interface Feedback {
  id: string;
  name: string;
  message: string;
  rating?: number;
  createdAt?: Timestamp | null;
}

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    async function loadApprovedFeedback() {
      try {
        setLoading(true);

        const feedbackQuery = query(
          collection(db, "feedback"),
          where("approved", "==", true)
        );

        const snapshot = await getDocs(feedbackQuery);

        const approvedFeedback: Feedback[] =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Feedback[];

        // Newest first
        approvedFeedback.sort((a, b) => {
          const dateA =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toMillis()
              : 0;

          const dateB =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toMillis()
              : 0;

          return dateB - dateA;
        });

        setFeedback(approvedFeedback);
      } catch (error) {
        console.error(
          "Error loading approved feedback:",
          error
        );

        setFeedback([]);
      } finally {
        setLoading(false);
      }
    }

    loadApprovedFeedback();
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  function previousFeedback() {
    if (feedback.length === 0) return;

    setActiveIndex((current) =>
      current === 0
        ? feedback.length - 1
        : current - 1
    );
  }

  function nextFeedback() {
    if (feedback.length === 0) return;

    setActiveIndex((current) =>
      current === feedback.length - 1
        ? 0
        : current + 1
    );
  }

  // ==========================================
  // GET CARD POSITION
  // ==========================================

  function getPosition(index: number) {
    const total = feedback.length;

    let difference = index - activeIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section
        id="feedback"
        className="
          bg-white
          px-5
          py-16
          dark:bg-gray-950
        "
      >
        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-blue-600
                dark:text-blue-400
              "
            >
              Testimonials
            </p>

            <h2
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
              What People Say
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              Feedback from visitors and clients.
            </p>

          </div>

          <div className="mt-14 flex justify-center">
            <div
              className="
                h-8
                w-8
                animate-spin
                rounded-full
                border-4
                border-gray-200
                border-t-blue-600
                dark:border-gray-700
                dark:border-t-blue-400
              "
            />
          </div>

        </div>
      </section>
    );
  }

  // ==========================================
  // NO FEEDBACK
  // ==========================================

  if (feedback.length === 0) {
    return (
      <section
        id="feedback"
        className="
          bg-white
          px-5
          py-16
          dark:bg-gray-950
        "
      >
        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-blue-600
                dark:text-blue-400
              "
            >
              Testimonials
            </p>

            <h2
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
              What People Say
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              Feedback from visitors and clients.
            </p>

          </div>

          <div
            className="
              mx-auto
              mt-14
              max-w-md
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              p-8
              text-center
              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <MessageSquare
              size={36}
              className="
                mx-auto
                text-gray-400
                dark:text-gray-600
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Approved feedback will appear here.
            </p>
          </div>

        </div>
      </section>
    );
  }

  return (
    <>
      {/* ==========================================
          FEEDBACK SECTION
      =========================================== */}

      <section
        id="feedback"
        className="
          overflow-hidden
          bg-white
          px-5
          py-16
          dark:bg-gray-950
          sm:py-20
        "
      >
        <div className="mx-auto max-w-6xl">

          {/* ======================================
              HEADER
          ======================================= */}

          <div className="text-center">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-blue-600
                dark:text-blue-400
              "
            >
              Testimonials
            </p>

            <h2
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
              What People Say
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
              "
            >
              Feedback from visitors and clients.
            </p>

          </div>

          {/* ======================================
              FEEDBACK CARDS
          ======================================= */}

          <div
            className="
              relative
              mx-auto
              mt-16
              h-[310px]
              max-w-5xl
              sm:h-[320px]
            "
          >

            {feedback.map((item, index) => {
              const position = getPosition(index);

              const isActive = position === 0;

              /*
               * Only show nearby cards.
               * This keeps the UI clean when there are
               * many feedback messages.
               */

              if (Math.abs(position) > 2) {
                return null;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveIndex(index);

                    if (isActive) {
                      setPopupOpen(true);
                    }
                  }}
                  className={`
                    absolute
                    left-1/2
                    top-0
                    w-[280px]
                    -translate-x-1/2
                    cursor-pointer
                    rounded-3xl
                    border
                    bg-white
                    p-6
                    shadow-xl
                    transition-all
                    duration-500
                    ease-out
                    dark:bg-gray-900

                    sm:w-[360px]
                    sm:p-7

                    ${
                      isActive
                        ? `
                          z-30
                          scale-100
                          border-blue-200
                          opacity-100
                          blur-0
                          shadow-2xl
                          dark:border-blue-900
                        `
                        : position === -1 || position === 1
                        ? `
                          z-20
                          scale-[0.82]
                          opacity-45
                          blur-[2px]
                        `
                        : `
                          z-10
                          scale-[0.70]
                          opacity-20
                          blur-[4px]
                        `
                    }

                    ${
                      position < 0
                        ? "-translate-x-[125%] sm:-translate-x-[130%]"
                        : position > 0
                        ? "translate-x-[25%] sm:translate-x-[30%]"
                        : ""
                    }
                  `}
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between">

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
                      <MessageSquare size={19} />
                    </div>

                    {/* Rating */}

                    {item.rating !== undefined && (
                      <div className="flex gap-0.5">

                        {Array.from(
                          { length: 5 },
                          (_, starIndex) => (
                            <Star
                              key={starIndex}
                              size={15}
                              className={
                                starIndex < item.rating!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-700"
                              }
                            />
                          )
                        )}

                      </div>
                    )}

                  </div>

                  {/* MESSAGE */}

                  <p
                    className="
                      mt-6
                      line-clamp-4
                      text-sm
                      leading-7
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    "{item.message}"
                  </p>

                  {/* USER */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-3
                      border-t
                      border-gray-100
                      pt-4
                      dark:border-gray-800
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      {item.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-gray-950
                          dark:text-white
                        "
                      >
                        {item.name}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Visitor
                      </p>

                    </div>

                  </div>

                  {/* ACTIVE LABEL */}

                  {isActive && (
                    <p
                      className="
                        mt-4
                        text-center
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      Click to read
                    </p>
                  )}

                </div>
              );
            })}

          </div>

          {/* ======================================
              ARROWS
          ======================================= */}

          {feedback.length > 1 && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-4
              "
            >

              <button
                type="button"
                onClick={previousFeedback}
                aria-label="Previous feedback"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-500
                  hover:bg-blue-600
                  hover:text-white
                  hover:shadow-lg
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-300
                  dark:hover:border-blue-500
                  dark:hover:bg-blue-600
                "
              >
                <ChevronLeft size={20} />
              </button>

              {/* INDICATORS */}

              <div className="flex items-center gap-1.5">

                {feedback.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View feedback ${index + 1}`}
                    className={`
                      h-2
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        index === activeIndex
                          ? "w-6 bg-blue-600"
                          : "w-2 bg-gray-300 dark:bg-gray-700"
                      }
                    `}
                  />
                ))}

              </div>

              <button
                type="button"
                onClick={nextFeedback}
                aria-label="Next feedback"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-500
                  hover:bg-blue-600
                  hover:text-white
                  hover:shadow-lg
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-300
                  dark:hover:border-blue-500
                  dark:hover:bg-blue-600
                "
              >
                <ChevronRight size={20} />
              </button>

            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          POPUP
      =========================================== */}

      {popupOpen && feedback[activeIndex] && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            px-5
            backdrop-blur-sm
          "
          onClick={() => setPopupOpen(false)}
        >

          <div
            onClick={(event) => event.stopPropagation()}
            className="
              relative
              w-full
              max-w-lg
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-7
              shadow-2xl
              dark:border-gray-800
              dark:bg-gray-900
              sm:p-9
            "
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setPopupOpen(false)}
              aria-label="Close feedback"
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-gray-600
                transition
                hover:bg-gray-200
                hover:text-gray-900
                dark:bg-gray-800
                dark:text-gray-400
                dark:hover:bg-gray-700
                dark:hover:text-white
              "
            >
              <X size={18} />
            </button>

            {/* ICON */}

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-white
                shadow-lg
                shadow-blue-600/20
              "
            >
              <MessageSquare size={22} />
            </div>

            {/* RATING */}

            {feedback[activeIndex].rating !== undefined && (
              <div className="mt-6 flex gap-1">

                {Array.from(
                  { length: 5 },
                  (_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={
                        index <
                        feedback[activeIndex].rating!
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-700"
                      }
                    />
                  )
                )}

              </div>
            )}

            {/* MESSAGE */}

            <p
              className="
                mt-6
                text-base
                leading-8
                text-gray-700
                dark:text-gray-300
              "
            >
              "{feedback[activeIndex].message}"
            </p>

            {/* USER */}

            <div
              className="
                mt-8
                flex
                items-center
                gap-3
                border-t
                border-gray-100
                pt-6
                dark:border-gray-800
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  font-bold
                  text-white
                "
              >
                {feedback[activeIndex].name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <p
                  className="
                    font-bold
                    text-gray-950
                    dark:text-white
                  "
                >
                  {feedback[activeIndex].name}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Visitor
                </p>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}