

import { Navigate } from "react-router-dom";
const RoleProtected = ({ role, children, specificRole }) => {
    if (!role.includes(specificRole)) {
        return <Navigate to="/" replace />;
    }
    return children;
};
export default RoleProtected;