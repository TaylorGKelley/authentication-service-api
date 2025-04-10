import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import api from '../../lib/api';

const ForgotPasswordResetForm = () => {
  const router = useRouter();
  const { resetToken } = useSearch({
    from: '/forgot-password/reset',
  });

  const form = useForm({
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
    validators: {
      onSubmit: z
        .object({
          newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters long'),
          newPasswordConfirm: z.string(),
        })
        .refine((data) => data.newPassword === data.newPasswordConfirm, {
          message: 'Passwords do not match',
          path: ['newPasswordConfirm'],
        }),
    },
    onSubmit: async ({ value }) => {
      try {
        if (resetToken === undefined) throw new Error('No reset token');

        await api.post('http://localhost:7001/api/v1/reset-password', {
          resetToken,
          ...value,
        });

        router.navigate({ to: '/' });
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex max-w-sm flex-col gap-4"
      >
        <form.Field
          name="newPassword"
          children={(field) => (
            <>
              <label htmlFor={field.name} className="text-sm">
                New Password:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="rounded-xl border-1 border-slate-800 bg-white px-4 py-1 shadow-md"
              />
            </>
          )}
        />
        <form.Field
          name="newPasswordConfirm"
          children={(field) => (
            <>
              <label htmlFor={field.name} className="text-sm">
                Confirm New Password:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="rounded-xl border-1 border-slate-800 bg-white px-4 py-1 shadow-md"
              />
            </>
          )}
        />
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-slate-800 px-6 py-1 text-center text-white shadow-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordResetForm;
