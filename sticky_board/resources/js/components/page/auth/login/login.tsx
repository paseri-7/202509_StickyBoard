import React from "react";

const Login: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold">StickyBoard</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Googleでログイン
                    </p>
                        <button
                            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                            onClick={() => {
                            window.location.href = "/login/redirect";
                        }}
                        >
                            Googleでログイン
                        </button>
                </div>
            </div>
        </main>
    );
};

export default Login;
