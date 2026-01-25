import React from "react";
import { createRoot } from "react-dom/client";
import BoardDetail from "./board_detail";

const app = document.getElementById("app");
const boardId = app?.dataset.boardId ? Number(app.dataset.boardId) : null;

if (app && boardId) {
    createRoot(app).render(<BoardDetail boardId={boardId} />);
}
