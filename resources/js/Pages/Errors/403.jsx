export default function Forbidden({ status }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">403</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        You are not authorized to access this page.
      </p>
    </div>
  );
}
