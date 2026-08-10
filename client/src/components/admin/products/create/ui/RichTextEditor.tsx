'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import FormField from './FormField';
import { cn } from '@/lib/cn';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  error,
  hint,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm prose-stone max-w-none min-h-[160px] px-3.5 py-2.5 focus:outline-none text-sm text-stone-800',
      },
    },
  });

  if (!editor) return null;

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
  ];

  return (
    <FormField label={label} error={error} hint={hint}>
      <div
        className={cn(
          'border rounded-xl overflow-hidden bg-white transition',
          error ? 'border-red-300' : 'border-stone-200 focus-within:ring-2 focus-within:ring-stone-900/10 focus-within:border-stone-300'
        )}
      >
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-stone-100 bg-stone-50/80">
          {tools.map(({ icon: Icon, action, active }, idx) => (
            <button
              key={`${Icon.name ?? 'tool'}-${idx}`}
              type="button"
              onClick={action}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                active
                  ? 'bg-stone-200 text-stone-900'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
    </FormField>
  );
}
