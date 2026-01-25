import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./login";

const LoginPage: React.FC = () => {
    return <Login />;
};

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(<LoginPage />);
}

export default LoginPage;
