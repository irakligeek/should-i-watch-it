import tmdbLogo from '../../tmdb-logo.svg';

export default function Footer() {
  return (
    <footer className="mt-6 mb-6 text-gray-600 text-sm">
      <p className="flex flex-row items-center">
        <span>Movies API powered by TMDb</span>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={tmdbLogo}
            alt="The Movie Database"
            className="ml-2 h-12 w-12"
          />
        </a>
      </p>
    </footer>
  );
}
