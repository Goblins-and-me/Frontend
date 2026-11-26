"use server";

import { ListCloudinaryImageResponse } from "@/types/loadImageType";

export async function listCloudnaryImage(cursor?: string): Promise<ListCloudinaryImageResponse> { 

    const cloudinary = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudinary || !apiKey || !apiSecret) {
        throw new Error("Cloudinary credentials are not set in environment variables.");
    }

    const params = new URLSearchParams({
        max_results: "30",
    });

    if (cursor) {
        params.set("next_cursor", cursor);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary}/resources/image/upload?${params}`, {
        headers: {
            Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch images from Cloudinary: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        images: data.resources.map((resource: { public_id: string; secure_url: string }) => ({
            public_id: resource.public_id,
            url: resource.secure_url,
        })),
        next_cursor: data.next_cursor || null,
    }

}