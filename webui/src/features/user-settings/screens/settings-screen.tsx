import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBillingSummary, type BillingSummary } from "@/features/user-settings/api/billing"
import { TierBadge } from "@/features/user-settings/components/tier-badge"
import { useAppStore } from "@/store"


export function SettingsScreen() {
  const navigate = useNavigate()
  const userEmail = useAppStore(s => s.userEmail)
  const userPlan = useAppStore(s => s.userPlan)
  const billingActive = useAppStore(s => s.billingActive)
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null)

  useEffect(() => {
    if (!billingActive) return

    void (async () => {
      try {
        const summary = await getBillingSummary()
        setBillingSummary(summary)
      } catch {
        setBillingSummary(null)
      }
    })()
  }, [billingActive])

  const expiresAtLabel = useMemo(() => {
    if (!billingSummary?.cancel_at_period_end) return null
    if (!billingSummary.current_period_end) return "Expires at period end"
    return `Expires on ${new Date(billingSummary.current_period_end).toLocaleDateString()}`
  }, [billingSummary])

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-thin">
      <div className="mx-auto w-full max-w-4xl px-6 py-24 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>账户基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">邮箱</span>
              <span className="text-sm font-medium">{userEmail}</span>
            </div>
            {billingActive ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">当前方案</span>
                <div className="flex items-center gap-2">
                  <TierBadge plan={userPlan} />
                  {expiresAtLabel ? (
                    <Badge variant="outline" className="font-mono font-medium tracking-wide">
                      {expiresAtLabel}
                    </Badge>
                  ) : null}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {billingActive ? (
          <Card className="border-secondary-foreground/60 bg-gradient-to-br from-secondary-foreground/20 via-secondary-foreground/10 to-card">
            <CardHeader>
              <CardTitle>订阅与账单</CardTitle>
              <CardDescription>管理订阅与用量上限</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: "/settings/billing" })}>
                打开账单
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
