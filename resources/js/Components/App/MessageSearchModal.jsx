import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "axios";

const MessageSearchModal = ({ searchOpen, setSearchOpen, conversation = null, handleViewOriginal }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      axios
        .get(route("message.search", { conversation: conversation.id, q: query }))
        .then(({ data }) => {
          setResults(data);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, conversation?.id]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-20 transition-opacity duration-200 ${
        searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-4 relative transform transition-transform duration-200 ${
          searchOpen ? "scale-100" : "scale-95"
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => setSearchOpen(false)}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-semibold mb-3 dark:text-white">
          Search Messages
        </h2>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="w-full border rounded-md p-2 mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <div className="max-h-64 overflow-y-auto border-t dark:border-gray-700 pt-2">
          {loading && (
            <p className="text-gray-500 text-sm text-center">Searching...</p>
          )}

          {!loading && results?.data?.length === 0 && query.trim() !== "" && (
            <p className="text-gray-500 text-sm text-center">No results found...</p>
          )}

          {results?.data?.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                handleViewOriginal(msg.id);
                setSearchOpen(false);
              }}
              className="p-3 border-b border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {msg.sender?.name || "Unknown"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {msg.message || "[Attachment]"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSearchModal;
