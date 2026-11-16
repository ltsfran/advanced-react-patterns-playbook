import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface SearchState {
  results: User[];
  isLoading: boolean;
  error: string | null;
}

interface UseUserSearchResult extends SearchState {
  query: string;
  setQuery: (value: string) => void;
}

const INITIAL_STATE: SearchState = {
  results: [],
  isLoading: false,
  error: null,
};

export function useUserSearch(initialQuery = ''): UseUserSearchResult {
  const [rawQuery, setRawQuery] = useState(initialQuery);
  const [searchState, setSearchState] = useState<SearchState>(INITIAL_STATE);

  const trimmedQuery = rawQuery.trim();

  const setQuery = useCallback((value: string) => {
    setRawQuery(value);
    if (!value.trim()) {
      setSearchState(INITIAL_STATE);
    }
  }, []);

  useEffect(() => {
    if (!trimmedQuery) return;

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setSearchState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?name_like=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: User[] = await response.json();
        setSearchState({ results: data, isLoading: false, error: null });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setSearchState({
          results: [],
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unexpected error occurred',
        });
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmedQuery]);

  const effectiveState = trimmedQuery ? searchState : INITIAL_STATE;

  return {
    query: rawQuery,
    setQuery,
    ...effectiveState,
  };
}