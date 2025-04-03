import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import axios from 'axios';

const LoginForm = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email('Invalid Email'),
        password: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await axios.post(
          'http://localhost:7001/api/v1/login',
          {
            username: value.email,
            password: value.password,
          },
        );
        console.log(response.data);

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
        <form.Field
          name="password"
          children={(field) => (
            <div className="flex flex-col">
              <label htmlFor={field.name} className="text-sm">
                Password:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
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
        <a
          href="http://localhost:7001/api/v1/auth/google"
          className="w-full cursor-pointer rounded-xl bg-slate-800 px-6 py-1 text-center text-white no-underline shadow-md"
        >
          Login with Google
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
