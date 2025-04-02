import { useForm } from '@tanstack/react-form';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import axios from 'axios';

const ForgotPasswordForm = () => {
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
        await axios.get('http://localhost:7001/api/v1/send-reset-password', {
          params: {
            email: value.email,
          },
        });

        redirect({ to: '/' });
      } catch (error) {
        console.error(error);
      }
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
        name="email"
        children={(field) => (
          <>
            <label htmlFor={field.name}>Email</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
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

export default ForgotPasswordForm;
