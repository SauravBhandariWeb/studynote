
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Library, Plus, Trash2, Pencil, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, Input, Textarea } from '@/components/ui/Form';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { EmptyState, ErrorState } from '@/components/ui/LoadingStates';
import { collectionApi, lectureApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import type { Collection, Lecture } from '@/types';

export default function CollectionsPage() {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);

    Promise.all([
      collectionApi.list().catch((e) => {
        setError(e.message);
        return [];
      }),
      lectureApi.list().catch(() => []),
    ]).then(([c, l]) => {
      setCollections(c as Collection[]);
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
        await collectionApi.update(editing._id, {
          name,
          description,
        });

        toast('Collection updated');
      } else {
        await collectionApi.create({
          name,
          description,
        });

        toast('Collection created');
      }

      setShowForm(false);
      setEditing(null);
      setName('');
      setDescription('');

      loadData();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Failed',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (collection: Collection) => {
    try {
      await collectionApi.remove(collection._id);

      toast('Collection deleted');
      loadData();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Failed',
        'error'
      );
    }
  };

  const openEdit = (c: Collection) => {
    setEditing(c);
    setName(c.name);
    setDescription(c.description);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Collections"
        subtitle={`${collections.length} collections`}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New collection
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="
                card
                h-32
                animate-pulse
                p-5
                dark:border-white/[0.07]
                dark:bg-white/[0.035]
              "
            />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={loadData}
        />
      ) : collections.length === 0 ? (
        <div className="card dark:border-white/[0.07] dark:bg-white/[0.035]">
          <EmptyState
            icon={Library}
            title="No collections yet"
            description="Create collections to group lectures by study goal, exam, or topic."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Create collection
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {collections.map((collection) => (
            <div
              key={collection._id}
              className="
                card-hover
                p-5
                dark:border-white/[0.07]
                dark:bg-white/[0.035]
              "
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    dark:bg-white/[0.06]
                  "
                >
                  <Library
                    className="
                      h-5
                      w-5
                      text-slate-600
                      dark:text-slate-300
                    "
                  />
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(collection)}
                    className="
                      rounded-lg
                      p-1.5
                      text-slate-400
                      transition-colors
                      hover:bg-slate-100
                      hover:text-slate-600
                      dark:text-slate-500
                      dark:hover:bg-white/[0.06]
                      dark:hover:text-slate-200
                    "
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget(collection)
                    }
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

              <h3
                className="
                  mb-1
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {collection.name}
              </h3>

              {collection.description && (
                <p
                  className="
                    mb-3
                    line-clamp-2
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {collection.description}
                </p>
              )}

              <p
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                <BookOpen
                  className="
                    h-3.5
                    w-3.5
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                {collection.lectureIds?.length || 0} lectures
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={
          editing
            ? 'Edit collection'
            : 'Create collection'
        }
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
        <form
          onSubmit={handleSave}
          className="space-y-4"
        >
          <Input
            label="Collection name"
            placeholder="e.g. Final Exam Prep"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <Textarea
            label="Description (optional)"
            placeholder="What is this collection for?"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={3}
          />
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget &&
          handleDelete(deleteTarget)
        }
        title="Delete collection?"
        message="The lectures in this collection will not be deleted."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
