import { useState, useMemo, useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import UserItem from "../UserItem";
import EmptyState from "../EmptyState";
import useThrottle from "../../hooks/useThrottle";
import { ITEM_HEIGHT, VISIBLE_HEIGHT, BUFFER, LOAD_MORE_THRESHOLD, SCROLL_THROTTLE_DELAY } from "../../constants";
import "./index.css";

const UserList = forwardRef(({ users, searchQuery, hasMore = false, isLoadingMore = false, onLoadMore }, ref) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(VISIBLE_HEIGHT);
    const containerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            if (containerRef.current) {
                containerRef.current.scrollTo({ top: 0, behavior: "instant" });
                setScrollTop(0);
            }
        },
    }));

    // Track scroll position for virtualization + Load more detection
    const handleScrollUpdate = useCallback(
        (scrollTop, scrollHeight, clientHeight) => {
            setScrollTop(scrollTop);

            if (hasMore && onLoadMore && !isLoadingMore) {
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
                if (distanceFromBottom < LOAD_MORE_THRESHOLD) {
                    onLoadMore();
                }
            }
        },
        [hasMore, onLoadMore, isLoadingMore]
    );

    const throttledScrollUpdate = useThrottle(handleScrollUpdate, SCROLL_THROTTLE_DELAY);

    const handleScroll = useCallback(
        (e) => {
            const { scrollTop: newScrollTop, scrollHeight, clientHeight } = e.target;
            throttledScrollUpdate(newScrollTop, scrollHeight, clientHeight);
        },
        [throttledScrollUpdate]
    );

    useEffect(() => {
        if (!containerRef.current) return;

        const updateHeight = () => {
            const height = containerRef.current?.clientHeight || VISIBLE_HEIGHT;
            setContainerHeight(height);
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
    const endIndex = Math.min(users.length, Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER);

    const visibleUsers = useMemo(() => {
        return users.slice(startIndex, endIndex).map((user, index) => ({
            ...user,
            virtualIndex: startIndex + index,
        }));
    }, [users, startIndex, endIndex]);

    const totalHeight = users.length * ITEM_HEIGHT;

    if (users.length === 0) {
        return (
            <div className="userListContainer empty" role="region" aria-label="User list">
                <EmptyState />
            </div>
        );
    }

    return (
        <div
            className="userListContainer"
            ref={containerRef}
            onScroll={handleScroll}
            role="region"
            aria-label="User list"
            tabIndex={0}
        >
            <div className="userListScrollContent" style={{ height: `${totalHeight}px`, position: "relative" }}>
                {visibleUsers.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            position: "absolute",
                            top: `${user.virtualIndex * ITEM_HEIGHT}px`,
                            width: "100%",
                            height: `${ITEM_HEIGHT}px`,
                        }}
                    >
                        <UserItem user={user} searchQuery={searchQuery} />
                    </div>
                ))}
            </div>

            {isLoadingMore && (
                <div className="loadingMoreIndicator" role="status" aria-live="polite">
                    <span className="loadingMoreSpinner" aria-hidden="true"></span>
                    Loading more...
                </div>
            )}
        </div>
    );
});

export default UserList;
