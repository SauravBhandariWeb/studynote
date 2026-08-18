import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Star,
  BookOpen,
  FileText,
  Trash2,
  Check,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Form';
import {
  EmptyState,
} from '@/components/ui/LoadingStates';

import { noteApi, lectureApi } from '@/lib/api';

import type { Note, Lecture } from '@/types';

export default function RevisionPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [lectures, setLectures] = useState<Map<string, Lecture>>(
    new Map(),
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [notesData, lecturesData] = await Promise.all([
          noteApi.listAll({ important: true }),
          lectureApi.list(),
        ]);

        if (!mounted) return;

        setNotes(notesData);

        setLectures(
          new Map(
            lecturesData.map((lecture) => [
              lecture._id,
              lecture,
            ]),
          ),
        );
      } catch (e) {
        if (!mounted) return;

        setError(
          e instanceof Error
            ? e.message
            : 'Failed to load revision notes',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (noteId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?',
    );

    if (!confirmed) return;

    setDeletingId(noteId);
    setError('');

    try {
      await noteApi.remove(noteId);

      setNotes((current) =>
        current.filter((note) => note._id !== noteId),
      );

      setSelectedNotes((current) => {
        const next = new Set(current);
        next.delete(noteId);
        return next;
      });
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

  const toggleNote = (noteId: string) => {
    setSelectedNotes((current) => {
      const next = new Set(current);

      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }

      return next;
    });
  };

  const selectAll = () => {
    setSelectedNotes(new Set(notes.map((note) => note._id)));
  };

  const clearSelection = () => {
    setSelectedNotes(new Set());
  };

  const escapeHtml = (value: string) => {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const handleExportPDF = () => {
    const selected = notes.filter((note) =>
      selectedNotes.has(note._id),
    );

    if (selected.length === 0) return;

    const grouped = new Map<
      string,
      {
        lecture?: Lecture;
        notes: Note[];
      }
    >();

    selected.forEach((note) => {
      if (!grouped.has(note.lectureId)) {
        grouped.set(note.lectureId, {
          lecture: lectures.get(note.lectureId),
          notes: [],
        });
      }

      grouped.get(note.lectureId)!.notes.push(note);
    });

    const sections = Array.from(grouped.values())
      .map(({ lecture, notes: sectionNotes }) => {
        return `
          <div class="lecture-section">
            <h2>${escapeHtml(
              lecture?.title || 'Unknown lecture',
            )}</h2>

            ${sectionNotes
              .map(
                (note) => `
                  <div class="note-item">
                    <div class="note-content">
                      ${escapeHtml(note.content).replace(
                        /\n/g,
                        '<br />',
                      )}
                    </div>

                    <div class="note-date">
                      ${new Date(
                        note.createdAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                `,
              )
              .join('')}
          </div>
        `;
      })
      .join('');

    const win = window.open('', '_blank');

    if (!win) {
      setError(
        'Please allow pop-ups to export your notes.',
      );
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Revision Notes</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              max-width: 850px;
              margin: 0 auto;
              padding: 40px 24px;
              color: #1e293b;
              background: #ffffff;
            }

            h1 {
              margin: 0;
              font-size: 28px;
              color: #0f172a;
            }

            .meta {
              margin-top: 8px;
              margin-bottom: 32px;
              color: #64748b;
              font-size: 14px;
            }

            .lecture-section {
              margin-bottom: 32px;
              page-break-inside: avoid;
            }

            .lecture-section h2 {
              margin: 0 0 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #2563eb;
              font-size: 19px;
              color: #1d4ed8;
            }

            .note-item {
              margin-bottom: 10px;
              padding: 13px 15px;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              background: #f8fafc;
            }

            .note-content {
              font-size: 14px;
              line-height: 1.7;
              color: #334155;
            }

            .note-date {
              margin-top: 8px;
              color: #94a3b8;
              font-size: 11px;
            }

            @media print {
              body {
                padding: 20px;
              }

              .lecture-section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <h1>My Revision Notes</h1>

          <div class="meta">
            ${selected.length} selected ${
              selected.length === 1 ? 'note' : 'notes'
            }
            • ${new Date().toLocaleDateString()}
          </div>

          ${sections}
        </body>
      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };

  const selectedCount = selectedNotes.size;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070b14] dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">

        <PageHeader
          title="Revision Mode"
          subtitle="Review your most important notes across all lectures"
          action={
            notes.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCount > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleExportPDF}
                  >
                    <FileText className="h-4 w-4" />

                    <span>
                      Export {selectedCount}
                    </span>
                  </Button>
                )}
              </div>
            ) : undefined
          }
        />

        {error && !loading && (
          <div
            className="
              mb-4 rounded-xl
              border border-red-200
              bg-red-50
              px-4 py-3
              text-sm text-red-700
              dark:border-red-900/50
              dark:bg-red-950/20
              dark:text-red-300
            "
          >
            {error}
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div
            className="
              mb-5 flex flex-wrap items-center justify-between
              gap-3 rounded-2xl
              border border-slate-200/70
              bg-white/70
              px-4 py-3
              backdrop-blur-xl
              dark:border-white/[0.07]
              dark:bg-white/[0.035]
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                  dark:bg-blue-500/10
                  dark:text-blue-400
                "
              >
                <FileText className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {selectedCount === 0
                    ? 'Select notes to export'
                    : `${selectedCount} ${
                        selectedCount === 1
                          ? 'note'
                          : 'notes'
                      } selected`}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Only selected notes will be included in the PDF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="
                    rounded-lg px-3 py-2
                    text-xs font-medium
                    text-slate-500
                    transition-colors
                    hover:bg-slate-100
                    hover:text-slate-700
                    dark:text-slate-400
                    dark:hover:bg-white/[0.06]
                    dark:hover:text-white
                  "
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={selectAll}
                className="
                  rounded-lg px-3 py-2
                  text-xs font-medium
                  text-blue-600
                  transition-colors
                  hover:bg-blue-50
                  dark:text-blue-400
                  dark:hover:bg-blue-500/10
                "
              >
                Select all
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="
                  h-20 animate-pulse rounded-2xl
                  border border-slate-200/70
                  bg-white/70
                  dark:border-white/[0.07]
                  dark:bg-white/[0.035]
                "
              />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div
            className="
              overflow-hidden rounded-2xl
              border border-slate-200/70
              bg-white/70
              shadow-[0_8px_30px_rgba(15,23,42,0.04)]
              backdrop-blur-xl
              dark:border-white/[0.07]
              dark:bg-white/[0.035]
              dark:shadow-none
            "
          >
            <EmptyState
              icon={Star}
              title="No important notes yet"
              description="Mark notes as important while watching lectures, and they'll appear here for quick revision."
              action={
                <Link
                  to="/lectures"
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    px-4 py-2.5
                    text-sm font-semibold text-white
                    shadow-lg shadow-blue-500/20
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:shadow-blue-500/30
                  "
                >
                  <BookOpen className="h-4 w-4" />
                  Browse lectures
                </Link>
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(
              notes.reduce(
                (acc, note) => {
                  const key = note.lectureId;

                  if (!acc.has(key)) {
                    acc.set(key, []);
                  }

                  acc.get(key)!.push(note);

                  return acc;
                },
                new Map<string, Note[]>(),
              ).entries(),
            ).map(([lectureId, sectionNotes]) => {
              const lecture = lectures.get(lectureId);

              return (
                <div
                  key={lectureId}
                  className="
                    rounded-2xl
                    border border-slate-200/70
                    bg-white/70
                    p-5
                    shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)]
                    dark:border-white/[0.07]
                    dark:bg-white/[0.035]
                    dark:shadow-none
                    dark:hover:bg-white/[0.045]
                  "
                >
                  <Link
                    to={`/lectures/${lectureId}`}
                    className="
                      group mb-4 flex items-center gap-3
                      rounded-xl p-2 -mx-2
                      transition-colors
                      hover:bg-slate-50
                      dark:hover:bg-white/[0.04]
                    "
                  >
                    <div
                      className="
                        flex h-9 w-9 flex-shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-blue-50
                        dark:bg-blue-500/10
                      "
                    >
                      <BookOpen
                        className="
                          h-4 w-4
                          text-blue-600
                          dark:text-blue-400
                        "
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Lecture
                      </p>

                      <h3
                        className="
                          truncate font-semibold
                          text-slate-900
                          transition-colors
                          group-hover:text-blue-700
                          dark:text-white
                          dark:group-hover:text-blue-400
                        "
                      >
                        {lecture?.title || 'Unknown lecture'}
                      </h3>
                    </div>

                    <RefreshCw
                      className="
                        ml-auto h-4 w-4 flex-shrink-0
                        text-slate-300
                        transition-all
                        group-hover:rotate-180
                        group-hover:text-blue-500
                        dark:text-slate-600
                        dark:group-hover:text-blue-400
                      "
                    />
                  </Link>

                  <div className="space-y-2">
                    {sectionNotes.map((note) => {
                      const isSelected = selectedNotes.has(
                        note._id,
                      );

                      const isDeleting =
                        deletingId === note._id;

                      return (
                        <div
                          key={note._id}
                          className={`
                            group/note flex items-start gap-3
                            rounded-xl
                            border p-3
                            transition-all duration-200

                            ${
                              isSelected
                                ? `
                                  border-blue-300
                                  bg-blue-50/80
                                  dark:border-blue-500/30
                                  dark:bg-blue-500/[0.08]
                                `
                                : `
                                  border-amber-200/70
                                  bg-amber-50/60
                                  hover:border-amber-300
                                  hover:bg-amber-50
                                  dark:border-amber-500/10
                                  dark:bg-amber-500/[0.055]
                                  dark:hover:border-amber-500/20
                                  dark:hover:bg-amber-500/[0.08]
                                `
                            }
                          `}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggleNote(note._id)
                            }
                            aria-label={
                              isSelected
                                ? 'Deselect note'
                                : 'Select note'
                            }
                            className={`
                              mt-0.5 flex h-7 w-7
                              flex-shrink-0
                              items-center justify-center
                              rounded-lg border
                              transition-all

                              ${
                                isSelected
                                  ? `
                                    border-blue-600
                                    bg-blue-600
                                    text-white
                                  `
                                  : `
                                    border-slate-300
                                    bg-white
                                    text-transparent
                                    hover:border-blue-400
                                    dark:border-slate-600
                                    dark:bg-slate-900
                                  `
                              }
                            `}
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          <p
                            className="
                              flex-1 whitespace-pre-wrap
                              break-words text-sm leading-6
                              text-slate-700
                              dark:text-slate-200
                            "
                          >
                            {note.content}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(note._id)
                            }
                            disabled={isDeleting}
                            aria-label="Delete note"
                            title="Delete note"
                            className="
                              inline-flex
                              h-8 w-8
                              flex-shrink-0
                              items-center justify-center
                              rounded-lg
                              border border-slate-200
                              bg-white
                              text-slate-500
                              transition-colors
                              hover:border-red-200
                              hover:bg-red-50
                              hover:text-red-600
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              dark:border-slate-700
                              dark:bg-slate-900
                              dark:text-slate-400
                              dark:hover:border-red-900/50
                              dark:hover:bg-red-950/30
                              dark:hover:text-red-400
                            "
                          >
                            {isDeleting ? (
                              <span
                                className="
                                  h-4 w-4
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-slate-300
                                  border-t-red-500
                                  dark:border-slate-600
                                  dark:border-t-red-400
                                "
                              />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}