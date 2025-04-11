import { PropsWithChildren } from 'react';

function SubmitButton({ children }: PropsWithChildren) {
  return (
    <button
      type="submit"
      className="w-full cursor-pointer rounded-xl bg-slate-800 px-6 py-1 text-center text-white shadow-md"
    >
      {children}
    </button>
  );
}

export default SubmitButton;
