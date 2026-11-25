export type LoadImageType = {
    public_id: string;
    url: string;
}

export type ListCloudinaryImageResponse = {
    images: LoadImageType[];
    next_cursor: string | null;
}