import { MAX_SEARCH_LENGTH } from "../../constants";
import "./index.css";

const SearchInput = ({ value, onChange, onClear, autoFocus = false }) => {
    return (
        <div className="searchInputContainer" role="search">
            <div className="searchInputWrapper">
                <input
                    type="search"
                    placeholder="Search users by name"
                    value={value}
                    onChange={onChange}
                    className="searchInput"
                    maxLength={MAX_SEARCH_LENGTH}
                    autoFocus={autoFocus}
                    aria-label="Search users by name"
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
