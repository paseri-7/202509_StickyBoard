import React from "react";
import { createRoot } from "react-dom/client";
import BoardEdit from "./board_edit";

const root = document.getElementById("app");
const boardId = root?.dataset.boardId ? Number(root.dataset.boardId) : null;

if (root && boardId) {
    createRoot(root).render(<BoardEdit boardId={boardId} />);
}
