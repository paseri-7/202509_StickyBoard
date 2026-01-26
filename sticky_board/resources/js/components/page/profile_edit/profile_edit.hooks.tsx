import { useEffect, useState } from "react";

type ProfileData = {
    name: string;
    avatar?: string;
};

export const useProfileEdit = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            try {
                const response = await fetch("/profile/data");
                if (!response.ok) {
                    throw new Error("Failed to fetch profile.");
                }
                const data = (await response.json()) as ProfileData;
                if (isMounted) {
                    setProfile(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const updateProfile = async (payload: FormData) => {
        payload.append("_method", "PUT");
        const response = await fetch("/profile", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
            body: payload,
        });

        if (!response.ok) {
            throw new Error("Failed to update profile.");
        }

        const data = (await response.json()) as ProfileData;
        setProfile(data);
        return data;
    };

    return { profile, loading, updateProfile };
};
