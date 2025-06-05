import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Sidebar({ open, setOpen }) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full w-64 transform bg-white border-r border-gray-200 p-4 transition-transform dark:bg-gray-900 dark:border-gray-800 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xl font-semibold">TailAdmin</span>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">&times;</button>
      </div>
      <nav className="space-y-1 text-sm">
        <Link className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" to="/admin" onClick={() => setOpen(false)}>
          Dashboard
        </Link>
        <Link className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" to="/" onClick={() => setOpen(false)}>
          Client View
        </Link>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
