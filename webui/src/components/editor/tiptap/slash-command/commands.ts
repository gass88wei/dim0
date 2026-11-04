import type { Editor, Range } from "@tiptap/core"
import type { Icon } from "@phosphor-icons/react"
import { openMathEditor } from "../math/math-edit-trigger"
import {
  TextT,
  TextHOne,
  TextHTwo,
  TextHThree,
  ListBullets,
  ListNumbers,
  ListChecks,
  Quotes,
  Code,
  Minus,
  MathOperationsIcon,
  TableIcon,
  CaretRightIcon,
  ImageIcon,
  ListDashes,
  Notepad,
} from "@phosphor-icons/react"
import { pickAndInsertImage } from "../image/insert-image"
import { primePageCache } from "../page/page-cache"
import type { PageProvider } from "../page/types"

export interface SlashCommand {
  title: string
  keywords: string[]
  icon: Icon
  group: "basic"
  action: (editor: Editor, range: Range) => void
}

export const SLASH_COMMANDS: SlashCommand[] = [
  // ── basic blocks ─────────────────────────────────────────────────────────
  {
    title: "文本",
    keywords: ["paragraph", "plain", "text", "p"],
    icon: TextT,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "一级标题",
    keywords: ["h1", "heading", "title", "big"],
    icon: TextHOne,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    title: "二级标题",
    keywords: ["h2", "heading", "subtitle"],
    icon: TextHTwo,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "三级标题",
    keywords: ["h3", "heading"],
    icon: TextHThree,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "无序列表",
    keywords: ["ul", "list", "bullets", "unordered"],
    icon: ListBullets,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "有序列表",
    keywords: ["ol", "numbered", "ordered", "list"],
    icon: ListNumbers,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "待办列表",
    keywords: ["todo", "task", "check", "checkbox"],
    icon: ListChecks,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "引用",
    keywords: ["quote", "blockquote", "callout"],
    icon: Quotes,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "折叠块",
    keywords: ["toggle", "details", "collapse", "expand", "disclosure"],
    icon: CaretRightIcon,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setDetails().run(),
  },
  {
    title: "代码块",
    keywords: ["code", "codeblock", "pre", "snippet"],
    icon: Code,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setCodeBlock({ language: "plaintext" }).run(),
  },
  {
    title: "公式块",
    keywords: ["math", "latex", "equation", "formula", "katex"],
    icon: MathOperationsIcon,
    group: "basic",
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range)
        .insertContent({ type: "blockMath", attrs: { latex: "" } }).run()
      // After insertion the cursor sits just after the new atom; the block
      // itself is at selection.from - 1. Defer one tick so the NodeView DOM
      // exists before the popover anchors to it.
      const pos = Math.max(0, editor.state.selection.from - 1)
      requestAnimationFrame(() => openMathEditor({ pos, latex: "", isInline: false }))
    },
  },
  {
    title: "表格",
    keywords: ["table", "grid", "rows", "columns"],
    icon: TableIcon,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: "分割线",
    keywords: ["hr", "divider", "separator", "rule", "line"],
    icon: Minus,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "图片",
    keywords: ["image", "img", "picture", "photo", "upload"],
    icon: ImageIcon,
    group: "basic",
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).run()
      pickAndInsertImage(editor)
    },
  },
  {
    title: "目录",
    keywords: ["toc", "outline", "headings", "contents", "summary"],
    icon: ListDashes,
    group: "basic",
    action: (editor, range) =>
      editor.chain().focus().deleteRange(range).insertContent({ type: "tableOfContents" }).run(),
  },
  {
    title: "子页面",
    keywords: ["subpage", "sub-page", "page", "child", "embed"],
    icon: Notepad,
    group: "basic",
    action: (editor, range) => {
      // Read provider + the host note id from the editor's storage and
      // create a child page; the new id gets stamped on a `subpage` block.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage = (editor.storage as any).pageProvider as
        | { provider: PageProvider | null; parentNoteId: string | null }
        | undefined
      const provider = storage?.provider
      const parentNoteId = storage?.parentNoteId ?? undefined
      if (!provider) return
      editor.chain().focus().deleteRange(range).run()
      void (async () => {
        try {
          const page = await provider.create({
            title: "未命名",
            parentId: parentNoteId,
          })
          primePageCache(page)
          editor
            .chain()
            .focus()
            .insertContent({
              type: "subpage",
              attrs: { pageId: page.id, title: page.title || "Untitled" },
            })
            .run()
          provider.onNavigate?.(page.id)
        } catch (err) {
          console.error("[/subpage] create failed", err)
        }
      })()
    },
  },
]

export function filterCommands(query: string): SlashCommand[] {
  if (!query) return SLASH_COMMANDS
  const q = query.toLowerCase()
  return SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q)),
  )
}
