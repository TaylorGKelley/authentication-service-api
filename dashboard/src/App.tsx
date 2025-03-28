const App = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8">
      <p className="text-blue-200">
        This is a test page for now to test google authentication
      </p>
      <a
        className="rounded-2xl border-2 border-purple-900 bg-purple-700 px-8 py-4 text-white no-underline"
        href="http://localhost:7001/api/v1/auth/google"
      >
        Sign in with google
      </a>
    </main>
  );
};

export default App;
