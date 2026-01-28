import "./index.css";

const EmptyState = () => {
    return (
        <div className="emptyState" role="status" aria-live="polite">
            <div className="emptyTitle">No users found</div>
            <div className="emptyMessage">Try searching for a different name</div>
        </div>
    );
};

export default EmptyState;
