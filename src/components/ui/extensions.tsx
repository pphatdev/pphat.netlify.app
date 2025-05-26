import {
    AIHighlight,
    CharacterCount,
    CodeBlockLowlight,
    Color,
    CustomKeymap,
    GlobalDragHandle,
    HighlightExtension,
    HorizontalRule,
    Mathematics,
    Placeholder,
    StarterKit,
    TaskItem,
    TaskList,
    TextStyle,
    TiptapImage,
    TiptapLink,
    TiptapUnderline,
    Twitter,
    UpdatedImage,
    UploadImagesPlugin,
    Youtube,
} from "novel";

import { common, createLowlight } from "lowlight";
import { cn } from "@lib/utils";

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
    HTMLAttributes: {
        class: cn(
            "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
        ),
    },
});

const tiptapImage = TiptapImage.extend({
    addProseMirrorPlugins() {
        return [
            UploadImagesPlugin({
                imageClass: cn("opacity-40 rounded-lg border border-stone-200"),
            }),
        ];
    },
}).configure({
    allowBase64: true,
    HTMLAttributes: {
        class: cn("rounded-lg border border-muted"),
    },
});

const updatedImage = UpdatedImage.configure({
    HTMLAttributes: {
        class: cn("rounded-lg border border-muted"),
    },
});

const taskList = TaskList.configure({
    HTMLAttributes: {
        class: cn("not-prose pl-2 "),
    },
});
const taskItem = TaskItem.configure({
    HTMLAttributes: {
        class: cn("flex gap-2 items-start my-4"),
    },
    nested: true,
});

const horizontalRule = HorizontalRule.configure({
    HTMLAttributes: {
        class: cn("mt-4 mb-6 border-t border-muted-foreground"),
    },
});

const starterKit = StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: cn("list-disc leading-tight ml-5"),
        },
    },
    orderedList: {
        HTMLAttributes: {
            class: cn("list-decimal leading-tight ml-5"),
        },
    },
    listItem: {
        HTMLAttributes: {
            class: cn("leading-normal list"),
        },
    },
    blockquote: {
        HTMLAttributes: {
            class: cn("border-l-4 border-primary"),
        },
    },
    // Disable default codeBlock since we're using CodeBlockLowlight
    codeBlock: false,
    code: {
        HTMLAttributes: {
            class: cn("rounded-md bg-muted px-1.5 py-1 font-mono font-medium"),
            spellcheck: "false",
        },
    },
    horizontalRule: false,
    dropcursor: {
        color: "#DBEAFE",
        width: 4,
    },
    gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
    // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
    // common: covers 37 language grammars which should be good enough in most cases
    lowlight: createLowlight(common),
    HTMLAttributes: {
        class: cn(
            "relative rounded-lg bg-muted border border-border",
            "font-mono text-sm leading-relaxed",
            "my-6 overflow-x-auto",
            "prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0",
            "[&>pre]:p-4 [&>pre]:m-0 [&>pre]:bg-transparent",
            "[&>pre>code]:bg-transparent [&>pre>code]:p-0",
            "[&_code]:bg-transparent [&_code]:text-foreground",
            "[&_.hljs]:bg-transparent [&_.hljs]:text-foreground"
        ),
    },
    defaultLanguage: 'typescript',
});

const youtube = Youtube.configure({
    HTMLAttributes: {
        class: cn("rounded-lg border border-muted"),
    },
    inline: false,
});

const twitter = Twitter.configure({
    HTMLAttributes: {
        class: cn("not-prose"),
    },
    inline: false,
});

const mathematics = Mathematics.configure({
    HTMLAttributes: {
        class: cn("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
    },
    katexOptions: {
        throwOnError: false,
    },
});

const characterCount = CharacterCount.configure();

export const defaultExtensions = [
    starterKit,
    placeholder,
    tiptapLink,
    tiptapImage,
    updatedImage,
    taskList,
    taskItem,
    horizontalRule,
    aiHighlight,
    codeBlockLowlight,
    youtube,
    twitter,
    mathematics,
    characterCount,
    TiptapUnderline,
    HighlightExtension,
    TextStyle,
    Color,
    CustomKeymap,
    GlobalDragHandle,
];