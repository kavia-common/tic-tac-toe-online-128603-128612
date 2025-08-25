import Link from 'next/link';

// PUBLIC_INTERFACE
export default function NotFound() {
  /**
   * This is the Not Found page component for the Next.js App Router.
   * It is displayed for 404 scenarios within the app directory.
   *
   * Navigation back to the home page uses Next.js <Link /> to comply
   * with the '@next/next/no-html-link-for-pages' ESLint rule.
   *
   * Returns:
   *  - JSX.Element rendering 404 message with a link to root path (/)
   */
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mb-6 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Go back home
      </Link>
    </main>
  );
}
