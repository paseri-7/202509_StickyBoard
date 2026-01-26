import React from "react";
import { createRoot } from "react-dom/client";
import ProfileEdit from "./profile_edit";

const ProfileEditPage: React.FC = () => {
    return <ProfileEdit />;
};

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(<ProfileEditPage />);
}

export default ProfileEditPage;
