import { DocumentFileIcon } from "@/components/icons"
import { useLocalDocUpload, Spinner } from "@/features/agent/local/use-local-doc-upload"


/**
 * Attach a PDF to the current local board for document Q&A: OCR it to markdown
 * (via `/ai/parse`), chunk + persist it, and rebuild the board's search index so
 * the agent's `doc_search` tool can ground answers in it.
 *
 * All of that lives in `useLocalDocUpload` (shared with the board toolbar's
 * Document item); this is just the composer button. Greys out when parsing is
 * unavailable (no managed access and no BYOK Mistral key).
 */
export const DocAttachButton = ({ boardId }: { boardId: string }) => {
  const { canParse, busy, pick, elements } = useLocalDocUpload(boardId)

  return (
    <>
      <button
        type="button"
        disabled={!canParse || busy}
        onClick={pick}
        aria-label="附加 PDF"
        title={canParse ? "附加 PDF 以便提问" : "登录或添加 Mistral 密钥以附加文档"}
        className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-secondary-foreground disabled:opacity-40 disabled:pointer-events-none"
      >
        {busy ? <Spinner /> : <DocumentFileIcon className="size-4" strokeWidth={2} />}
      </button>
      {elements}
    </>
  )
}
