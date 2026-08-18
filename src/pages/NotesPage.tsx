import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  StickyNote,
  Star,
  Search,
  BookOpen,
  Trash2,
  Pencil,
  X,
  Check,
  FolderOpen,
  Layers3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Badge, Textarea } from '@/components/ui/Form';
import {
  EmptyState,
  ListSkeleton,
} from '@/components/ui/LoadingStates';

import {
  noteApi,
  lectureApi,
  subjectApi,
} from '@/lib/api';

import type {
  Note,
  Lecture,
  Subject,
} from '@/types';

type SubjectWithColor = Subject & {
  color?: string;
};

type ColorTheme = {
  text: string;
  icon: string;
  iconBg: string;
  border: string;
  top: string;
  soft: string;
  dot: string;
};

const colorThemes: Record<string, ColorTheme> = {
  blue: {
    text: 'text-blue-400',
    icon: 'text-blue-300',
    iconBg:
      'bg-blue-500/10 border-blue-500/20',
    border:
      'border-blue-500/20',
    top: 'bg-blue-400',
    soft:
      'bg-blue-500/[0.05]',
    dot: 'bg-blue-400',
  },

  emerald: {
    text: 'text-emerald-400',
    icon: 'text-emerald-300',
    iconBg:
      'bg-emerald-500/10 border-emerald-500/20',
    border:
      'border-emerald-500/20',
    top: 'bg-emerald-400',
    soft:
      'bg-emerald-500/[0.05]',
    dot: 'bg-emerald-400',
  },

  amber: {
    text: 'text-amber-400',
    icon: 'text-amber-300',
    iconBg:
      'bg-amber-500/10 border-amber-500/20',
    border:
      'border-amber-500/20',
    top: 'bg-amber-400',
    soft:
      'bg-amber-500/[0.05]',
    dot: 'bg-amber-400',
  },

  red: {
    text: 'text-red-400',
    icon: 'text-red-300',
    iconBg:
      'bg-red-500/10 border-red-500/20',
    border:
      'border-red-500/20',
    top: 'bg-red-400',
    soft:
      'bg-red-500/[0.05]',
    dot: 'bg-red-400',
  },

  purple: {
    text: 'text-purple-400',
    icon: 'text-purple-300',
    iconBg:
      'bg-purple-500/10 border-purple-500/20',
    border:
      'border-purple-500/20',
    top: 'bg-purple-400',
    soft:
      'bg-purple-500/[0.05]',
    dot: 'bg-purple-400',
  },

  slate: {
    text: 'text-slate-400',
    icon: 'text-slate-300',
    iconBg:
      'bg-slate-500/10 border-slate-500/20',
    border:
      'border-slate-500/20',
    top: 'bg-slate-400',
    soft:
      'bg-slate-500/[0.05]',
    dot: 'bg-slate-400',
  },
};

function getTheme(
  color: unknown,
): ColorTheme {
  const normalizedColor =
    typeof color === 'string'
      ? color.trim().toLowerCase()
      : '';

  return (
    colorThemes[normalizedColor] ||
    colorThemes.slate
  );
}

