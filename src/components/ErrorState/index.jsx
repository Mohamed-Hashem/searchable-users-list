import { truncateString } from "../../utils";
import { MAX_ERROR_MESSAGE_LENGTH } from "../../constants";
import "./index.css";

const ErrorState = ({ message, onRetry }) => {
    const truncatedMessage = truncateString(message, MAX_ERROR_MESSAGE_LENGTH);

    return (
        <div className="errorState" role="alert" aria-live="assertive">
            <div className="errorTitle">Failed to load users</div>
            {truncatedMessage && <div className="errorMessage">{truncatedMessage}</div>}
            {onRetry && (
                <button onClick={onRetry} className="retryButton" aria-label="Retry loading users">
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorState;
