import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Chat } from '@/features/agent/components/chat-view'
import { ArrowExpandIcon, ExternalLinkIcon, SparklesIcon } from '@/components/icons'

interface CopilotSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId?: string
  currentChatId?: string
  onOpenFullChat: (chatId?: string) => void
  /** Run the drawer on the in-browser engine (synced board + flag on). */
  local?: boolean
  /** Back finished browser-agent turns up to the server (synced board). */
  syncTranscript?: boolean
}

/**
 * Reusable board copilot sheet that can be mounted from any board surface.
 * It stays non-modal so users can keep interacting with the graph while open.
 */
export function CopilotSheet({
  open,
  onOpenChange,
  boardId,
  currentChatId,
  onOpenFullChat,
  local = false,
  syncTranscript = false,
}: CopilotSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal>
      <SheetContent
        side="right"
        showOverlay={false}
        showClose={false}
        className="md:w-[500px] md:max-w-[92vw] w-full bg-background text-sidebar-foreground border-l-1 border-border/70 p-0 shadow-sm z-[60]"
      >
        {/* Radix Dialog primitive requires an accessible title for content. */}
        <SheetHeader className="sr-only">
          <SheetTitle>画布助手</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-wiki-link to-secondary-foreground size-6 shadow-sm">
              <SparklesIcon className="size-3.5 text-primary-foreground" weight="fill" />
            </div>
            画布助手
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenFullChat(currentChatId)}
              title="打开完整对话视图"
              aria-label="打开完整对话视图"
            >
              <ExternalLinkIcon className="size-4" strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              title="关闭"
              aria-label="关闭"
            >
              <ArrowExpandIcon className="size-4" strokeWidth={2} />
            </Button>
          </div>
        </div>
        <div className="flex-1 relative overflow-y-auto scrollbar-thin">
          {/* Lazy-mount the chat tree only while the sheet is actually open.
             This keeps the heavy Conversation + message-history mount cost
             from lingering across open/close cycles. */}
          {open && boardId ? (
            <Chat
              initialBoardId={boardId}
              className="relative"
              showHistoricalChats
              chatId={currentChatId}
              enableSelectionContext
              local={local}
              syncTranscript={syncTranscript}
            />
          ) : open ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              选择一块画布开始对话。
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
