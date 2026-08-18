import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react"

import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

import {
  ArrowLeft,
  Trash2,
  Star,
  Save,
  BookOpen,
  Sparkles,
  StickyNote,
  PenLine,
} from "lucide-react"

import {
  Button,
  Textarea,
  Badge,
  ProgressBar,
} from "@/components/ui/Form"

import { ConfirmModal } from "@/components/ui/Modal"

import {
  ErrorState,
  FullPageSpinner,
} from "@/components/ui/LoadingStates"

import {
  lectureApi,
  noteApi,
  subjectApi,
} from "@/lib/api"

import { useToast } from "@/context/ToastContext"

import type {
  Lecture,
  Note,
  Subject,
} from "@/types"



function formatTime(seconds: number): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(Number(seconds) || 0),
  )

  const h = Math.floor(
    safeSeconds / 3600,
  )

  const m = Math.floor(
    (safeSeconds % 3600) / 60,
  )

  const s = safeSeconds % 60

  if (h > 0) {
    return `${h}:${m
      .toString()
      .padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`
  }

  return `${m}:${s
    .toString()
    .padStart(2, "0")}`
}


/* =========================================================
   YOUTUBE API TYPES
========================================================= */

type YouTubePlayer = {
  getCurrentTime: () => number

  seekTo: (
    seconds: number,
    allowSeekAhead: boolean,
  ) => void

  destroy: () => void
}

type YouTubePlayerStateEvent = {
  data: number
  target: YouTubePlayer
}

type YouTubeReadyEvent = {
  target: YouTubePlayer
}

type YouTubePlayerOptions = {
  events?: {
    onReady?: (
      event: YouTubeReadyEvent,
    ) => void

    onStateChange?: (
      event: YouTubePlayerStateEvent,
    ) => void
  }
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element:
          | HTMLIFrameElement
          | HTMLElement
          | string,
        options: YouTubePlayerOptions,
      ) => YouTubePlayer
    }
  }
}


function waitForYouTubeApi(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let elapsed = 0

    const timer = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(timer)

        resolve()

        return
      }

      elapsed += 100

      if (elapsed >= 15000) {
        window.clearInterval(timer)

        reject(
          new Error(
            "YouTube IFrame API is not available",
          ),
        )
      }
    }, 100)
  })
}


/* =========================================================
   PAGE
========================================================= */

