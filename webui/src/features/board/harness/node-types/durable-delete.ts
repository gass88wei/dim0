/**
 * Node types whose deletion is DURABLE — not undoable, and confirmed first.
 *
 * These nodes own state outside the canvas store (a document's markdown +
 * chunks in `DocRepo`; a folder's whole subtree, which cascades). Undoing such
 * a delete can't losslessly restore that external state, so we take the delete
 * off the undo stack (apply it as `history` origin) and gate it behind a
 * confirm dialog instead. This map is the single source of truth for both:
 * add an entry to make a new node type durable + confirmed on delete.
 */
export type DurableDeleteMeta = { title: string; description: string }


export const DURABLE_DELETE: Record<string, DurableDeleteMeta> = {
  folder: {
    title: "删除这个文件夹？",
    description: "其中的内容会从画布中移除，且无法撤销。",
  },
  document: {
    title: "删除这个文档？",
    description: "它会连同问答内容一起从画布中移除，且无法撤销。",
  },
}


/** True when a node of `type` deletes durably (non-undoable, confirmed). */
export const isDurableDelete = (type?: string | null): boolean =>
  !!type && Object.prototype.hasOwnProperty.call(DURABLE_DELETE, type)
