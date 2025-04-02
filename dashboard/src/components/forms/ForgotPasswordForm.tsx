import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

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
      console.log(value);
      // Make API request to backend GET /send-reset-password with body of { email }
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