export default function LecturePlayerPage() {
  const { id } = useParams<{
    id: string
  }>()

  const navigate = useNavigate()

  const [searchParams] =
    useSearchParams()

  const { toast } = useToast()


  /* =======================================================
     URL TIMESTAMP
  ======================================================= */

  const requestedTimestamp = Math.max(
    0,
    Math.floor(
      Number(
        searchParams.get("t"),
      ) || 0,
    ),
  )


  /* =======================================================
     DATA
  ======================================================= */

  const [lecture, setLecture] =
    useState<Lecture | null>(null)

  const [notes, setNotes] =
    useState<Note[]>([])

  const [subjects, setSubjects] =
    useState<Subject[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  /* =======================================================
     CURRENT TIMESTAMP
  ======================================================= */

  const [currentTimestamp, setCurrentTimestamp] =
    useState(requestedTimestamp)

  const currentTimestampRef =
    useRef<number>(
      requestedTimestamp,
    )


  /* =======================================================
     NOTE FORM
  ======================================================= */

  const [noteContent, setNoteContent] =
    useState("")

  const [isImportant, setIsImportant] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [filterImportant, setFilterImportant] =
    useState(false)

  const [deleteNoteTarget, setDeleteNoteTarget] =
    useState<Note | null>(null)


  /* =======================================================
     YOUTUBE
  ======================================================= */

  const playerIframeRef =
    useRef<HTMLIFrameElement>(null)

  const playerRef =
    useRef<YouTubePlayer | null>(null)

  const pollingRef =
    useRef<number | null>(null)

  const playerReadyRef =
    useRef(false)


  /* =======================================================
     UPDATE TIMESTAMP
  ======================================================= */

  const updateCurrentTimestamp =
    useCallback((seconds: number) => {
      const safeSeconds =
        Math.max(
          0,
          Number(seconds) || 0,
        )

      currentTimestampRef.current =
        safeSeconds

      setCurrentTimestamp(
        safeSeconds,
      )
    }, [])


  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData =
    useCallback(async () => {
      if (!id) {
        setError(
          "Lecture ID is missing",
        )

        setLoading(false)

        return
      }

      setLoading(true)
      setError("")

      try {
        /* -----------------------------------------------
           LOAD LECTURE
        ------------------------------------------------ */

        const lectureData =
          await lectureApi.getById(id)

        setLecture(lectureData)

        currentTimestampRef.current =
          requestedTimestamp

        setCurrentTimestamp(
          requestedTimestamp,
        )


        /* -----------------------------------------------
           LOAD SUBJECTS
        ------------------------------------------------ */

        try {
          const subjectsData =
            await subjectApi.list()

          setSubjects(
            subjectsData,
          )
        } catch {
          setSubjects([])
        }


        /* -----------------------------------------------
           LOAD NOTES
        ------------------------------------------------ */

        try {
          const notesData =
            await noteApi.listByLecture(
              id,
            )

          setNotes(
            [...notesData].sort(
              (a, b) =>
                a.timestamp -
                b.timestamp,
            ),
          )
        } catch {
          /*
           * Agar lecture-specific notes API
           * fail kare to saare notes lao.
           *
           * Phir current lecture ke notes
           * frontend par filter kar do.
           */

          try {
            const allNotes =
              await noteApi.listAll()

            const lectureNotes =
              allNotes.filter(
                (note) =>
                  String(
                    note.lectureId,
                  ) === String(id),
              )

            setNotes(
              [...lectureNotes].sort(
                (a, b) =>
                  a.timestamp -
                  b.timestamp,
              ),
            )
          } catch {
            setNotes([])
          }
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load lecture",
        )
      } finally {
        setLoading(false)
      }
    }, [
      id,
      requestedTimestamp,
    ])


  useEffect(() => {
    loadData()
  }, [loadData])


  /* =======================================================
     STOP POLLING
  ======================================================= */

  const stopPolling =
    useCallback(() => {
      if (
        pollingRef.current !== null
      ) {
        window.clearInterval(
          pollingRef.current,
        )

        pollingRef.current =
          null
      }
    }, [])


  /* =======================================================
     READ ACTUAL YOUTUBE TIME
  ======================================================= */

  const readActualYouTubeTime =
    useCallback(() => {
      const player =
        playerRef.current

      if (
        !player ||
        !playerReadyRef.current
      ) {
        return null
      }

      try {
        const actualTime =
          Number(
            player.getCurrentTime(),
          )

        if (
          !Number.isFinite(
            actualTime,
          ) ||
          actualTime < 0
        ) {
          return null
        }

        updateCurrentTimestamp(
          actualTime,
        )

        return actualTime
      } catch {
        return null
      }
    }, [
      updateCurrentTimestamp,
    ])


  /* =======================================================
     START POLLING
  ======================================================= */

  const startPolling =
    useCallback(() => {
      stopPolling()

      readActualYouTubeTime()

      pollingRef.current =
        window.setInterval(() => {
          readActualYouTubeTime()
        }, 250)
    }, [
      stopPolling,
      readActualYouTubeTime,
    ])


  /* =======================================================
     YOUTUBE PLAYER INITIALIZATION
  ======================================================= */

  useEffect(() => {
    if (
      !lecture ||
      !playerIframeRef.current
    ) {
      return
    }

    let cancelled = false

    const initializePlayer =
      async () => {
        try {
          await waitForYouTubeApi()

          if (
            cancelled ||
            !playerIframeRef.current ||
            !window.YT?.Player
          ) {
            return
          }

          if (playerRef.current) {
            return
          }

          new window.YT.Player(
            playerIframeRef.current,
            {
              events: {
                onReady: (
                  event,
                ) => {
                  if (cancelled) {
                    return
                  }

                  const player =
                    event.target

                  playerRef.current =
                    player

                  playerReadyRef.current =
                    true

                  try {
                    if (
                      requestedTimestamp >
                      0
                    ) {
                      player.seekTo(
                        requestedTimestamp,
                        true,
                      )

                      updateCurrentTimestamp(
                        requestedTimestamp,
                      )
                    } else {
                      const time =
                        Number(
                          player.getCurrentTime(),
                        )

                      if (
                        Number.isFinite(
                          time,
                        ) &&
                        time >= 0
                      ) {
                        updateCurrentTimestamp(
                          time,
                        )
                      }
                    }
                  } catch {
                    // YouTube ready hone ke baad temporary error ignore.
                  }

                  startPolling()
                },

                onStateChange: (
                  event,
                ) => {
                  if (cancelled) {
                    return
                  }

                  const player =
                    event.target

                  playerRef.current =
                    player

                  playerReadyRef.current =
                    true

                  try {
                    const time =
                      Number(
                        player.getCurrentTime(),
                      )

                    if (
                      Number.isFinite(
                        time,
                      ) &&
                      time >= 0
                    ) {
                      updateCurrentTimestamp(
                        time,
                      )
                    }
                  } catch {
                    // Temporary YouTube error ignore.
                  }

                  if (
                    event.data === 1
                  ) {
                    startPolling()

                    return
                  }

                  if (
                    event.data === 2
                  ) {
                    readActualYouTubeTime()

                    return
                  }

                  if (
                    event.data === 0
                  ) {
                    readActualYouTubeTime()

                    stopPolling()
                  }
                },
              },
            },
          )
        } catch (error) {
          console.error(
            "YouTube player initialization failed:",
            error,
          )

          playerRef.current =
            null

          playerReadyRef.current =
            false
        }
      }

    initializePlayer()

    return () => {
      cancelled = true

      stopPolling()

      playerReadyRef.current =
        false

      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch {
          // Cleanup error ignore.
        }
      }

      playerRef.current = null
    }
  }, [
    lecture,
    requestedTimestamp,
    readActualYouTubeTime,
    startPolling,
    stopPolling,
    updateCurrentTimestamp,
  ])


  /* =======================================================
     APPLY URL TIMESTAMP
  ======================================================= */

  useEffect(() => {
    if (
      requestedTimestamp <= 0
    ) {
      return
    }

    const player =
      playerRef.current

    if (
      !player ||
      !playerReadyRef.current
    ) {
      return
    }

    try {
      player.seekTo(
        requestedTimestamp,
        true,
      )

      updateCurrentTimestamp(
        requestedTimestamp,
      )
    } catch {
      // Temporary YouTube error ignore.
    }
  }, [
    id,
    requestedTimestamp,
    updateCurrentTimestamp,
  ])


  /* =======================================================
     ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    currentTimestampRef.current =
      requestedTimestamp

    setCurrentTimestamp(
      requestedTimestamp,
    )
  }, [
    id,
    requestedTimestamp,
  ])


  /* =======================================================
     SAVE NOTE
  ======================================================= */

  const handleSaveNote =
    async () => {
      if (!lecture) {
        return
      }

      if (!noteContent.trim()) {
        toast(
          "Please write a note before saving",
          "error",
        )

        return
      }

      let timestamp =
        currentTimestampRef.current

      const player =
        playerRef.current

      if (
        player &&
        playerReadyRef.current
      ) {
        try {
          const liveTime =
            Number(
              player.getCurrentTime(),
            )

          if (
            Number.isFinite(
              liveTime,
            ) &&
            liveTime >= 0
          ) {
            timestamp =
              liveTime
          }
        } catch {
          // Last known timestamp use hoga.
        }
      }

      timestamp = Math.max(
        0,
        Math.floor(
          Number(timestamp) || 0,
        ),
      )

      const timestampLabel =
        formatTime(timestamp)

      currentTimestampRef.current =
        timestamp

      setCurrentTimestamp(
        timestamp,
      )

      setSaving(true)

      try {
        const newNote =
          await noteApi.create({
            lectureId:
              lecture._id,

            timestamp,

            timestampLabel,

            content:
              noteContent.trim(),

            isImportant,
          })


        /* -----------------------------------------------
           NOTE KO TURANT UI ME ADD KARO
        ------------------------------------------------ */

        setNotes((prev) =>
          [...prev, newNote].sort(
            (a, b) =>
              a.timestamp -
              b.timestamp,
          ),
        )

        setNoteContent("")

        setIsImportant(false)

        toast(
          `Note saved at ${timestampLabel}`,
        )



        await loadData()
      } catch (error) {
        toast(
          error instanceof Error
            ? error.message
            : "Failed to save note",
          "error",
        )
      } finally {
        setSaving(false)
      }
    }


  /* =======================================================
     DELETE NOTE
  ======================================================= */

  const handleDeleteNote =
    async (
      note: Note,
    ) => {
      try {
        await noteApi.remove(
          note._id,
        )

        setNotes((prev) =>
          prev.filter(
            (n) =>
              n._id !== note._id,
          ),
        )

        setDeleteNoteTarget(
          null,
        )

        toast("Note deleted")
      } catch (error) {
        toast(
          error instanceof Error
            ? error.message
            : "Failed to delete",
          "error",
        )
      }
    }


  /* =======================================================
     IMPORTANT TOGGLE
  ======================================================= */

  const handleToggleImportant =
    async (
      note: Note,
    ) => {
      try {
        const updated =
          await noteApi.update(
            note._id,
            {
              isImportant:
                !note.isImportant,
            },
          )

        setNotes((prev) =>
          prev.map((n) =>
            n._id === note._id
              ? updated
              : n,
          ),
        )
      } catch (error) {
        toast(
          error instanceof Error
            ? error.message
            : "Failed to update",
          "error",
        )
      }
    }


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredNotes =
    filterImportant
      ? notes.filter(
          (note) =>
            note.isImportant,
        )
      : notes

  const importantCount =
    notes.filter(
      (note) =>
        note.isImportant,
    ).length


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <FullPageSpinner
        message="Loading lecture..."
      />
    )
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="bg-slate-50 p-6 dark:bg-[#070b14]">
        <ErrorState
          message={error}
          onRetry={loadData}
        />
      </div>
    )
  }


  /* =======================================================
     NO LECTURE
  ======================================================= */

  if (!lecture) {
    return (
      <div className="bg-slate-50 p-6 dark:bg-[#070b14]">
        <ErrorState
          message="Lecture not found"
          onRetry={loadData}
        />
      </div>
    )
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 p-4 transition-colors duration-300 dark:bg-[#070b14] sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* BACK */}

        <Link
          to="/lectures"
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5
            text-sm
            font-medium
            text-slate-500
            transition-colors
            hover:text-slate-700
            dark:text-slate-400
            dark:hover:text-white
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to library
        </Link>


        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">


          {/* =================================================
             VIDEO
          ================================================== */}

          <div className="lg:col-span-3">

            <div
              className="
                relative
                aspect-video
                w-full
                overflow-hidden
                rounded-2xl
                bg-black
                shadow-lg
              "
            >
              <iframe
                ref={playerIframeRef}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                "
                src={`https://www.youtube.com/embed/${lecture.youtubeId}?enablejsapi=1&origin=${encodeURIComponent(
                  window.location.origin,
                )}&rel=0&modestbranding=1&playsinline=1`}
                title={lecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>


            <div className="mt-4">

              <h1
                className="
                  mb-1
                  text-xl
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {lecture.title}
              </h1>


              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {lecture.channelName}
                </span>


                {lecture.completed && (
                  <Badge color="emerald">
                    Completed
                  </Badge>
                )}

              </div>


              <div className="flex items-center gap-2">

                <ProgressBar
                  value={
                    lecture.progress
                  }
                  className="flex-1"
                />

                <span
                  className="
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  {lecture.progress}%
                </span>

              </div>

            </div>

          </div>


          {/* 
             NOTES
          */}

          <div
            className="
              flex
              min-w-0
              flex-col
              lg:col-span-2
            "
          >


            {/*
               NOTE COMPOSER
             */}

            <div
              className="
                relative
                mb-4
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/70
                bg-white/80
                p-4
                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                backdrop-blur-xl
                dark:border-white/[0.07]
                dark:bg-white/[0.035]
                dark:shadow-none
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-24
                  w-24
                  rounded-full
                  bg-blue-500/10
                  blur-2xl
                "
              />


              <div
                className="
                  relative
                  mb-3
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    dark:bg-blue-500/10
                    dark:text-blue-400
                  "
                >
                  <PenLine className="h-4 w-4" />
                </div>


                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Capture your thoughts
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Add a quick note while learning
                  </p>

                </div>

              </div>


              <Textarea
                value={noteContent}
                onChange={(e) =>
                  setNoteContent(
                    e.target.value,
                  )
                }
                placeholder="What did you learn?"
                rows={4}
                className="text-sm"
              />


              <div
                className="
                  mt-3
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setIsImportant(
                      (prev) =>
                        !prev,
                    )
                  }
                  className={`
                    inline-flex
                    w-fit
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-sm
                    font-medium
                    transition-all

                    ${
                      isImportant
                        ? `
                          border-amber-200
                          bg-amber-50
                          text-amber-700
                          dark:border-amber-500/20
                          dark:bg-amber-500/10
                          dark:text-amber-400
                        `
                        : `
                          border-transparent
                          text-slate-500
                          hover:bg-slate-100
                          dark:text-slate-400
                          dark:hover:bg-white/[0.06]
                        `
                    }
                  `}
                >

                  <Star
                    className="h-4 w-4"
                    fill={
                      isImportant
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {isImportant
                    ? "Marked important"
                    : "Mark important"}

                </button>


                <Button
                  onClick={
                    handleSaveNote
                  }
                  loading={saving}
                  size="sm"
                >
                  <Save className="h-3.5 w-3.5" />

                  Save note
                </Button>

              </div>

            </div>


            {/* =================================================
               NOTES PANEL
            ================================================== */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/70
                bg-white/70
                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                backdrop-blur-xl
                dark:border-white/[0.07]
                dark:bg-white/[0.035]
                dark:shadow-none
              "
            >


              {/* NOTES HEADER */}

              <div
                className="
                  border-b
                  border-slate-200/70
                  px-4
                  py-4
                  dark:border-white/[0.07]
                  sm:px-5
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                        dark:bg-indigo-500/10
                        dark:text-indigo-400
                      "
                    >
                      <StickyNote className="h-5 w-5" />
                    </div>


                    <div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <h3
                          className="
                            font-semibold
                            text-slate-900
                            dark:text-white
                          "
                        >
                          Your notes
                        </h3>


                        {/* REAL NOTE COUNT */}

                        <span
                          className="
                            rounded-full
                            bg-slate-100
                            px-2
                            py-0.5
                            text-[11px]
                            font-semibold
                            text-slate-500
                            dark:bg-white/[0.07]
                            dark:text-slate-400
                          "
                        >
                          {notes.length}
                        </span>

                      </div>


                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {importantCount > 0
                          ? `${importantCount} important ${
                              importantCount === 1
                                ? "note"
                                : "notes"
                            } saved`
                          : notes.length > 0
                            ? `${notes.length} ${
                                notes.length === 1
                                  ? "note"
                                  : "notes"
                              } saved`
                            : "Keep your key ideas in one place"}
                      </p>

                    </div>

                  </div>


                  {/* IMPORTANT FILTER */}

                  <button
                    type="button"
                    onClick={() =>
                      setFilterImportant(
                        (prev) =>
                          !prev,
                      )
                    }
                    className={`
                      inline-flex
                      w-fit
                      items-center
                      gap-1.5
                      rounded-lg
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      transition-all

                      ${
                        filterImportant
                          ? `
                            bg-amber-50
                            text-amber-700
                            dark:bg-amber-500/10
                            dark:text-amber-400
                          `
                          : `
                            text-slate-500
                            hover:bg-slate-100
                            dark:text-slate-400
                            dark:hover:bg-white/[0.06]
                          `
                      }
                    `}
                  >

                    <Star
                      className="h-3.5 w-3.5"
                      fill={
                        filterImportant
                          ? "currentColor"
                          : "none"
                      }
                    />

                    {filterImportant
                      ? "Showing important"
                      : "Important only"}

                  </button>

                </div>

              </div>


              {/* NOTES LIST */}

              <div
                className="
                  max-h-[520px]
                  space-y-2
                  overflow-y-auto
                  p-3
                  sm:p-4
                "
              >

                {filteredNotes.length === 0 ? (

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-dashed
                      border-slate-200
                      bg-slate-50/70
                      px-4
                      py-8
                      dark:border-white/[0.08]
                      dark:bg-white/[0.02]
                    "
                  >

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-24
                        w-40
                        -translate-x-1/2
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                      "
                    />


                    <div
                      className="
                        relative
                        text-center
                      "
                    >

                      <div
                        className="
                          mx-auto
                          mb-3
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-white
                          text-blue-600
                          shadow-sm
                          ring-1
                          ring-slate-200/70
                          dark:bg-white/[0.05]
                          dark:text-blue-400
                          dark:ring-white/[0.08]
                        "
                      >

                        {filterImportant ? (
                          <Star className="h-5 w-5" />
                        ) : (
                          <Sparkles className="h-5 w-5" />
                        )}

                      </div>


                      <h4
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {filterImportant
                          ? "No important notes"
                          : "Your notes will appear here"}
                      </h4>


                      <p
                        className="
                          mx-auto
                          mt-1
                          max-w-xs
                          text-xs
                          leading-5
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {filterImportant
                          ? "Mark a note as important and it will show up in this filtered view."
                          : "Write down key ideas, formulas, or anything you want to remember."}
                      </p>


                      {!filterImportant && (
                        <div
                          className="
                            mt-4
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-[11px]
                            font-medium
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          <PenLine className="h-3.5 w-3.5" />

                          Start writing above
                        </div>
                      )}

                    </div>

                  </div>

                ) : (

                  filteredNotes.map(
                    (note, index) => (

                      <div
                        key={note._id}
                        className={`
                          group
                          relative
                          rounded-xl
                          border
                          p-3
                          transition-all
                          duration-200

                          ${
                            note.isImportant
                              ? `
                                border-amber-200/80
                                bg-amber-50/50
                                hover:border-amber-300
                                hover:bg-amber-50
                                dark:border-amber-500/15
                                dark:bg-amber-500/[0.045]
                                dark:hover:border-amber-500/25
                                dark:hover:bg-amber-500/[0.07]
                              `
                              : `
                                border-slate-200/70
                                bg-white/60
                                hover:border-slate-300
                                hover:bg-white
                                dark:border-white/[0.07]
                                dark:bg-white/[0.02]
                                dark:hover:border-white/[0.12]
                                dark:hover:bg-white/[0.04]
                              `
                          }
                        `}
                      >


                        {/* NOTE TOP */}

                        <div
                          className="
                            mb-2
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-2
                            "
                          >

                            <span
                              className="
                                flex
                                h-6
                                w-6
                                flex-shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-slate-100
                                text-[10px]
                                font-bold
                                text-slate-500
                                dark:bg-white/[0.06]
                                dark:text-slate-400
                              "
                            >
                              {index + 1}
                            </span>


                            {note.isImportant && (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  rounded-full
                                  bg-amber-100
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-semibold
                                  text-amber-700
                                  dark:bg-amber-500/10
                                  dark:text-amber-400
                                "
                              >

                                <Star
                                  className="h-3 w-3"
                                  fill="currentColor"
                                />

                                Important

                              </span>
                            )}

                          </div>


                          <div
                            className="
                              flex
                              flex-shrink-0
                              items-center
                              gap-1
                            "
                          >

                            {/* IMPORTANT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleImportant(
                                  note,
                                )
                              }
                              aria-label={
                                note.isImportant
                                  ? "Remove important"
                                  : "Mark important"
                              }
                              className={`
                                rounded-lg
                                p-1.5
                                transition-colors

                                ${
                                  note.isImportant
                                    ? `
                                      text-amber-600
                                      hover:bg-amber-100
                                      dark:text-amber-400
                                      dark:hover:bg-amber-500/10
                                    `
                                    : `
                                      text-slate-400
                                      hover:bg-slate-100
                                      dark:text-slate-500
                                      dark:hover:bg-white/[0.06]
                                    `
                                }
                              `}
                            >

                              <Star
                                className="h-4 w-4"
                                fill={
                                  note.isImportant
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteNoteTarget(
                                  note,
                                )
                              }
                              aria-label="Delete note"
                              className="
                                rounded-lg
                                p-1.5
                                text-slate-400
                                transition-colors
                                hover:bg-red-50
                                hover:text-red-600
                                dark:text-slate-500
                                dark:hover:bg-red-500/10
                                dark:hover:text-red-400
                              "
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>

                        </div>


                        {/* NOTE CONTENT */}

                        <p
                          className="
                            break-words
                            whitespace-pre-wrap
                            text-sm
                            leading-6
                            text-slate-700
                            dark:text-slate-200
                          "
                        >
                          {note.content}
                        </p>


                        {/* TIMESTAMP */}

                        <div
                          className="
                            mt-3
                            flex
                            items-center
                            gap-1.5
                            text-[10px]
                            font-medium
                            text-slate-400
                            dark:text-slate-500
                          "
                        >

                          <BookOpen className="h-3 w-3" />

                          {note.timestampLabel ||
                            formatTime(
                              note.timestamp,
                            )}

                        </div>

                      </div>

                    ),
                  )

                )}

              </div>

            </div>

          </div>

        </div>



        <ConfirmModal
          open={
            !!deleteNoteTarget
          }
          onClose={() =>
            setDeleteNoteTarget(
              null,
            )
          }
          onConfirm={() =>
            deleteNoteTarget &&
            handleDeleteNote(
              deleteNoteTarget,
            )
          }
          title="Delete note?"
          message="This note will be permanently deleted."
          confirmLabel="Delete"
          danger
        />

      </div>

    </div>
  )
}