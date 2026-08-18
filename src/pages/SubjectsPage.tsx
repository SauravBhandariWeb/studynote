
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Trash2,
  Pencil,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, Input, Select } from '@/components/ui/Form';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { EmptyState, ErrorState } from '@/components/ui/LoadingStates';
import { subjectApi, lectureApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import type { Subject, Lecture } from '@/types';

const COLOR_OPTIONS = [
  { name: 'Blue', value: 'blue' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Amber', value: 'amber' },
  { name: 'Red', value: 'red' },
  { name: 'Purple', value: 'purple' },
  { name: 'Slate', value: 'slate' },
];

const colorClasses: Record<string, string> = {
  blue: `
    bg-blue-100 text-blue-700
    dark:bg-blue-500/15 dark:text-blue-300
  `,
  emerald: `
    bg-emerald-100 text-emerald-700
    dark:bg-emerald-500/15 dark:text-emerald-300
  `,
  amber: `
    bg-amber-100 text-amber-700
    dark:bg-amber-500/15 dark:text-amber-300
  `,
  red: `
    bg-red-100 text-red-700
    dark:bg-red-500/15 dark:text-red-300
  `,
  purple: `
    bg-purple-100 text-purple-700
    dark:bg-purple-500/15 dark:text-purple-300
  `,
  slate: `
    bg-slate-200 text-slate-700
    dark:bg-slate-700/70 dark:text-slate-300
  `,
};

/*
 * Premium folder accent colors.
 * These are UI-only and do not affect your existing subject logic.
 */
const folderAccentClasses: Record<string, string> = {
  blue: `
    bg-blue-500
    shadow-blue-500/20
  `,
  emerald: `
    bg-emerald-500
    shadow-emerald-500/20
  `,
  amber: `
    bg-amber-500
    shadow-amber-500/20
  `,
  red: `
    bg-red-500
    shadow-red-500/20
  `,
  purple: `
    bg-purple-500
    shadow-purple-500/20
  `,
  slate: `
    bg-slate-500
    shadow-slate-500/20
  `,
};

const folderGlowClasses: Record<string, string> = {
  blue: 'from-blue-500/20 via-blue-500/5 to-transparent',
  emerald: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  amber: 'from-amber-500/20 via-amber-500/5 to-transparent',
  red: 'from-red-500/20 via-red-500/5 to-transparent',
  purple: 'from-purple-500/20 via-purple-500/5 to-transparent',
  slate: 'from-slate-500/20 via-slate-500/5 to-transparent',
};

const colorDotClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-500',
};

export default function SubjectsPage() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);

    Promise.all([
      subjectApi.list().catch((e) => {
        setError(e.message);
        return [];
      }),
      lectureApi.list().catch(() => []),
    ]).then(([s, l]) => {
      setSubjects(s as Subject[]);
      setLectures(l as Lecture[]);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast('Please enter a name', 'error');
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await subjectApi.update(editing._id, { name, color });
        toast('Subject updated');
      } else {
        await subjectApi.create({ name, color, icon: 'folder' });
        toast('Subject created');
      }

      setShowForm(false);
      setEditing(null);
      setName('');
      setColor('blue');
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subject: Subject) => {
    try {
      await subjectApi.remove(subject._id);
      toast('Subject deleted');
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setName(subject.name);
    setColor(subject.color);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setColor('blue');
    setShowForm(true);
  };

  const getLectureCount = (subjectId: string) =>
    lectures.filter((l) => l.subjectId === subjectId).length;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Subjects"
        subtitle={`${subjects.length} subjects`}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New subject
          </Button>
        }
      />

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="
                h-44 animate-pulse rounded-[24px]
                border border-slate-200/70
                bg-white/60
                p-5
                backdrop-blur-xl
                dark:border-white/[0.07]
                dark:bg-white/[0.035]
              "
            />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : subjects.length === 0 ? (
        <div
          className="
            rounded-[24px]
            border border-slate-200/70
            bg-white/60
            shadow-sm
            backdrop-blur-xl
            dark:border-white/[0.07]
            dark:bg-white/[0.035]
            dark:shadow-none
          "
        >
          <EmptyState
            icon={FolderTree}
            title="No subjects yet"
            description="Create subjects to organize your lectures by topic or course."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Create subject
              </Button>
            }
          />
        </div>
      ) : (
        /* Premium Subjects */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const subjectColor =
              colorClasses[subject.color] || colorClasses.blue;

            const accent =
              folderAccentClasses[subject.color] ||
              folderAccentClasses.blue;

            const glow =
              folderGlowClasses[subject.color] ||
              folderGlowClasses.blue;

            const dot =
              colorDotClasses[subject.color] ||
              colorDotClasses.blue;

            return (
              <div
                key={subject._id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-slate-200/70
                  bg-white/70
                  p-5
                  shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-slate-300
                  hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]
                  dark:border-white/[0.07]
                  dark:bg-[#0c1321]/90
                  dark:shadow-none
                  dark:hover:border-white/[0.12]
                  dark:hover:bg-[#101827]
                "
              >
                {/* Decorative gradient */}
                <div
                  className={`
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-28
                    bg-gradient-to-b
                    ${glow}
                    opacity-70
                  `}
                />

                {/* Folder top tab */}
                <div
                  className={`
                    absolute
                    left-5
                    top-0
                    h-1.5
                    w-20
                    rounded-b-full
                    shadow-lg
                    ${accent}
                  `}
                />

                {/* Content */}
                <div className="relative">
                  {/* Top row */}
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/40
                        shadow-lg
                        dark:border-white/[0.06]
                        ${subjectColor}
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      `}
                    >
                      <FolderTree className="h-5 w-5" />
                    </div>

                    {/* Actions */}
                    <div
                      className="
                        flex
                        gap-1
                        opacity-70
                        transition-opacity
                        duration-200
                        group-hover:opacity-100
                      "
                    >
                      <button
                        type="button"
                        onClick={() => openEdit(subject)}
                        aria-label="Edit subject"
                        title="Edit subject"
                        className="
                          rounded-xl
                          border
                          border-transparent
                          p-2
                          text-slate-400
                          transition-colors
                          hover:border-slate-200
                          hover:bg-slate-100
                          hover:text-slate-700
                          dark:text-slate-500
                          dark:hover:border-white/[0.08]
                          dark:hover:bg-white/[0.05]
                          dark:hover:text-slate-200
                        "
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(subject)}
                        aria-label="Delete subject"
                        title="Delete subject"
                        className="
                          rounded-xl
                          border
                          border-transparent
                          p-2
                          text-slate-400
                          transition-colors
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-600
                          dark:text-slate-500
                          dark:hover:border-red-500/10
                          dark:hover:bg-red-500/10
                          dark:hover:text-red-400
                        "
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full shadow-sm ${dot}`}
                      />

                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Study Subject
                      </span>
                    </div>

                    <h3
                      className="
                        truncate
                        text-xl
                        font-bold
                        tracking-tight
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {subject.name}
                    </h3>
                  </div>

                  {/* Bottom info */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-200/70
                      pt-4
                      dark:border-white/[0.06]
                    "
                  >
                    <Link
                      to="/lectures"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        px-2
                        py-1.5
                        text-sm
                        font-medium
                        text-slate-500
                        transition-colors
                        hover:bg-slate-100
                        hover:text-blue-700
                        dark:text-slate-400
                        dark:hover:bg-white/[0.05]
                        dark:hover:text-blue-400
                      "
                    >
                      <BookOpen className="h-4 w-4" />

                      <span>
                        {getLectureCount(subject._id)} lectures
                      </span>
                    </Link>

                    <Link
                      to="/lectures"
                      className="
                        inline-flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200/80
                        bg-white/70
                        text-slate-400
                        transition-all
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-600
                        dark:border-white/[0.07]
                        dark:bg-white/[0.03]
                        dark:text-slate-500
                        dark:hover:border-blue-500/20
                        dark:hover:bg-blue-500/10
                        dark:hover:text-blue-400
                      "
                      aria-label="Open lectures"
                      title="Open lectures"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Edit subject' : 'Create subject'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              loading={saving}
            >
              {editing ? 'Save' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Subject name"
            placeholder="e.g. Calculus, Physics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* Premium color picker */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Folder color
              </label>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                Choose a style
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {COLOR_OPTIONS.map((c) => {
                const selected = color === c.value;

                return (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className="
                      group/color
                      flex
                      flex-col
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-3
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-slate-300
                      dark:border-white/[0.07]
                      dark:bg-white/[0.025]
                      dark:hover:border-white/[0.12]
                    "
                  >
                    <span
                      className={`
                        relative
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        ${colorClasses[c.value]}
                        transition-transform
                        duration-200
                        ${
                          selected
                            ? 'scale-110'
                            : 'group-hover/color:scale-105'
                        }
                      `}
                    >
                      <FolderTree className="h-4 w-4" />

                      {selected && (
                        <span
                          className="
                            absolute
                            -right-1
                            -top-1
                            h-3
                            w-3
                            rounded-full
                            border-2
                            border-white
                            bg-current
                            dark:border-slate-900
                          "
                        />
                      )}
                    </span>

                    <span
                      className="
                        text-[11px]
                        font-semibold
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live preview */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              dark:border-white/[0.07]
              dark:bg-white/[0.025]
            "
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Preview
            </p>

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/70
                bg-white
                p-4
                dark:border-white/[0.07]
                dark:bg-[#0c1321]
              "
            >
              <div
                className={`
                  absolute
                  left-4
                  top-0
                  h-1
                  w-16
                  rounded-b-full
                  ${folderAccentClasses[color] || folderAccentClasses.blue}
                `}
              />

              <div className="flex items-center gap-3 pt-1">
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    ${colorClasses[color] || colorClasses.blue}
                  `}
                >
                  <FolderTree className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {name.trim() || 'Your subject'}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    0 lectures
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && handleDelete(deleteTarget)
        }
        title="Delete subject?"
        message="Lectures in this subject will become unassigned but won't be deleted."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

