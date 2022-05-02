export interface Space {
    name: string;
    owner: string;
    description?: string | null;
}

export interface SpaceResponse extends Space {
    space_id: number;
    created_at: Date | null;
}