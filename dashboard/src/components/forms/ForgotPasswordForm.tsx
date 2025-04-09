import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import api from '../../lib/api';

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: z.object({
        email: z.string().email('Invalid email'),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        // Make API request to backend GET /send-reset-password with body of { email }
        await api.get('http://localhost:7001/api/v1/send-reset-password', {
          params: {
            email: value.email,
          },
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
          name="email"
          children={(field) => (
            <div className="flex flex-col">
              <label htmlFor={field.name} className="text-sm">
                Email:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="rounded-xl border-1 border-slate-800 bg-white px-4 py-1 shadow-md"
              />
            </div>
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

export default ForgotPasswordForm;
