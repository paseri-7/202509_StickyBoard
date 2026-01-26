import { StickyNote } from "./StickyNote";
import { BoardArea } from "./BoardArea";

export type Board = {
    id: number;
    title: string;
    description: string;
    updatedAt: string;
    sticky_notes?: StickyNote[];
    areas?: BoardArea[];
};
