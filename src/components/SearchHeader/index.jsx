import "./index.css";

const SearchHeader = ({ displayedCount = 0, totalCount = 0, isLoading = false, onRefresh }) => {
    return (
        <header className="searchHeader">
            <div className="searchHeaderContent">
                <h1 className="searchHeaderTitle">Searchable User List</h1>
                <div className="searchHeaderActions">
                    <span className="searchHeaderCount" role="status" aria-live="polite">
                        <strong>{displayedCount.toLocaleString()}</strong> of{" "}
                        <strong>{totalCount.toLocaleString()}</strong> Results
                    </span>
                    <button
                        onClick={onRefresh}
                        className={`searchHeaderRefreshButton ${isLoading ? "loading" : ""}`}
                        title="Refresh data"
                        aria-label="Refresh data"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="refreshSpinner"></span>
                                Refreshing
                            </>
                        ) : (
                            "Refresh"
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SearchHeader;
