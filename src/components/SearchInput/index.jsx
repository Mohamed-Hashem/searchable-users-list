import { MAX_SEARCH_LENGTH } from "../../constants";
import "./index.css";

const SearchInput = ({ value, onChange, onClear, autoFocus = false }) => {
    return (
        <div className="searchInputContainer">
            <div className="searchInputWrapper">
                <input
                    type="text"
                    placeholder="Search users by name"
                    value={value}
                    onChange={onChange}
                    className="searchInput"
                    maxLength={MAX_SEARCH_LENGTH}
                    autoFocus={autoFocus}
                />
                {value && (
                    <button
                        onClick={onClear}
                        className="searchClearButton"
                        title="Clear search"
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchInput;
