'use client';

import { useUserSearch } from './useUserSearch';

export function UserSearch() {
  const { query, setQuery, results, isLoading, error } = useUserSearch();

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Directory
        </label>
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a name (e.g., Leanne)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {isLoading && (
        <output htmlFor="user-search" className="block text-sm text-blue-600">
          Searching users...
        </output>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && query.trim() !== '' && results.length === 0 && (
        <p className="text-sm text-gray-500">No users found for &quot;{query}&quot;.</p>
      )}

      {results.length > 0 && (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md bg-white">
          {results.map((user) => (
            <li key={user.id} className="p-3">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}