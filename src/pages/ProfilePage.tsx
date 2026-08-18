import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Save,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { authApi } from '@/lib/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  /* =====================================================
     SYNC USER
  ===================================================== */

  useEffect(() => {
    if (!user) return;

    setName(user.name || '');
  }, [user]);

  if (!user) {
    return null;
  }

  /* =====================================================
     GET USER INITIALS
     
     Saurav Bhadnari -> SB
     Rahul Kumar    -> RK
     Aman           -> A
     ===================================================== */

  const getInitials = (fullName: string) => {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      return 'U';
    }

    const parts = trimmedName
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  /* =====================================================
     SAVE PROFILE
     
     IMPORTANT:
     Sirf name backend ko bhej rahe hain.
     Avatar/image ka koi logic nahi hai.
     ===================================================== */

  const handleSave = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast(
        'Name cannot be empty',
        'error',
      );

      return;
    }

    setSaving(true);

    try {
      const updated =
        await authApi.updateProfile({
          name: trimmedName,
        });

      /*
       * Auth context update
       */
      updateUser(updated);

      /*
       * Form ko server wale name ke saath sync
       */
      setName(updated.name || '');

      toast(
        'Profile updated successfully',
      );
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : 'Failed to update profile',
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        transition-colors duration-300
        dark:bg-[#070b14]
      "
    >
      <div
        className="
          mx-auto
          max-w-3xl
          p-4
          sm:p-6
          lg:p-8
        "
      >
        <PageHeader
          title="Profile"
          subtitle="Manage your account information"
        />

        {/* =================================================
            PROFILE CARD
        ================================================== */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-slate-200/70
            bg-white
            p-6
            shadow-sm
            dark:border-white/[0.07]
            dark:bg-white/[0.035]
            dark:shadow-none
          "
        >
          <div
            className="
              flex
              items-center
              gap-5
            "
          >
            {/* =================================================
                INITIALS AVATAR
            ================================================== */}

            <div
              className="
                flex
                h-20
                w-20
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-2xl
                font-bold
                text-white
                shadow-md
                ring-1
                ring-black/5
                dark:ring-white/[0.08]
              "
            >
              {getInitials(user.name)}
            </div>

            {/* =================================================
                USER INFO
            ================================================== */}

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-lg
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {user.name}
              </h2>

              <p
                className="
                  truncate
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {user.email}
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                  dark:text-slate-500
                "
              >
                Your initials are used as your profile avatar
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            EDIT FORM
        ================================================== */}

        <form
          onSubmit={handleSave}
          className="
            space-y-5
            rounded-2xl
            border
            border-slate-200/70
            bg-white
            p-6
            shadow-sm
            dark:border-white/[0.07]
            dark:bg-white/[0.035]
            dark:shadow-none
          "
        >
          {/* =================================================
              NAME
          ================================================== */}

          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              Full name
            </label>

            <div className="relative">
              <User
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-10
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                  dark:border-white/[0.08]
                  dark:bg-white/[0.035]
                  dark:text-white
                "
                placeholder="Your name"
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================== */}

          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              Email
            </label>

            <div className="relative">
              <Mail
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                value={user.email}
                disabled
                className="
                  w-full
                  cursor-not-allowed
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-10
                  py-2.5
                  text-sm
                  text-slate-500
                  dark:border-white/[0.08]
                  dark:bg-white/[0.02]
                  dark:text-slate-500
                "
              />
            </div>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
                dark:text-slate-500
              "
            >
              Email cannot be changed
            </p>
          </div>

          {/* =================================================
              MEMBER SINCE
          ================================================== */}

          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              Member since
            </label>

            <div className="relative">
              <Calendar
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={new Date(
                  user.createdAt,
                ).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )}
                disabled
                className="
                  w-full
                  cursor-not-allowed
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-10
                  py-2.5
                  text-sm
                  text-slate-500
                  dark:border-white/[0.08]
                  dark:bg-white/[0.02]
                  dark:text-slate-500
                "
              />
            </div>
          </div>

          {/* =================================================
              SAVE
          ================================================== */}

          <Button
            type="submit"
            loading={saving}
          >
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}