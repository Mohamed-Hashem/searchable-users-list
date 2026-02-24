import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import useFetchWithCache from "../../hooks/useFetchWithCache";
import { API_URL, DEBOUNCE_DELAY, INITIAL_DISPLAY_COUNT, LOAD_MORE_COUNT, LOAD_MORE_DELAY } from "../../constants";
import { getFullName } from "../../utils";
import SearchHeader from "../SearchHeader";
import SearchInput from "../SearchInput";
import UserList from "../UserList";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import "./index.css";

const ListContent = ({
    loading,
    error,
    allUsers,
    listRef,
    displayedUsers,
    searchQuery,
    hasMore,
    isLoadingMore,
    onLoadMore,
    onRetry,
}) => {
    if (loading && allUsers.length === 0) {
        return <LoadingState />;
    }

    if (error && allUsers.length === 0) {
        return <ErrorState message={error} onRetry={onRetry} />;
    }

    return (
        <UserList
            ref={listRef}
            users={displayedUsers}
            searchQuery={searchQuery}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
        />
    );
};

const SearchableList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadingTimeoutRef = useRef(null);
    const listRef = useRef(null);
    const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, loading, error, refetch } = useFetchWithCache(API_URL);

    const allUsers = useMemo(() => data?.users || [], [data]);

    const resetDisplayState = useCallback(() => {
        setDisplayCount(INITIAL_DISPLAY_COUNT);
        setIsLoadingMore(false);
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
    }, []);

    const filteredUsers = useMemo(() => {
        const trimmedQuery = debouncedQuery.trim();
        if (!trimmedQuery) return allUsers;

        const query = trimmedQuery.toLowerCase();
        return allUsers.filter((user) => {
            const fullName = getFullName(user).toLowerCase();
            return fullName.includes(query);
        });
    }, [debouncedQuery, allUsers]);

    const displayedUsers = useMemo(() => filteredUsers.slice(0, displayCount), [filteredUsers, displayCount]);

    const hasMore = displayCount < filteredUsers.length;

    const handleSearchChange = useCallback(
        (e) => {
            setSearchQuery(e.target.value);
            resetDisplayState();

            if (listRef.current) {
                listRef.current.scrollToTop();
            }
        },
        [resetDisplayState]
    );

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        resetDisplayState();

        if (listRef.current) {
            listRef.current.scrollToTop();
        }
    }, [resetDisplayState]);

    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        loadingTimeoutRef.current = setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredUsers.length));
            setIsLoadingMore(false);
        }, LOAD_MORE_DELAY);
    }, [hasMore, isLoadingMore, filteredUsers.length]);

    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
            }
        };
    }, []);

    const handleRefresh = useCallback(() => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
        if (listRef.current) {
            listRef.current.scrollToTop();
        }
        resetDisplayState();
        refetch();
    }, [resetDisplayState, refetch]);

    return (
        <main className="searchableListContainer" aria-label="Searchable user list application">
            <SearchHeader
                displayedCount={displayedUsers.length}
                totalCount={filteredUsers.length}
                isLoading={loading}
                onRefresh={handleRefresh}
            />

            <SearchInput value={searchQuery} onChange={handleSearchChange} onClear={handleClearSearch} />

            <ListContent
                loading={loading}
                error={error}
                allUsers={allUsers}
                listRef={listRef}
                displayedUsers={displayedUsers}
                searchQuery={debouncedQuery}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                onRetry={refetch}
            />
        </main>
    );
};

export default SearchableList;
