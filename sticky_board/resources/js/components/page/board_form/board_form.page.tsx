import React from "react";
import { createRoot } from "react-dom/client";
import BoardForm from "./board_form";

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(
        <BoardForm
            mode="create"
            onCancel={() => {
                window.location.href = "/boards";
            }}
            onSuccessRedirect={() => {
                window.location.href = "/boards";
            }}
            onSubmit={async (payload) => {
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") ?? "";
                const response = await fetch("/boards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error("Failed to create board.");
                }
            }}
        />,
    );
}
