import { useForm } from '@tanstack/react-form';
import { useSearch } from '@tanstack/react-router';
import { z } from 'zod';

const ForgotPasswordResetForm = () => {
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
      if (resetToken === undefined) console.error('No reset token');

      console.log({ resetToken, ...value });
      // Make API request to backend POST /reset-password with body of { resetToken, newPassword, newPasswordConfirm }
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="newPassword"
        children={(field) => (
          <>
            <label htmlFor={field.name}>New Password</label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
            />
          </>
        )}
      />
      <form.Field
        name="newPasswordConfirm"
        children={(field) => (
          <>
            <label htmlFor={field.name}>Confirm New Password</label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
            />
          </>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ForgotPasswordResetForm;
