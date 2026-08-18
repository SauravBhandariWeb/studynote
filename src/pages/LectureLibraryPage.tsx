import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Search,
  Trash2,
  Play,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import {
  Button,
  Input,
  Select,
  ProgressBar,
  Badge,
} from '@/components/ui/Form';

import {
  Modal,
  ConfirmModal,
} from '@/components/ui/Modal';

import {
  CardSkeleton,
  EmptyState,
  ErrorState,
} from '@/components/ui/LoadingStates';

import {
  lectureApi,
  subjectApi,
  extractYouTubeId,
  getYouTubeThumbnail,
} from '@/lib/api';

import { useToast } from '@/context/ToastContext';

import type {
  Lecture,
  Subject,
} from '@/types';

export default function LectureLibraryPage() {
  const { toast } = useToast();

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<Lecture | null>(null);

  // Add form state
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [adding, setAdding] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError('');

    Promise.all([
      lectureApi.list().catch((e) => {
        setError(e.message);
        return [];
      }),

      subjectApi.list().catch(() => []),
    ]).then(([l, s]) => {
      setLectures(l as Lecture[]);
      setSubjects(s as Subject[]);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = lectures.filter((l) => {
    if (
      filterSubject &&
      l.subjectId !== filterSubject
    ) {
      return false;
    }

    if (
      search &&
      !l.title
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      !l.channelName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleAdd = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const youtubeId = extractYouTubeId(url);

    if (!youtubeId) {
      toast(
        'Please enter a valid YouTube URL',
        'error'
      );
      return;
    }

    setAdding(true);

    try {
      await lectureApi.create({
        title:
          title ||
          `Lecture ${youtubeId}`,

        youtubeId,

        channelName:
          channelName ||
          'Unknown channel',

        subjectId:
          subjectId || null,

        thumbnailUrl:
          getYouTubeThumbnail(youtubeId),
      });

      toast('Lecture added successfully');

      setShowAdd(false);

      setUrl('');
      setTitle('');
      setChannelName('');
      setSubjectId('');

      loadData();
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : 'Failed to add lecture',
        'error'
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (
    lecture: Lecture
  ) => {
    try {
      await lectureApi.remove(
        lecture._id
      );

      toast('Lecture deleted');

      setDeleteTarget(null);

      loadData();
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : 'Failed to delete',
        'error'
      );
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        px-4 py-6
        transition-colors duration-300
        dark:bg-[#070b14]
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================== */}

        <PageHeader
          title="Lecture Library"
          subtitle={`${lectures.length} lectures in your library`}
          action={
            <Button
              onClick={() =>
                setShowAdd(true)
              }
            >
              <Plus className="h-4 w-4" />

              <span className="hidden sm:inline">
                Add lecture
              </span>

              <span className="sm:hidden">
                Add
              </span>
            </Button>
          }
        />

        {/* =========================
            FILTERS
        ========================== */}

        <div
          className="
            mb-6
            flex flex-col gap-3
            sm:flex-row
          "
        >

          {/* Search */}

          <div className="relative flex-1">

            <Search
              className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
                dark:text-slate-500
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search lectures..."
              className="
                input-field
                pl-10

                bg-white
                text-slate-900
                border-slate-200

                placeholder:text-slate-400

                dark:border-white/[0.08]
                dark:bg-white/[0.04]
                dark:text-white
                dark:placeholder:text-slate-500

                focus:border-blue-500
                dark:focus:border-blue-500
              "
            />

          </div>

          {/* Subject filter */}

          <select
            value={filterSubject}
            onChange={(e) =>
              setFilterSubject(
                e.target.value
              )
            }
            className="
              input-field
              sm:w-56

              bg-white
              text-slate-900
              border-slate-200

              dark:border-white/[0.08]
              dark:bg-[#111827]
              dark:text-white

              focus:border-blue-500
              dark:focus:border-blue-500
            "
          >
            <option value="">
              All subjects
            </option>

            {subjects.map((s) => (
              <option
                key={s._id}
                value={s._id}
              >
                {s.name}
              </option>
            ))}
          </select>

        </div>

        {/* =========================
            CONTENT
        ========================== */}

        {loading ? (

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {Array.from({
              length: 6,
            }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

        ) : error ? (

          <ErrorState
            message={error}
            onRetry={loadData}
          />

        ) : filtered.length === 0 ? (


          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200/70
              bg-white/70
              shadow-sm
              backdrop-blur-xl

              dark:border-white/[0.07]
              dark:bg-white/[0.035]
              dark:shadow-none
            "
          >
            <EmptyState
              icon={BookOpen}

              title={
                lectures.length === 0
                  ? 'No lectures yet'
                  : 'No lectures found'
              }

              description={
                lectures.length === 0
                  ? 'Add your first YouTube lecture to start taking timestamped notes.'
                  : 'Try adjusting your search or filter.'
              }

              action={
                lectures.length === 0 ? (
                  <Button
                    onClick={() =>
                      setShowAdd(true)
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add lecture
                  </Button>
                ) : undefined
              }
            />
          </div>

        ) : (

          /* =========================
             LECTURE CARDS
          ========================== */

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {filtered.map(
              (lecture) => (

                <div
                  key={lecture._id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl

                    border
                    border-slate-200/70

                    bg-white/70

                    shadow-[0_8px_30px_rgba(15,23,42,0.04)]

                    backdrop-blur-xl

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]

                    dark:border-white/[0.07]
                    dark:bg-white/[0.035]
                    dark:shadow-none

                    dark:hover:border-blue-500/20
                    dark:hover:bg-white/[0.055]
                  "
                >

                  {/* =========================
                     THUMBNAIL
                  ========================== */}

                  <Link
                    to={`/lectures/${lecture._id}`}
                    className="
                      relative
                      block
                      aspect-video
                      overflow-hidden
                      bg-slate-200
                      dark:bg-slate-900
                    "
                  >

                    <img
                      src={lecture.thumbnailUrl}
                      alt={lecture.title}
                      className="
                        h-full
                        w-full
                        object-cover

                        transition-transform
                        duration-500

                        group-hover:scale-[1.03]
                      "
                    />

                    {/* Hover overlay */}

                    <div
                      className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center

                        bg-slate-900/20
                        opacity-0

                        transition-opacity
                        duration-300

                        group-hover:opacity-100

                        dark:bg-black/40
                      "
                    >

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center

                          rounded-full

                          bg-white/90

                          shadow-xl

                          dark:bg-slate-900/90
                        "
                      >

                        <Play
                          className="
                            ml-0.5
                            h-5
                            w-5
                            text-blue-700
                            dark:text-blue-400
                          "
                          fill="currentColor"
                        />

                      </div>

                    </div>

                    {/* Completed */}

                    {lecture.completed && (
                      <div
                        className="
                          absolute
                          right-2
                          top-2
                        "
                      >
                        <Badge color="emerald">
                          Completed
                        </Badge>
                      </div>
                    )}

                  </Link>

                  {/* =========================
                     CARD CONTENT
                  ========================== */}

                  <div className="p-4">

                    <Link
                      to={`/lectures/${lecture._id}`}
                    >
                      <h3
                        className="
                          mb-1
                          line-clamp-2
                          font-semibold

                          text-slate-900

                          transition-colors

                          hover:text-blue-700

                          dark:text-white
                          dark:hover:text-blue-400
                        "
                      >
                        {lecture.title}
                      </h3>
                    </Link>

                    <p
                      className="
                        mb-3
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {lecture.channelName}
                    </p>

                    {/* Progress */}

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <ProgressBar
                        value={lecture.progress}
                        className="flex-1"
                      />

                      <span
                        className="
                          w-10
                          text-right
                          text-xs
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        {lecture.progress}%
                      </span>

                    </div>

                    {/* Bottom row */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      {lecture.subjectId ? (

                        <Badge color="blue">
                          {subjects.find(
                            (s) =>
                              s._id ===
                              lecture.subjectId
                          )?.name ||
                            'Subject'}
                        </Badge>

                      ) : (

                        <Badge color="slate">
                          Unassigned
                        </Badge>

                      )}

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            lecture
                          )
                        }
                        className="
                          rounded-lg
                          p-1.5

                          text-slate-400

                          transition-colors

                          hover:bg-red-50
                          hover:text-red-600

                          dark:text-slate-500
                          dark:hover:bg-red-950/40
                          dark:hover:text-red-400
                        "
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        

        <Modal
          open={showAdd}
          onClose={() =>
            setShowAdd(false)
          }
          title="Add YouTube lecture"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() =>
                  setShowAdd(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleAdd}
                loading={adding}
              >
                Add lecture
              </Button>
            </>
          }
        >

          <form
            onSubmit={handleAdd}
            className="space-y-4"
          >

            <Input
              label="YouTube URL or ID"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              required
            />

            <Input
              label="Lecture title"
              placeholder="Intro to Calculus - Limits"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <Input
              label="Channel name"
              placeholder="MIT OpenCourseWare"
              value={channelName}
              onChange={(e) =>
                setChannelName(e.target.value)
              }
            />

            <Select
              label="Subject (optional)"
              value={subjectId}
              onChange={(e) =>
                setSubjectId(e.target.value)
              }
            >

              <option value="">
                No subject
              </option>

              {subjects.map((s) => (
                <option
                  key={s._id}
                  value={s._id}
                >
                  {s.name}
                </option>
              ))}

            </Select>

          </form>

        </Modal>

        {/* =========================
            DELETE CONFIRMATION
        ========================== */}

        <ConfirmModal
          open={!!deleteTarget}

          onClose={() =>
            setDeleteTarget(null)
          }

          onConfirm={() =>
            deleteTarget &&
            handleDelete(deleteTarget)
          }

          title="Delete lecture?"

          message="This will permanently delete the lecture and all its notes. This cannot be undone."

          confirmLabel="Delete"

          danger
        />

      </div>
    </div>
  );
}