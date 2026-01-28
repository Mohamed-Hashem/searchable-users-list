import React from "react";
import HighlightText from "../HighlightText";
import { getFullName } from "../../utils";
import "./index.css";

const UserItem = React.memo(({ user, searchQuery }) => {
    const fullName = getFullName(user);

    return (
        <article className="userItem" aria-label={`User: ${fullName}`}>
            <div className="userName">
                <span className="userId" aria-label={`User ID ${user.id}`}>
                    #{user.id}
                </span>
                <HighlightText text={fullName} highlight={searchQuery} />
            </div>
            <div className="userEmail" aria-label={`Email: ${user.email}`}>
                {user.email}
            </div>
        </article>
    );
});

export default UserItem;
