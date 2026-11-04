import type { Page, PageProvider } from "./types"


/**
 * Disposable in-memory PageProvider for development. Pre-seeds a few
 * fake pages so the @-mention picker has something to show, accepts new
 * "Create new page" actions, and logs onNavigate. Replace with the real
 * host adapter when wiring up the backend.
 */
export function createStubPageProvider(): PageProvider {
  const store = new Map<string, Page>()
  const seed: Page[] = [
    { id: "p_welcome",      title: "欢迎" },
    { id: "p_design-notes", title: "设计笔记" },
    { id: "p_meeting-2026", title: "第一季度规划" },
    { id: "p_inbox",        title: "收件箱" },
  ]
  seed.forEach((p) => store.set(p.id, p))

  return {
    async list(query?: string) {
      const all = Array.from(store.values())
      if (!query?.trim()) return all
      const q = query.trim().toLowerCase()
      return all.filter((p) => p.title.toLowerCase().includes(q))
    },

    async get(id: string) {
      return store.get(id) ?? null
    },

    async create(opts) {
      const id = `p_${Math.random().toString(36).slice(2, 9)}`
      const page: Page = {
        id,
        title: opts.title || "Untitled",
        parentId: opts.parentId,
      }
      store.set(id, page)
      return page
    },

    onNavigate(id) {
      console.log("[stub page provider] navigate to", id)
    },
  }
}
