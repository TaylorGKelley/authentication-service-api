import { useForm } from '@tanstack/react-form';
import { Link, useRouter, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import useAuthContext from '../../hooks/useAuthContext';
import User from '../../types/User';
import axios from 'axios';

const LoginForm = () => {
  const router = useRouter();
  const auth = useAuthContext();
  const { redirect } = useSearch({ from: '/login/' });

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
          {
            withCredentials: true,
          },
        );

        if (response.status === 200) {
          const { accessToken, user } = response.data as {
            accessToken: string;
            user: User;
          };

          auth.login({
            accessToken: accessToken,
            user,
          });
          router.navigate({ to: redirect || '/' });
        }
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
        <Link
          to="/forgot-password"
          className="text-center text-sm text-gray-700 underline"
        >
          Forgot my password
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
