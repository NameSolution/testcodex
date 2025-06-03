import PropTypes from 'prop-types';

export default function Header({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <button className="lg:hidden" onClick={onMenu} aria-label="Open sidebar">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <h1 className="text-lg font-semibold">Admin</h1>
    </header>
  );
}

Header.propTypes = {
  onMenu: PropTypes.func.isRequired,
};
