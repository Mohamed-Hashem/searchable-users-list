import React, { useMemo } from "react";
import { generateKey } from "../../utils";
import "./index.css";

const HighlightText = React.memo(({ text, highlight }) => {
    const parts = useMemo(() => {
        if (!highlight?.trim() || !text) return null;
        const regex = new RegExp(`(${highlight})`, "gi");

        return text.split(regex).filter(Boolean);
    }, [text, highlight]);

    if (!parts) return <span>{text}</span>;

    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={generateKey(index, part.slice(0, 10))} className="highlight">
                        {part}
                    </mark>
                ) : (
                    <span key={generateKey(index, part.slice(0, 10))}>{part}</span>
                )
            )}
        </span>
    );
});

export default HighlightText;
