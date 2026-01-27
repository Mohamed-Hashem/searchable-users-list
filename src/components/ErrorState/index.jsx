import { truncateString } from "../../utils";
import { MAX_ERROR_MESSAGE_LENGTH } from "../../constants";
import "./index.css";

const ErrorState = ({ message, onRetry }) => {
    const truncatedMessage = truncateString(message, MAX_ERROR_MESSAGE_LENGTH);

    return (
        <div className="errorState">
            <div className="errorTitle">Failed to load users</div>
            {truncatedMessage && <div className="errorMessage">{truncatedMessage}</div>}
            {onRetry && (
                <button onClick={onRetry} className="retryButton">
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorState;
