import "./index.css";

const EmptyState = () => {
    return (
        <div className="emptyState">
            <div className="emptyTitle">No users found</div>
            <div className="emptyMessage">Try searching for a different name</div>
        </div>
    );
};

export default EmptyState;
