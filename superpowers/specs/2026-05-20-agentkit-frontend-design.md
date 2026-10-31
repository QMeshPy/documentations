# AgentKit Frontend — Design Spec

**Date**: 2026-05-20
**Branch**: `feat/agentkit-integration`
**Status**: Approved for implementation

---

## 1. Goal

Add a fully-integrated "Agents" section to the existing frontend that exposes all five AgentKit backend features (wallet, marketplace, proposals, AI chat, notifications) without introducing a new rail icon or brand name. Everything lives under the existing concept of "agents" in the platform.

---

## 2. Scope

### In scope
- New `Agents` rail item in `NAV_CONFIG`
- Five routes under `(main)/agents/`
- Persistent wallet status strip on every agents page
- Notifications slide-over drawer (bell icon in strip)
- New `src/features/agentkit/` feature module
- New `src/app/api/agentkit/` Next.js proxy routes
- Constants additions to `backend.ts`, `api.ts`, `navigation.ts`, `query-keys.ts`
- Pin `@tanstack/react-query` to exact `5.100.10`

### Out of scope
- Modifying the existing `AgentWorkspace` (fullscreen mode)
- Auth changes
- Any backend changes

---

## 3. Routes

| Route | Purpose |
|-------|---------|
| `/agents` | Overview — wallet strip + quick-action cards + mini proposal feed |
| `/agents/chat` | Intent chat with 2×2 action card starters |
| `/agents/marketplace` | Agent discovery grid + detail Sheet |
| `/agents/proposals` | Create-first proposals page with Table + Sheet detail |
| `/agents/wallet` | Dedicated wallet management sub-page |

Notifications have no dedicated route — they surface as a Sheet drawer triggered by the bell icon in the wallet strip, available on every agents page.

---

## 4. Navigation

### 4.1 Rail item (add to NAV_CONFIG before Settings)

```ts
{
  id: "agents",
  label: "Agents",
  icon: Bot,          // lucide-react
  href: "/agents",
  hasSidebar: true,
  sidebar: {
    type: "static",
    groups: [
      {
        heading: "Workspace",
        links: [
          { label: "Overview",     href: "/agents" },
          { label: "Chat",         href: "/agents/chat" },
        ],
      },
      {
        heading: "Platform",
        links: [
          { label: "Marketplace",  href: "/agents/marketplace" },
          { label: "Proposals",    href: "/agents/proposals" },
          { label: "Wallet",       href: "/agents/wallet" },
        ],
      },
    ],
  },
  matchPrefixes: ["/agents"],
}
```

---

## 5. File Structure

```
frontend/src/
  constants/
    navigation.ts        <- add Agents RailItem (Bot icon)
    backend.ts           <- add BACKEND.AGENTKIT.*
    api.ts               <- add API.AGENTKIT.*
    query-keys.ts        <- add QUERY_KEYS.agentkit.*

  features/
    agentkit/
      index.ts                      <- barrel exports
      types.ts                      <- all shared TS types
      hooks/
        use-wallet.ts               <- useQuery: wallet balance + address
        use-proposals.ts            <- useQuery: list + mutations (create, fund, claim)
        use-marketplace.ts          <- useQuery: agent list + search
        use-notifications.ts        <- useQuery: list + mark-read mutation
      components/
        wallet-strip.tsx            <- persistent top bar (balance, network, bell, CTA)
        notifications-drawer.tsx    <- Sheet triggered by bell
        action-cards.tsx            <- 2x2 intent shortcut cards
        proposal-table.tsx          <- Table + Badge + Progress
        proposal-create-dialog.tsx  <- multi-step Dialog wizard (RHF + Zod)
        proposal-detail-sheet.tsx   <- Sheet with fund + claim actions
        marketplace-grid.tsx        <- Card grid + Input search + Select filter
        agent-detail-sheet.tsx      <- Sheet with hire + analyze actions
        wallet-tabs.tsx             <- Tabs: Overview | Transactions | Transfer

  app/
    (main)/
      agents/
        layout.tsx          <- injects WalletStrip + NotificationsDrawer
        page.tsx            <- Overview shell
        chat/
          page.tsx          <- Chat shell
        marketplace/
          page.tsx          <- Marketplace shell
        proposals/
          page.tsx          <- Proposals shell
        wallet/
          page.tsx          <- Wallet shell
    api/
      agentkit/
        wallet/route.ts             <- GET balance, POST create
        wallet/transfer/route.ts    <- POST transfer
        wallet/transactions/route.ts <- GET history
        proposals/route.ts          <- GET list, POST create
        proposals/[id]/route.ts     <- GET detail, POST fund, POST fragment
        marketplace/route.ts        <- GET agents list
        marketplace/[id]/route.ts   <- GET agent detail
        notifications/route.ts      <- GET list, PATCH read
```