export default function NotesPage() {
  const [notes, setNotes] =
    useState<Note[]>([]);

  const [lectures, setLectures] =
    useState<Map<string, Lecture>>(
      new Map(),
    );

  const [subjects, setSubjects] =
    useState<SubjectWithColor[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [importantOnly, setImportantOnly] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingContent, setEditingContent] =
    useState('');

  const [savingEditId, setSavingEditId] =
    useState<string | null>(null);

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    const loadNotes = async () => {
      setLoading(true);
      setError('');

      try {
        const [
          notesData,
          lecturesData,
          subjectsData,
        ] = await Promise.all([
          noteApi.listAll(),
          lectureApi.list(),
          subjectApi.list(),
        ]);

        if (!mounted) {
          return;
        }

        setNotes(notesData);

        setLectures(
          new Map(
            lecturesData.map(
              (lecture) => [
                lecture._id,
                lecture,
              ],
            ),
          ),
        );

        setSubjects(
          subjectsData as SubjectWithColor[],
        );
      } catch (e) {
        if (!mounted) {
          return;
        }

        setError(
          e instanceof Error
            ? e.message
            : 'Failed to load notes',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      mounted = false;
    };
  }, []);

  const subjectsMap = useMemo(
    () =>
      new Map(
        subjects.map((subject) => [
          subject._id,
          subject,
        ]),
      ),
    [subjects],
  );

  const filtered = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return notes.filter((note) => {
      if (
        importantOnly &&
        !note.isImportant
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const lecture =
        lectures.get(note.lectureId);

      const subject =
        lecture?.subjectId
          ? subjectsMap.get(
              lecture.subjectId,
            )
          : undefined;

      const searchableText = [
        note.content,
        lecture?.title,
        lecture?.channelName,
        subject?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [
    notes,
    lectures,
    subjectsMap,
    search,
    importantOnly,
  ]);

  const groupedNotes = useMemo(() => {
    const groups = new Map<
      string,
      {
        subject: SubjectWithColor | null;
        notes: Note[];
      }
    >();

    const showingAllSubjects =
      !search.trim() &&
      !importantOnly;

    /*
     * Normal view:
     * Show every subject folder, even when
     * that subject has zero notes.
     */
    if (showingAllSubjects) {
      subjects.forEach((subject) => {
        groups.set(subject._id, {
          subject,
          notes: [],
        });
      });
    }

    /*
     * Add matching notes into their subject folders.
     */
    filtered.forEach((note) => {
      const lecture =
        lectures.get(note.lectureId);

      const subjectId =
        lecture?.subjectId ||
        'without-subject';

      if (!groups.has(subjectId)) {
        groups.set(subjectId, {
          subject:
            subjectId ===
            'without-subject'
              ? null
              : subjectsMap.get(
                  subjectId,
                ) || null,
          notes: [],
        });
      }

      groups
        .get(subjectId)!
        .notes.push(note);
    });

    /*
     * Keep subjects in the same order as the
     * Subjects page. Notes without a subject
     * stay at the end.
     */
    return Array.from(
      groups.entries(),
    ).sort((a, b) => {
      const aSubjectIndex =
        a[1].subject
          ? subjects.findIndex(
              (subject) =>
                subject._id ===
                a[1].subject?._id,
            )
          : Number.MAX_SAFE_INTEGER;

      const bSubjectIndex =
        b[1].subject
          ? subjects.findIndex(
              (subject) =>
                subject._id ===
                b[1].subject?._id,
            )
          : Number.MAX_SAFE_INTEGER;

      if (
        aSubjectIndex !==
        bSubjectIndex
      ) {
        return (
          aSubjectIndex -
          bSubjectIndex
        );
      }

      return (
        b[1].notes.length -
        a[1].notes.length
      );
    });
  }, [
    filtered,
    lectures,
    subjects,
    subjectsMap,
    search,
    importantOnly,
  ]);

  const importantCount =
    notes.filter(
      (note) => note.isImportant,
    ).length;

  const toggleGroup = (
    groupId: string,
  ) => {
    setOpenGroups((current) => ({
      ...current,
      [groupId]:
        current[groupId] === undefined
          ? false
          : !current[groupId],
    }));
  };

  const isGroupOpen = (
    groupId: string,
  ) => {
    return (
      openGroups[groupId] !== false
    );
  };

  const handleDelete = async (
    noteId: string,
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this note?',
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(noteId);
    setError('');

    try {
      await noteApi.remove(noteId);

      setNotes((current) =>
        current.filter(
          (note) =>
            note._id !== noteId,
        ),
      );

      if (editingId === noteId) {
        setEditingId(null);
        setEditingContent('');
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to delete note',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (
    note: Note,
  ) => {
    setEditingId(note._id);

    setEditingContent(
      note.content,
    );

    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async (
    noteId: string,
  ) => {
    const trimmedContent =
      editingContent.trim();

    if (!trimmedContent) {
      setError(
        'Note content cannot be empty',
      );

      return;
    }

    setSavingEditId(noteId);
    setError('');

    try {
      const updatedNote =
        await noteApi.update(
          noteId,
          {
            content:
              trimmedContent,
          },
        );

      setNotes((current) =>
        current.map((note) =>
          note._id === noteId
            ? updatedNote
            : note,
        ),
      );

      setEditingId(null);
      setEditingContent('');
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to update note',
      );
    } finally {
      setSavingEditId(null);
    }
  };

  const hasFilteredResults =
    filtered.length > 0;

  const hasSearchOrFilter =
    Boolean(search.trim()) ||
    importantOnly;

  const showEmptyState =
    !loading &&
    !hasFilteredResults &&
    hasSearchOrFilter;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* HEADER */}

        <PageHeader
          title="My Notes"
          subtitle={`${notes.length} notes across your lectures`}
        />


        {/* SEARCH + FILTER */}

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <Search
              className="
                absolute
                left-3.5
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              placeholder="Search notes, lectures or subjects..."
              className="
                input-field
                h-11
                pl-10
                dark:border-slate-700
                dark:bg-[#0c1321]
                dark:text-slate-100
                dark:placeholder:text-slate-500
              "
            />
          </div>


          <button
            type="button"
            onClick={() =>
              setImportantOnly(
                (prev) => !prev,
              )
            }
            className={`
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              px-5
              text-sm
              font-medium
              transition-all

              ${
                importantOnly
                  ? `
                    border-amber-500/30
                    bg-amber-500/10
                    text-amber-300
                  `
                  : `
                    border-slate-700
                    bg-[#0c1321]
                    text-slate-300
                    hover:border-slate-600
                    hover:bg-slate-800
                  `
              }
            `}
          >
            <Star
              className="h-4 w-4"
              fill={
                importantOnly
                  ? 'currentColor'
                  : 'none'
              }
            />

            Important only
          </button>

        </div>


        {/* STATS */}

        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-3">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-[#0c1321]
              p-4
            "
          >
            <div className="mb-3 flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <StickyNote className="h-4 w-4" />
              </div>

              <span className="text-xs text-slate-500">
                TOTAL
              </span>

            </div>

            <p className="text-2xl font-bold text-white">
              {notes.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Saved notes
            </p>
          </div>


          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-[#0c1321]
              p-4
            "
          >
            <div className="mb-3 flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Layers3 className="h-4 w-4" />
              </div>

              <span className="text-xs text-slate-500">
                FOLDERS
              </span>

            </div>

            <p className="text-2xl font-bold text-white">
              {subjects.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Study subjects
            </p>
          </div>


          <div
            className="
              col-span-2
              rounded-2xl
              border
              border-slate-800
              bg-[#0c1321]
              p-4
              sm:col-span-1
            "
          >
            <div className="mb-3 flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Star className="h-4 w-4" />
              </div>

              <span className="text-xs text-slate-500">
                SAVED
              </span>

            </div>

            <p className="text-2xl font-bold text-white">
              {importantCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Important notes
            </p>
          </div>

        </div>


        {/* ERROR */}

        {error && !loading && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-900/50
              bg-red-950/20
              px-4
              py-3
              text-sm
              text-red-300
            "
          >
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading ? (
          <ListSkeleton count={6} />
        ) : showEmptyState ? (

          <div className="rounded-2xl border border-slate-800 bg-[#0c1321]">

            <EmptyState
              icon={StickyNote}
              title="No notes found"
              description="Try a different search or filter."
            />

          </div>

        ) : (

          <div className="space-y-5">

            {groupedNotes.map(
              (
                [groupId, group],
              ) => {

                const theme =
                  getTheme(
                    group.subject?.color,
                  );

                const isOpen =
                  isGroupOpen(
                    groupId,
                  );

                const isEmpty =
                  group.notes.length ===
                  0;

                return (
                  <div
                    key={groupId}
                    className={`
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      bg-[#0c1321]
                      shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                      ${theme.border}
                    `}
                  >

                    {/* TOP COLOR */}

                    <div
                      className={`
                        absolute
                        left-0
                        right-0
                        top-0
                        h-1
                        ${theme.top}
                      `}
                    />


                    {/* FOLDER HEADER */}

                    <div
                      className={`
                        flex
                        items-center
                        gap-3
                        border-b
                        border-slate-800
                        p-4
                        sm:p-5
                        ${theme.soft}
                      `}
                    >

                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          ${theme.iconBg}
                          ${theme.icon}
                        `}
                      >
                        <FolderOpen className="h-5 w-5" />
                      </div>


                      <div className="min-w-0 flex-1">

                        <div className="mb-1 flex items-center gap-2">

                          <span
                            className={`
                              h-2
                              w-2
                              rounded-full
                              ${theme.dot}
                            `}
                          />

                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Subject
                          </span>

                        </div>


                        <h2 className="truncate text-lg font-bold text-white">
                          {group.subject?.name ||
                            'Other notes'}
                        </h2>


                        <p className="mt-0.5 text-xs text-slate-500">
                          {group.notes.length}{' '}
                          {group.notes.length ===
                          1
                            ? 'note'
                            : 'notes'}
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          toggleGroup(
                            groupId,
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900/70
                          text-slate-400
                          transition-all
                          hover:border-slate-600
                          hover:bg-slate-800
                          hover:text-white
                        "
                        aria-label={
                          isOpen
                            ? 'Collapse folder'
                            : 'Expand folder'
                        }
                      >
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                    </div>


                    {/* EMPTY SUBJECT */}

                    {isOpen &&
                    isEmpty ? (
                      <div
                        className="
                          px-5
                          py-8
                          text-center
                        "
                      >

                        <div
                          className={`
                            mx-auto
                            mb-3
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            ${theme.soft}
                            ${theme.text}
                          `}
                        >
                          <StickyNote className="h-4 w-4" />
                        </div>

                        <p className="text-sm font-medium text-slate-300">
                          No notes in this subject yet
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Add notes to a lecture in this folder and they will appear here.
                        </p>

                      </div>
                    ) : (

                      /* NOTES */

                      isOpen && (
                        <div>
                          {group.notes.map(
                            (note) => {

                              const lecture =
                                lectures.get(
                                  note.lectureId,
                                );

                              const isDeleting =
                                deletingId ===
                                note._id;

                              const isEditing =
                                editingId ===
                                note._id;

                              const isSavingEdit =
                                savingEditId ===
                                note._id;

                              return (
                                <div
                                  key={
                                    note._id
                                  }
                                  className="
                                    border-b
                                    border-slate-800
                                    p-4
                                    last:border-b-0
                                    sm:p-5
                                  "
                                >

                                  <div className="flex gap-3">

                                    {/* NOTE ICON */}

                                    <div
                                      className={`
                                        mt-0.5
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${theme.soft}
                                        ${theme.text}
                                      `}
                                    >
                                      <StickyNote className="h-4 w-4" />
                                    </div>


                                    <div className="min-w-0 flex-1">

                                      {/* TOP INFO */}

                                      <div className="mb-2 flex flex-wrap items-center gap-2">

                                        {lecture && (
                                          <span className="truncate text-xs font-medium text-slate-400">
                                            {lecture.title}
                                          </span>
                                        )}

                                        {note.isImportant && (
                                          <Badge color="amber">
                                            <Star
                                              className="h-3 w-3"
                                              fill="currentColor"
                                            />

                                            Important
                                          </Badge>
                                        )}

                                      </div>


                                      {/* CONTENT */}

                                      {isEditing ? (

                                        <Textarea
                                          value={
                                            editingContent
                                          }
                                          onChange={(
                                            e,
                                          ) =>
                                            setEditingContent(
                                              e
                                                .target
                                                .value,
                                            )
                                          }
                                          rows={4}
                                          autoFocus
                                          className="text-sm"
                                          placeholder="Edit your note..."
                                        />

                                      ) : (

                                        <p
                                          className="
                                            break-words
                                            whitespace-pre-wrap
                                            text-sm
                                            leading-6
                                            text-slate-200
                                          "
                                        >
                                          {
                                            note.content
                                          }
                                        </p>

                                      )}


                                      {/* BOTTOM */}

                                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

                                        <div className="flex items-center gap-3 text-xs text-slate-500">

                                          <span>
                                            {new Date(
                                              note.createdAt,
                                            ).toLocaleDateString()}
                                          </span>


                                          {lecture && (
                                            <>
                                              <span className="h-1 w-1 rounded-full bg-slate-700" />

                                              <span className="truncate">
                                                {
                                                  lecture.channelName
                                                }
                                              </span>
                                            </>
                                          )}

                                        </div>


                                        <div className="flex items-center gap-1.5">

                                          {!isEditing ? (
                                            <>

                                              {/* EDIT */}

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleStartEdit(
                                                    note,
                                                  )
                                                }
                                                disabled={
                                                  isDeleting
                                                }
                                                aria-label="Edit note"
                                                title="Edit note"
                                                className="
                                                  inline-flex
                                                  h-8
                                                  w-8
                                                  items-center
                                                  justify-center
                                                  rounded-lg
                                                  border
                                                  border-slate-700
                                                  bg-slate-900
                                                  text-slate-400
                                                  transition-all
                                                  hover:border-blue-500/30
                                                  hover:bg-blue-500/10
                                                  hover:text-blue-400
                                                  disabled:opacity-50
                                                "
                                              >
                                                <Pencil className="h-4 w-4" />
                                              </button>


                                              {/* DELETE */}

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleDelete(
                                                    note._id,
                                                  )
                                                }
                                                disabled={
                                                  isDeleting
                                                }
                                                aria-label="Delete note"
                                                title="Delete note"
                                                className="
                                                  inline-flex
                                                  h-8
                                                  w-8
                                                  items-center
                                                  justify-center
                                                  rounded-lg
                                                  border
                                                  border-slate-700
                                                  bg-slate-900
                                                  text-slate-400
                                                  transition-all
                                                  hover:border-red-500/30
                                                  hover:bg-red-500/10
                                                  hover:text-red-400
                                                  disabled:opacity-50
                                                "
                                              >
                                                {isDeleting ? (
                                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-red-400" />
                                                ) : (
                                                  <Trash2 className="h-4 w-4" />
                                                )}
                                              </button>

                                            </>

                                          ) : (

                                            <>

                                              {/* SAVE EDIT */}

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleSaveEdit(
                                                    note._id,
                                                  )
                                                }
                                                disabled={
                                                  isSavingEdit
                                                }
                                                aria-label="Save edit"
                                                title="Save edit"
                                                className="
                                                  inline-flex
                                                  h-8
                                                  w-8
                                                  items-center
                                                  justify-center
                                                  rounded-lg
                                                  border
                                                  border-emerald-500/20
                                                  bg-emerald-500/10
                                                  text-emerald-400
                                                  transition-all
                                                  hover:bg-emerald-500/20
                                                  disabled:opacity-50
                                                "
                                              >
                                                {isSavingEdit ? (
                                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-emerald-300" />
                                                ) : (
                                                  <Check className="h-4 w-4" />
                                                )}
                                              </button>


                                              {/* CANCEL */}

                                              <button
                                                type="button"
                                                onClick={
                                                  handleCancelEdit
                                                }
                                                disabled={
                                                  isSavingEdit
                                                }
                                                aria-label="Cancel edit"
                                                title="Cancel edit"
                                                className="
                                                  inline-flex
                                                  h-8
                                                  w-8
                                                  items-center
                                                  justify-center
                                                  rounded-lg
                                                  border
                                                  border-slate-700
                                                  bg-slate-900
                                                  text-slate-400
                                                  transition-all
                                                  hover:bg-slate-800
                                                  hover:text-white
                                                  disabled:opacity-50
                                                "
                                              >
                                                <X className="h-4 w-4" />
                                              </button>

                                            </>
                                          )}

                                        </div>

                                      </div>

                                    </div>

                                  </div>

                                </div>
                              );
                            },
                          )}
                        </div>
                      )
                    )}

                  </div>
                );
              },
            )}

          </div>
        )}

      </div>
    </div>
  );
}