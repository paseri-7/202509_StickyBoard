import React from "react";
import { createRoot } from "react-dom/client";
import NotificationList from "./notification_list";

const NotificationListPage: React.FC = () => {
    return <NotificationList />;
};

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(<NotificationListPage />);
}

export default NotificationListPage;