---

## 6. Constants

### backend.ts additions
```ts
AGENTKIT: {
  WALLET:          `${BASE_URL}/api/v1/wallet`,
  WALLET_BALANCE:  (id: string) => `${BASE_URL}/api/v1/wallet/${id}/balance`,
  WALLET_TX:       (id: string) => `${BASE_URL}/api/v1/wallet/${id}/transactions`,
  WALLET_TRANSFER: (id: string) => `${BASE_URL}/api/v1/wallet/${id}/transfer`,
  PROPOSALS:       `${BASE_URL}/api/v1/proposals`,
  PROPOSAL:        (id: string) => `${BASE_URL}/api/v1/proposals/${id}`,
  PROPOSAL_FUND:   (id: string) => `${BASE_URL}/api/v1/proposals/${id}/invest`,
  MARKETPLACE:     `${BASE_URL}/api/v1/marketplace/agents`,
  AGENT_DETAIL:    (id: string) => `${BASE_URL}/api/v1/marketplace/agents/${id}`,
  NOTIFICATIONS:   `${BASE_URL}/api/v1/notifications`,
  NOTIF_READ:      (id: string) => `${BASE_URL}/api/v1/notifications/${id}/read`,
}
```

### api.ts additions
```ts
AGENTKIT: {
  WALLET:          "/api/agentkit/wallet",
  WALLET_TRANSFER: "/api/agentkit/wallet/transfer",
  WALLET_TX:       "/api/agentkit/wallet/transactions",
  PROPOSALS:       "/api/agentkit/proposals",
  PROPOSAL:        (id: string) => `/api/agentkit/proposals/${id}`,
  MARKETPLACE:     "/api/agentkit/marketplace",
  AGENT:           (id: string) => `/api/agentkit/marketplace/${id}`,
  NOTIFICATIONS:   "/api/agentkit/notifications",
}
```

### query-keys.ts additions
```ts
agentkit: {
  wallet:        () => ["agentkit", "wallet"]                    as const,
  proposals:     () => ["agentkit", "proposals"]                 as const,
  proposal:      (id: string) => ["agentkit", "proposals", id]  as const,
  marketplace:   () => ["agentkit", "marketplace"]               as const,
  agent:         (id: string) => ["agentkit", "agents", id]     as const,
  notifications: () => ["agentkit", "notifications"]             as const,
}
```

---

## 7. TypeScript Types (features/agentkit/types.ts)

```ts
export type WalletBalance = {
  wallet_address: string
  usdc_balance: string
  eth_balance: string
  network_id: string
  timestamp: string
}

export type Proposal = {
  proposal_id: string
  title: string
  description: string
  researcher_id: string
  budget_required: string
  budget_raised: string
  funding_threshold: string
  status: "active" | "funded" | "completed" | "expired"
  fragments: ProposalFragment[]
  deadline: string
  tags: string[]
}

export type ProposalFragment = {
  fragment_id: string
  title: string
  budget: number
  status: "available" | "claimed" | "completed"
  claimed_by: string | null
}

export type MarketplaceAgent = {
  agent_id: string
  agent_name: string
  description: string
  capabilities: string[]
  pricing_per_task: string
  reputation_score: number
  total_tasks: number
  status: "active" | "busy" | "offline"
}

export type Notification = {
  notification_id: string
  type: "proposal_funded" | "fragment_claimed" | "payment_received" | "new_proposal"
  title: string
  message: string
  read: boolean
  created_at: string
}

export type CreateProposalForm = {
  title: string
  description: string
  methodology: string
  budget_required: string
  tags: string[]
  auto_fragment: boolean
  deadline_days: number
}
```

