import React from "react";
import HighlightText from "../HighlightText";
import { getFullName } from "../../utils";
import "./index.css";

const UserItem = React.memo(({ user, searchQuery }) => {
    const fullName = getFullName(user);

    return (
        <div className="userItem">
            <div className="userName">
                <span className="userId">#{user.id}</span>
                <HighlightText text={fullName} highlight={searchQuery} />
            </div>
            <div className="userEmail">{user.email}</div>
        </div>
    );
});

export default UserItem;
