import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="eyebrow mb-5">Page not found</p>
      <h1 className="text-display">This page rests elsewhere</h1>
      <p className="section-lead mx-auto mt-5 max-w-md">
        The page you are looking for could not be found. It may have moved, or the link may
        be incomplete.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-saffron px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-saffron-hover"
      >
        Return home
      </Link>
    </main>
  );
}
