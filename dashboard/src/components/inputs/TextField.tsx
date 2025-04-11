import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../../contexts/FormContext';

type TextInputProps = { label: string };

function TextField({ label }: TextInputProps) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <label>
        <div>{label}</div>
        <input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </label>
      {errors.map((error: string) => (
        <div key={error} style={{ color: 'red' }}>
          {error}
        </div>
      ))}
    </div>
  );
}

export default TextField;
