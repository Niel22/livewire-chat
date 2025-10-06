const Pagination = ({ setPage, links, meta }) => {
  if (!links && !meta) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6 py-3">
      {/* Previous */}
      <button
        onClick={() => setPage(meta.current_page - 1)}
        disabled={!links.prev}
        className={`px-3 py-1 rounded border text-sm transition-all 
          border-gray-300 dark:border-gray-700
          text-gray-800 dark:text-gray-200
          ${
            links.prev
              ? "hover:bg-gray-100 dark:hover:bg-gray-700"
              : "opacity-50 cursor-not-allowed"
          }`}
      >
        Previous
      </button>

      {/* Page info */}
      <span className="px-3 py-1 text-gray-700 dark:text-gray-300 text-sm">
        Page {meta.current_page} of {meta.last_page}
      </span>

      {/* Next */}
      <button
        onClick={() => setPage(meta.current_page + 1)}
        disabled={!links.next}
        className={`px-3 py-1 rounded border text-sm transition-all 
          border-gray-300 dark:border-gray-700
          text-gray-800 dark:text-gray-200
          ${
            links.next
              ? "hover:bg-gray-100 dark:hover:bg-gray-700"
              : "opacity-50 cursor-not-allowed"
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