---

## 8. Page-by-Page Component Design

### 8.1 agents/layout.tsx
Wraps all /agents/* pages. Renders WalletStrip at top, NotificationsDrawer (open state managed here), then {children}.

### 8.2 WalletStrip
```
[ 0x1a2b...f3e4 ]  [ USDC: 142.50 ]  [ ETH: 0.021 ]  [ base-sepolia ]  [ bell 3 ]  [ Manage Wallet ]
```
- Uses: Badge (network), Button (variant="ghost"), Separator, Tooltip (full address on hover)
- Bell with unread count from useNotifications(). Click opens NotificationsDrawer.
- "Manage Wallet" navigates to /agents/wallet
- Skeleton loading state while wallet query loads

### 8.3 NotificationsDrawer
- Sheet (side="right", width ~420px)
- Header: "Notifications" + Button "Mark all read"
- Each item: icon by type + title + message + timestamp + unread Badge
- Empty state: reuse existing empty.tsx component
- Calls PATCH /api/agentkit/notifications on mark-read

### 8.4 /agents — Overview page
- Ambient glow blobs (match existing dashboard pattern)
- PageHeader with title "Agents"
- 2x2 Card grid: "Browse Marketplace", "Create Proposal", "Check Wallet", "Chat with Agent" — each with lucide icon + description
- Below: 3 most-funded active proposals using Card + Progress + Badge

### 8.5 /agents/chat — Intent Chat
- Reuses ConversationPanel layout pattern from existing features/agent
- Empty state: 2x2 grid of ActionCards
  - "Fund a Proposal" -> prefills input
  - "Browse Marketplace" -> prefills input
  - "Check my balance" -> prefills input
  - "Analyze a proposal" -> prefills input
- Chat input: Textarea + Button (send)
- Dynamic import (next/dynamic, ssr: false) wrapping the entire chat panel

### 8.6 /agents/marketplace — Discovery Grid
- Input search + Select category filter (row)
- Card grid (3 columns): agent name, capability Badge list, price, reputation score, Button "View"
- "View" opens AgentDetailSheet (Sheet, side="right")
  - Agent detail: name, description, capabilities, pricing, stats
  - Button "Hire Agent" (POST to /api/v1/agents/)
  - Button "Analyze Proposal" (opens proposal picker Select)
- Loading: Skeleton cards in grid

### 8.7 /agents/proposals — Create-First
- PageHeader with "New Proposal" Button (opens ProposalCreateDialog)
- ProposalCreateDialog: multi-step Dialog
  - Step 1: Title + Description (Input + Textarea)
  - Step 2: Budget + Tags (Input + Input)
  - Step 3: Auto-fragment Switch + deadline Input
  - Step 4: Review + Submit
  - Form: React Hook Form + Zod schema. No useState for field values.
- Below dialog: Table with columns: Title | Status Badge | Funding Progress | Deadline | Actions
- Row click or Actions button -> ProposalDetailSheet (Sheet, side="right")
  - Funding progress bar + amounts
  - "Fund this Proposal" Button + amount Input
  - Fragments list with per-row "Claim" Button

### 8.8 /agents/wallet — Management Sub-page
- PageHeader "Wallet"
- Top: 3 Card KPIs: USDC Balance | ETH Balance | Total Transactions
- Tabs: Overview | Transactions | Transfer
  - Overview: network info, wallet address (copy button), creation date
  - Transactions: Table of tx history (type, amount, status Badge, date, basescan link)
  - Transfer: Input (to address) + Input (amount) + Button "Send USDC"
    - Form: React Hook Form + Zod (address format + amount > 0 validation)

---

## 9. Data Fetching Rules

- All queries via TanStack Query useQuery / useMutation — no raw fetch in useEffect
- Wallet strip fetches in parallel with page content (separate useQuery calls)
- API proxy routes are thin — forward to BACKEND.AGENTKIT.*
- staleTime: 30_000 for wallet balance
- staleTime: 60_000 for marketplace list
- Notifications: staleTime: 10_000, refetchInterval: 30_000
- Chat panel wrapped in next/dynamic({ ssr: false })

---

## 10. Forms

All forms use React Hook Form + Zod:

```ts
const createProposalSchema = z.object({
  title:           z.string().min(1).max(200),
  description:     z.string().min(1),
  methodology:     z.string().min(1),
  budget_required: z.string().regex(/^\d+(\.\d{1,2})?$/),
  tags:            z.array(z.string()).default([]),
  auto_fragment:   z.boolean().default(false),
  deadline_days:   z.number().int().min(1).max(365).default(30),
})

const transferSchema = z.object({
  to_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount:     z.string().regex(/^\d+(\.\d{1,2})?$/).refine(v => parseFloat(v) > 0),
})
```

---

## 11. shadcn Components Used

| Component | Used in |
|-----------|---------|
| Card | Overview quick-actions, marketplace grid, wallet KPIs |
| Badge | Status, network, capabilities, unread count |
| Progress | Proposal funding bars |
| Sheet | Notifications drawer, agent detail, proposal detail |
| Dialog | Create proposal wizard |
| Table | Proposals list, transaction history |
| Tabs | Wallet sub-page |
| Input | Search, forms |
| Textarea | Chat input, proposal description |
| Button | All actions |
| Select | Marketplace filter, category picker |
| Switch | Auto-fragment toggle |
| Skeleton | Loading states for cards, strips, tables |
| Separator | Wallet strip dividers |
| Tooltip | Truncated wallet address |
| ScrollArea | Notifications list, chat messages |

All imported from @/components/ui/*.

---

## 12. Visual Language

Match existing dark dashboard:
- Background: bg-background / #0d0f14
- Cards: rgba(255,255,255,0.025) with ring-1 ring-white/10
- Ambient blobs: copy pattern from dashboard/page.tsx (indigo + cyan + violet radial gradients)
- Text: text-white primary, text-white/60 secondary, text-white/40 muted
- Accent colors per entity:
  - Proposals  -> text-violet-400 / bg-violet-500/10
  - Marketplace -> text-cyan-400 / bg-cyan-500/10
  - Wallet     -> text-emerald-400 / bg-emerald-500/10
  - Notifications -> text-amber-400 / bg-amber-500/10

---

## 13. Security

- @tanstack/react-query pinned to exact 5.100.10 (no ^ range) -- done
- No wallet private keys or encrypted values in frontend state or logs
- API routes validate response shape before forwarding to client
- Wallet address display truncated: 0x1a2b...f3e4 via utility function
- Transfer form validates Ethereum address format client-side (Zod) AND server-side

---

## 14. Implementation Order

1. Constants (backend.ts, api.ts, query-keys.ts, navigation.ts)
2. Types (features/agentkit/types.ts)
3. API proxy routes (app/api/agentkit/*)
4. Hooks (use-wallet, use-proposals, use-marketplace, use-notifications)
5. WalletStrip + NotificationsDrawer
6. agents/layout.tsx + agents/page.tsx (Overview)
7. /agents/marketplace page + components
8. /agents/proposals page + components
9. /agents/wallet page
10. /agents/chat page

---

## 15. Success Criteria

- All 5 routes render without errors
- Wallet strip shows real balance from backend (or graceful empty state if no wallet)
- Proposal create flow calls POST /api/v1/proposals/ and invalidates query cache
- Marketplace grid populates from GET /api/v1/marketplace/agents
- Notifications drawer shows unread count badge and marks items read
- bun lint passes on all new files
- No `any`, no raw fetch in useEffect, no hardcoded URLs
