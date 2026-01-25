import React from "react";
import { createRoot } from "react-dom/client";
import BoardForm from "./board_form";

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(<BoardForm />);
}
