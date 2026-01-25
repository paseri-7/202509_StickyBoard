import React from "react";
import { createRoot } from "react-dom/client";
import BoardList from "./board_list";

const BoardListPage: React.FC = () => {
    return <BoardList />;
};

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(<BoardListPage />);
}

export default BoardListPage;
