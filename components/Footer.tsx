export default function Footer() {
  return (
    <footer className="
      border-t border-gray-200
      px-5 py-8
      dark:border-gray-800
    ">
      <div className="
        mx-auto flex max-w-6xl
        flex-col items-center
        justify-between gap-4
        text-sm text-gray-500
        md:flex-row
      ">
        <p>
          © {new Date().getFullYear()} Asindu Himansha.
          All rights reserved.
        </p>

        <p>
          Built with Next.js
        </p>
      </div>
    </footer>
  );
}