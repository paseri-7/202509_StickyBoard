import React from "react";

type NotificationSnackProps = {
    onClose: () => void;
};

const CLOSE_DELAY_MS = 20000;
const EXIT_ANIMATION_MS = 300;

const NotificationSnack: React.FC<NotificationSnackProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setIsVisible(false);
            window.setTimeout(onClose, EXIT_ANIMATION_MS);
        }, CLOSE_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                type="button"
                className={`min-w-[300px] max-w-[400px] rounded-2xl bg-[#e49bb9] px-6 py-4 text-sm text-white shadow-2xl text-left ${
                    isVisible ? "animate-snack-in" : "animate-snack-out"
                }`}
                onClick={() => {
                    setIsVisible(false);
                    window.setTimeout(() => {
                        onClose();
                        window.location.href = "/notifications";
                    }, EXIT_ANIMATION_MS);
                }}
            >
                <div className="flex items-center gap-3">
                    <span className="flex-1">期限超過した付箋があります。</span>
                </div>
            </button>
        </div>
    );
};

export default NotificationSnack;
