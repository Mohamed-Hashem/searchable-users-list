import "./index.css";

const LoadingState = () => {
    return (
        <div className="loadingState">
            <div className="loadingSpinner"></div>
            <div className="loadingText">Loading Users...</div>
        </div>
    );
};

export default LoadingState;
