import { OutputData } from "@editorjs/editorjs";

export type TextEditorProps = {
    data?: OutputData;
    onChange?(val: OutputData): void;
    editorblock: string;
};

export type EditorDisplayProps = {
    data?: OutputData;
    editorblock: string;
};