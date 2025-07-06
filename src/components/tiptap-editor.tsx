import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { suggestion } from "@/lib/tiptap-mention-suggestion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onPaste?: (event: React.ClipboardEvent) => void;
}

export const TiptapEditor = ({
  value,
  onChange,
  onSubmit,
  onPaste,
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "leading-relaxed mb-0",
          },
        },
      }),
      Placeholder.configure({
        placeholder:
          "Use @ to mention tools like @calculator or @chart-generator",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none",
      }),
      Mention.configure({
        HTMLAttributes: {
          class:
            "mention rounded bg-primary/10 px-1.5 py-0.5 text-primary font-medium",
        },
        suggestion,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none",
          "focus:outline-none min-h-[40px] max-h-[200px] overflow-y-auto",
          "rounded-lg p-3 bg-muted/50 hover:bg-muted/80 focus:bg-muted transition-colors duration-200",
          "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
        ),
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative group">
      <EditorContent
        editor={editor}
        onKeyDown={handleKeyDown}
        onPaste={onPaste}
      />
      <div className="absolute inset-0 rounded-lg ring-1 ring-border/50 pointer-events-none transition-opacity duration-200 opacity-0 group-focus-within:opacity-100" />
    </div>
  );
};
