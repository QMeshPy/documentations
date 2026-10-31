# Autonomous Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an autonomous workspace mode where an AI agent orchestrates multi-step scientific workflows automatically via natural language input

**Architecture:** Client-side mode toggle switches between existing Manual UI and new Agent workspace (3-panel Cursor-style layout). Backend adds Agent Orchestrator service that uses Claude API for intent classification and calls existing tool APIs (circuits, pharma, finance, risk). Sessions stored in MongoDB with WebSocket streaming for real-time updates.

**Tech Stack:** Next.js 16, Zustand, TanStack Query, shadcn/ui, FastAPI, MongoDB, Anthropic Claude API, WebSocket

---

## File Structure Overview

### Frontend Files (Create)

```
frontend/src/
├── constants/agent.ts                              # API endpoints, limits, query keys
├── shared/stores/workspace-mode-store.ts           # Global mode state (manual/agent)
├── shared/components/layout/mode-toggle.tsx        # Mode toggle component
├── features/agent/
│   ├── index.ts                                    # Barrel exports
│   ├── types.ts                                    # TypeScript types
│   ├── stores/agent-store.ts                       # Agent UI state (Zustand)
│   ├── hooks/
│   │   ├── use-agent-sessions.ts                  # List sessions (TanStack Query)
│   │   ├── use-agent-session.ts                   # Get single session
│   │   ├── use-create-session.ts                  # Create session mutation
│   │   ├── use-send-message.ts                    # Send message mutation
│   │   ├── use-approve-action.ts                  # Approve/reject mutation
│   │   ├── use-agent-stream.ts                    # WebSocket hook
│   │   └── use-budget-status.ts                   # Budget tracking
│   └── components/
│       ├── agent-workspace.tsx                     # Main workspace container
│       ├── session-sidebar.tsx                     # Left: session list + budget
│       ├── session-card.tsx                        # Session list item
│       ├── budget-indicator.tsx                    # Budget progress bars
│       ├── conversation-panel.tsx                  # Center: chat interface
│       ├── message-item.tsx                        # Chat message component
│       ├── thinking-block.tsx                      # Agent reasoning display
│       ├── approval-card.tsx                       # Approval gate UI
│       ├── execution-context.tsx                   # Right: results/technical/logs
│       ├── progress-card.tsx                       # Progress visualization
│       ├── chat-input.tsx                          # Message input
│       └── agent-settings-dialog.tsx               # Settings panel
```

### Frontend Files (Modify)

```
frontend/src/app/(main)/layout.tsx                  # Add mode toggle, conditional rendering
```

### Backend Files (Create)

```
backend/src/quantum_backend_v2/
├── agent/
│   ├── __init__.py
│   ├── models.py                                   # Pydantic models (session, message, workflow)
│   ├── schemas.py                                  # Request/response schemas
│   ├── service.py                                  # AgentService (CRUD operations)
│   ├── orchestrator.py                             # AgentOrchestrator (LLM integration)
│   ├── intent_classifier.py                        # Intent classification logic
│   ├── workflow_engine.py                          # Multi-step workflow state machine
│   ├── cost_guard.py                               # Budget enforcement
│   └── websocket.py                                # WebSocket handler
└── api/routers/agent.py                            # FastAPI router (all endpoints)
```

### Backend Files (Modify)

```
backend/src/quantum_backend_v2/api/main.py          # Register agent router
backend/pyproject.toml                              # Add anthropic SDK dependency
```

---

## Task 1: Frontend Constants & Types

**Files:**
- Create: `frontend/src/constants/agent.ts`
- Create: `frontend/src/features/agent/types.ts`

- [ ] **Step 1: Create agent constants file**

```typescript
// frontend/src/constants/agent.ts
export const AGENT_API = {
  BASE: "/api/v1/agent",
  SESSIONS: "/api/v1/agent/sessions",
  STREAM_WS: `ws://${typeof window !== 'undefined' ? window.location.host : 'localhost:8081'}/api/v1/agent/sessions`,
} as const;

export const AGENT_LIMITS = {
  AUTO_APPROVAL_THRESHOLD_USD: 5,
  MAX_MESSAGE_LENGTH: 4000,
  SESSION_TIMEOUT_HOURS: 24,
  POLL_INTERVAL_MS: 2000,
} as const;

export const AGENT_QUERY_KEYS = {
  sessions: ["agent-sessions"] as const,
  session: (id: string) => ["agent-session", id] as const,
  messages: (id: string) => ["agent-messages", id] as const,
  budget: ["agent-budget"] as const,
} as const;
```

- [ ] **Step 2: Create TypeScript types**

```typescript
// frontend/src/features/agent/types.ts
export type AgentSessionStatus = "active" | "paused" | "completed" | "failed";

export type MessageRole = "user" | "agent" | "system";

export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed";

export type ToolType = "circuits" | "pharma" | "finance" | "risk";

export type ApprovalMode = "auto" | "interactive";

export type TechnicalDetailLevel = "domain" | "balanced" | "full";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: {
    thinking?: string;
    actions?: string[];
    approval_required?: boolean;
  };
}

export interface WorkflowStep {
  id: string;
  tool: ToolType;
  name: string;
  status: WorkflowStepStatus;
  job_id?: string;
  started_at?: string;
  completed_at?: string;
  progress_percent?: number;
  result?: unknown;
}

export interface Workflow {
  plan_id: string;
  steps: WorkflowStep[];
  current_step: number;
  current_step_name?: string;
  approval_pending: boolean;
  approval_data?: ApprovalData;
  progress_percent: number;
  completed_steps: number;
  total_steps: number;
}

export interface ApprovalData {
  cost: number;
  time_minutes: number;
  description?: string;
  technical?: {
    nodes?: string[];
    qubits?: number;
    circuit_depth?: number;
  };
}

export interface CostBreakdown {
  compute: number;
  storage: number;
  network: number;
}

export interface SessionCost {
  estimated: number;
  actual: number;
  breakdown: CostBreakdown;
}

export interface SessionTime {
  estimated_minutes: number;
  elapsed_seconds: number;
}

export interface SessionSettings {
  approval_mode: ApprovalMode;
  auto_approval_threshold: number;
  technical_detail_level: TechnicalDetailLevel;
}

export interface AgentSession {
  _id: string;
  user_id: string;
  session_id: string;
  title: string;
  status: AgentSessionStatus;
  created_at: string;
  updated_at: string;
  messages: Message[];
  workflow?: Workflow;
  cost: SessionCost;
  time: SessionTime;
  settings: SessionSettings;
  results?: unknown;
  logs?: LogEntry[];
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  source?: string;
}

export interface BudgetLimits {
  daily_usd: number;
  monthly_usd: number;
  per_session_usd: number;
}

export interface BudgetAlerts {
  email_on_budget_reached: boolean;
  warn_at_percentage: number;
}

export interface SpentTracking {
  daily_spent: number;
  monthly_spent: number;
  last_reset_daily: string;
  last_reset_monthly: string;
}

export interface BudgetStatus {
  daily_limit: number;
  daily_spent: number;
  monthly_limit: number;
  monthly_spent: number;
}

export interface AgentSettings {
  approval_mode: ApprovalMode;
  auto_approval_threshold: number;
  technical_detail_level: TechnicalDetailLevel;
  budget_limits: BudgetLimits;
  alerts: BudgetAlerts;
}

export interface CreateSessionRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ApprovalRequest {
  approved: boolean;
}
```

- [ ] **Step 3: Commit constants and types**

```bash
cd frontend
git add src/constants/agent.ts src/features/agent/types.ts
git commit -m "feat(agent): add constants and TypeScript types

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Workspace Mode Store

**Files:**
- Create: `frontend/src/shared/stores/workspace-mode-store.ts`

- [ ] **Step 1: Create workspace mode store**

```typescript
// frontend/src/shared/stores/workspace-mode-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceModeState {
  mode: "manual" | "agent";
  hasActiveExecution: boolean;
  setMode: (mode: "manual" | "agent") => void;
  setHasActiveExecution: (active: boolean) => void;
}

export const useWorkspaceMode = create<WorkspaceModeState>()(
  persist(
    (set) => ({
      mode: "manual",
      hasActiveExecution: false,
      setMode: (mode) => set({ mode }),
      setHasActiveExecution: (active) => set({ hasActiveExecution: active }),
    }),
    {
      name: "workspace_mode",
    }
  )
);
```

- [ ] **Step 2: Commit workspace mode store**

```bash
cd frontend
git add src/shared/stores/workspace-mode-store.ts
git commit -m "feat(agent): add workspace mode global state store

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Mode Toggle Component

**Files:**
- Create: `frontend/src/shared/components/layout/mode-toggle.tsx`

- [ ] **Step 1: Create mode toggle component**

```typescript
// frontend/src/shared/components/layout/mode-toggle.tsx
"use client";

import { useWorkspaceMode } from "@/shared/stores/workspace-mode-store";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { mode, setMode, hasActiveExecution } = useWorkspaceMode();
  
  const handleModeChange = async (newMode: "manual" | "agent") => {
    if (mode === "agent" && hasActiveExecution) {
      const confirmed = window.confirm(
        "Agent is executing a workflow. Switch anyway? (Execution will be paused)"
      );
      if (!confirmed) return;
    }
    setMode(newMode);
  };
  
  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
      <button
        onClick={() => handleModeChange("manual")}
        className={cn(
          "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
          mode === "manual"
            ? "bg-white/10 text-white"
            : "text-white/50 hover:text-white/80"
        )}
      >
        Manual
      </button>
      <button
        onClick={() => handleModeChange("agent")}
        className={cn(
          "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
          mode === "agent"
            ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30"
            : "text-white/50 hover:text-white/80"
        )}
      >
        Agent
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit mode toggle component**

```bash
cd frontend
git add src/shared/components/layout/mode-toggle.tsx
git commit -m "feat(agent): add mode toggle component

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Update Main Layout

**Files:**
- Modify: `frontend/src/app/(main)/layout.tsx`

- [ ] **Step 1: Read current layout**

Read the file to understand current structure

- [ ] **Step 2: Update layout to add mode toggle and conditional rendering**

```typescript
// frontend/src/app/(main)/layout.tsx
"use client";

import dynamic from "next/dynamic";
import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { ModeToggle } from "@/shared/components/layout/mode-toggle";
import { useWorkspaceMode } from "@/shared/stores/workspace-mode-store";

const HeliaProvider = dynamic(
  () => import("@/features/ipfs").then((m) => m.HeliaProvider),
  { ssr: false }
);

const PinningProvider = dynamic(
  () => import("@/features/vault-pinning").then((m) => m.PinningProvider),
  { ssr: false }
);

const AgentWorkspace = dynamic(
  () => import("@/features/agent").then((m) => m.AgentWorkspace),
  { ssr: false }
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useWorkspaceMode();
  
  return (
    <HeliaProvider>
      <PinningProvider>
        {/* Top nav with mode toggle */}
        <div className="fixed top-0 left-0 right-0 h-14 border-b border-white/10 bg-background z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Quantum Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
        
        {/* Main content area */}
        <div className="pt-14">
          {mode === "manual" ? (
            <DashboardShell>{children}</DashboardShell>
          ) : (
            <AgentWorkspace />
          )}
        </div>
      </PinningProvider>
    </HeliaProvider>
  );
}
```

- [ ] **Step 3: Commit layout update**

```bash
cd frontend
git add src/app/\(main\)/layout.tsx
git commit -m "feat(agent): integrate mode toggle and conditional workspace rendering

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Agent UI Store

**Files:**
- Create: `frontend/src/features/agent/stores/agent-store.ts`

- [ ] **Step 1: Create agent UI state store**

```typescript
// frontend/src/features/agent/stores/agent-store.ts
import { create } from "zustand";
import type { ApprovalData } from "../types";

type ExecutionView = "results" | "technical" | "logs";

interface AgentState {
  // UI State
  activeSessionId: string | null;
  executionView: ExecutionView;
  technicalDetailsExpanded: boolean;
  
  // Session Management
  setActiveSession: (id: string | null) => void;
  setExecutionView: (view: ExecutionView) => void;
  toggleTechnicalDetails: () => void;
  
  // Input State
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  clearInputMessage: () => void;
  
  // Approval State
  pendingApproval: {
    sessionId: string;
    data: ApprovalData;
  } | null;
  setPendingApproval: (approval: { sessionId: string; data: ApprovalData } | null) => void;
  clearPendingApproval: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  // Initial State
  activeSessionId: null,
  executionView: "results",
  technicalDetailsExpanded: false,
  inputMessage: "",
  pendingApproval: null,
  
  // Actions
  setActiveSession: (id) => set({ activeSessionId: id }),
  setExecutionView: (view) => set({ executionView: view }),
  toggleTechnicalDetails: () => 
    set((state) => ({ technicalDetailsExpanded: !state.technicalDetailsExpanded })),
  setInputMessage: (msg) => set({ inputMessage: msg }),
  clearInputMessage: () => set({ inputMessage: "" }),
  setPendingApproval: (approval) => set({ pendingApproval: approval }),
  clearPendingApproval: () => set({ pendingApproval: null }),
}));
```

- [ ] **Step 2: Commit agent store**

```bash
cd frontend
git add src/features/agent/stores/agent-store.ts
git commit -m "feat(agent): add agent UI state store

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Agent Query Hooks (Sessions List)

**Files:**
- Create: `frontend/src/features/agent/hooks/use-agent-sessions.ts`
- Create: `frontend/src/features/agent/hooks/use-create-session.ts`

- [ ] **Step 1: Create sessions list hook**

```typescript
// frontend/src/features/agent/hooks/use-agent-sessions.ts
import { useQuery } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS } from "@/constants/agent";
import type { AgentSession } from "../types";

export function useAgentSessions() {
  return useQuery({
    queryKey: AGENT_QUERY_KEYS.sessions,
    queryFn: async (): Promise<AgentSession[]> => {
      const res = await fetch(AGENT_API.SESSIONS, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch agent sessions");
      }
      return res.json();
    },
    refetchInterval: 10000, // Refetch every 10s
  });
}
```

- [ ] **Step 2: Create session creation hook**

```typescript
// frontend/src/features/agent/hooks/use-create-session.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS } from "@/constants/agent";
import type { AgentSession, CreateSessionRequest } from "../types";

export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: CreateSessionRequest = {}): Promise<AgentSession> => {
      const res = await fetch(AGENT_API.SESSIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        throw new Error("Failed to create agent session");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_QUERY_KEYS.sessions });
    },
  });
}
```

- [ ] **Step 3: Commit session hooks**

```bash
cd frontend
git add src/features/agent/hooks/use-agent-sessions.ts src/features/agent/hooks/use-create-session.ts
git commit -m "feat(agent): add sessions list and create session hooks

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Agent Query Hooks (Single Session & Messages)

**Files:**
- Create: `frontend/src/features/agent/hooks/use-agent-session.ts`
- Create: `frontend/src/features/agent/hooks/use-send-message.ts`
- Create: `frontend/src/features/agent/hooks/use-approve-action.ts`

- [ ] **Step 1: Create single session hook**

```typescript
// frontend/src/features/agent/hooks/use-agent-session.ts
import { useQuery } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS, AGENT_LIMITS } from "@/constants/agent";
import type { AgentSession } from "../types";

export function useAgentSession(sessionId: string | null) {
  return useQuery({
    queryKey: AGENT_QUERY_KEYS.session(sessionId ?? ""),
    queryFn: async (): Promise<AgentSession | null> => {
      if (!sessionId) return null;
      
      const res = await fetch(`${AGENT_API.SESSIONS}/${sessionId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch agent session");
      }
      return res.json();
    },
    enabled: !!sessionId,
    refetchInterval: AGENT_LIMITS.POLL_INTERVAL_MS,
  });
}
```

- [ ] **Step 2: Create send message hook**

```typescript
// frontend/src/features/agent/hooks/use-send-message.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS } from "@/constants/agent";
import type { SendMessageRequest } from "../types";

export function useSendMessage(sessionId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: SendMessageRequest): Promise<void> => {
      if (!sessionId) throw new Error("No active session");
      
      const res = await fetch(`${AGENT_API.SESSIONS}/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
    },
    onSuccess: () => {
      if (sessionId) {
        queryClient.invalidateQueries({ 
          queryKey: AGENT_QUERY_KEYS.session(sessionId) 
        });
      }
    },
  });
}
```

- [ ] **Step 3: Create approve action hook**

```typescript
// frontend/src/features/agent/hooks/use-approve-action.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS } from "@/constants/agent";
import type { ApprovalRequest } from "../types";

export function useApproveAction(sessionId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (approved: boolean): Promise<void> => {
      if (!sessionId) throw new Error("No active session");
      
      const endpoint = approved ? "approve" : "reject";
      const res = await fetch(
        `${AGENT_API.SESSIONS}/${sessionId}/${endpoint}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to ${endpoint} action`);
      }
    },
    onSuccess: () => {
      if (sessionId) {
        queryClient.invalidateQueries({ 
          queryKey: AGENT_QUERY_KEYS.session(sessionId) 
        });
      }
    },
  });
}
```

- [ ] **Step 4: Commit message and approval hooks**

```bash
cd frontend
git add src/features/agent/hooks/use-agent-session.ts src/features/agent/hooks/use-send-message.ts src/features/agent/hooks/use-approve-action.ts
git commit -m "feat(agent): add session detail, send message, and approval hooks

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: WebSocket Hook

**Files:**
- Create: `frontend/src/features/agent/hooks/use-agent-stream.ts`

- [ ] **Step 1: Create WebSocket streaming hook**

```typescript
// frontend/src/features/agent/hooks/use-agent-stream.ts
import { useEffect, useRef } from "use client";
import { useQueryClient } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS } from "@/constants/agent";
import { useAgentStore } from "../stores/agent-store";
import { toast } from "sonner";
import type { AgentSession } from "../types";

export function useAgentStream(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const setPendingApproval = useAgentStore((s) => s.setPendingApproval);
  
  useEffect(() => {
    if (!sessionId) return;
    
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;
    
    const connect = () => {
      const ws = new WebSocket(
        `${AGENT_API.STREAM_WS}/${sessionId}`
      );
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        // Update query cache with real-time data
        queryClient.setQueryData(
          AGENT_QUERY_KEYS.session(sessionId),
          (old: AgentSession | undefined) => {
            if (!old) return old;
            
            switch (message.type) {
              case "agent_message":
                return {
                  ...old,
                  messages: [...old.messages, {
                    id: crypto.randomUUID(),
                    role: "agent" as const,
                    content: message.data.message,
                    thinking: message.data.thinking,
                    actions: message.data.actions,
                    timestamp: new Date().toISOString(),
                  }],
                };
                
              case "step_progress":
                return {
                  ...old,
                  workflow: old.workflow ? {
                    ...old.workflow,
                    steps: old.workflow.steps.map((step) =>
                      step.id === message.data.step_id
                        ? { 
                            ...step, 
                            progress_percent: message.data.progress_percent,
                            status: message.data.status,
                          }
                        : step
                    ),
                    progress_percent: message.data.workflow_progress_percent,
                  } : old.workflow,
                };
                
              case "approval_required":
                setPendingApproval({
                  sessionId,
                  data: message.data,
                });
                return old;
                
              case "cost_update":
                return {
                  ...old,
                  cost: { ...old.cost, ...message.data },
                };
                
              case "workflow_completed":
                toast.success("Workflow completed!");
                return {
                  ...old,
                  status: "completed" as const,
                };
                
              case "error":
                toast.error(message.data.message);
                return old;
                
              default:
                return old;
            }
          }
        );
      };
      
      ws.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          
          toast.info(`Reconnecting... (attempt ${reconnectAttempts})`);
          
          reconnectTimeout = setTimeout(() => {
            connect();
          }, delay);
        } else {
          toast.error("Lost connection to agent. Please refresh the page.");
        }
      };
      
      ws.onerror = () => {
        ws.close();
      };
      
      ws.onopen = () => {
        reconnectAttempts = 0;
        if (reconnectAttempts > 0) {
          toast.success("Reconnected to agent!");
        }
      };
      
      wsRef.current = ws;
    };
    
    connect();
    
    return () => {
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, [sessionId, queryClient, setPendingApproval]);
}
```

- [ ] **Step 2: Commit WebSocket hook**

```bash
cd frontend
git add src/features/agent/hooks/use-agent-stream.ts
git commit -m "feat(agent): add WebSocket streaming hook with auto-reconnect

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Budget Status Hook

**Files:**
- Create: `frontend/src/features/agent/hooks/use-budget-status.ts`

- [ ] **Step 1: Create budget status hook**

```typescript
// frontend/src/features/agent/hooks/use-budget-status.ts
import { useQuery } from "@tanstack/react-query";
import { AGENT_API, AGENT_QUERY_KEYS } from "@/constants/agent";
import type { BudgetStatus } from "../types";

export function useBudgetStatus() {
  return useQuery({
    queryKey: AGENT_QUERY_KEYS.budget,
    queryFn: async (): Promise<BudgetStatus> => {
      const res = await fetch(`${AGENT_API.BASE}/budget`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch budget status");
      }
      return res.json();
    },
    refetchInterval: 5000, // Refetch every 5s
  });
}
```

- [ ] **Step 2: Commit budget hook**

```bash
cd frontend
git add src/features/agent/hooks/use-budget-status.ts
git commit -m "feat(agent): add budget status hook

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Session Card & Budget Indicator Components

**Files:**
- Create: `frontend/src/features/agent/components/session-card.tsx`
- Create: `frontend/src/features/agent/components/budget-indicator.tsx`

- [ ] **Step 1: Create session card component**

```typescript
// frontend/src/features/agent/components/session-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAgentStore } from "../stores/agent-store";
import type { AgentSession } from "../types";

interface SessionCardProps {
  session: AgentSession;
}

export function SessionCard({ session }: SessionCardProps) {
  const activeSessionId = useAgentStore((s) => s.activeSessionId);
  const setActiveSession = useAgentStore((s) => s.setActiveSession);
  const isActive = activeSessionId === session.session_id;
  
  const statusVariant = {
    active: "default",
    paused: "outline",
    completed: "secondary",
    failed: "destructive",
  }[session.status] as "default" | "outline" | "secondary" | "destructive";
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:bg-white/5",
        isActive && "bg-indigo-500/10 border-indigo-500/30"
      )}
      onClick={() => setActiveSession(session.session_id)}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium line-clamp-1">
            {session.title}
          </span>
          <Badge 
            variant={statusVariant}
            className="shrink-0 text-xs"
          >
            {session.status}
          </Badge>
        </div>
        
        <div className="text-xs text-white/40 space-y-1">
          <div>
            {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
          </div>
          <div>
            {session.workflow?.steps.length ?? 0} steps • ${session.cost.actual.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create budget indicator component**

```typescript
// frontend/src/features/agent/components/budget-indicator.tsx
"use client";

import { useBudgetStatus } from "../hooks/use-budget-status";
import { cn } from "@/lib/utils";

export function BudgetIndicator() {
  const { data: budget } = useBudgetStatus();
  
  if (!budget) return null;
  
  const dailyPercent = (budget.daily_spent / budget.daily_limit) * 100;
  const monthlyPercent = (budget.monthly_spent / budget.monthly_limit) * 100;
  
  const getColorClass = (percent: number) => {
    if (percent > 90) return "bg-red-500";
    if (percent > 70) return "bg-yellow-500";
    return "bg-indigo-500";
  };
  
  return (
    <div className="p-3 border-b border-white/10">
      <div className="text-xs text-white/40 mb-2">Budget Status</div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Daily</span>
            <span>${budget.daily_spent.toFixed(2)} / ${budget.daily_limit}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                getColorClass(dailyPercent)
              )}
              style={{ width: `${Math.min(dailyPercent, 100)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Monthly</span>
            <span>${budget.monthly_spent.toFixed(2)} / ${budget.monthly_limit}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                getColorClass(monthlyPercent)
              )}
              style={{ width: `${Math.min(monthlyPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit session card and budget indicator**

```bash
cd frontend
git add src/features/agent/components/session-card.tsx src/features/agent/components/budget-indicator.tsx
git commit -m "feat(agent): add session card and budget indicator components

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## MILESTONE 1: Frontend Core Infrastructure ✅

**Checkpoint:** Mode toggle + basic agent workspace shell working

- [ ] **Test mode toggle**

Open frontend in browser, verify mode toggle switches between Manual and Agent modes smoothly

- [ ] **Commit Milestone 1**

```bash
cd frontend
git add .
git commit -m "milestone(agent): complete core infrastructure - mode toggle and workspace shell

- Added mode toggle component with state persistence
- Created agent workspace stores and hooks foundation
- Integrated conditional rendering in main layout
- Budget tracking and session management hooks ready

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

## Task 11: Message Item Component

**Files:**
- Create: `frontend/src/features/agent/components/message-item.tsx`
- Create: `frontend/src/features/agent/components/thinking-block.tsx`

- [ ] **Step 1: Create thinking block component**

```typescript
// frontend/src/features/agent/components/thinking-block.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ThinkingBlockProps {
  thinking: string;
}

export function ThinkingBlock({ thinking }: ThinkingBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          <ChevronDown className={cn(
            "h-3 w-3 mr-1 transition-transform",
            isOpen && "rotate-180"
          )} />
          {isOpen ? "Hide" : "Show"} reasoning
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2 bg-white/5">
          <CardContent className="p-3 text-xs text-white/60 whitespace-pre-wrap">
            {thinking}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

- [ ] **Step 2: Create message item component**

```typescript
// frontend/src/features/agent/components/message-item.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThinkingBlock } from "./thinking-block";
import type { Message } from "../types";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isAgent = message.role === "agent";
  const isSystem = message.role === "system";
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="outline" className="text-xs">
          {message.content}
        </Badge>
      </div>
    );
  }
  
  return (
    <div className={cn("flex gap-3", !isAgent && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback>
          {isAgent ? "🤖" : "👤"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 max-w-2xl">
        <Card className={cn(
          !isAgent && "bg-indigo-500/10 border-indigo-500/20"
        )}>
          <CardContent className="p-4">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </CardContent>
        </Card>
        
        {/* Agent Thinking (collapsible) */}
        {message.metadata?.thinking && (
          <ThinkingBlock thinking={message.metadata.thinking} />
        )}
        
        {/* Actions Taken */}
        {message.metadata?.actions && message.metadata.actions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.metadata.actions.map((action, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                Ran: {action}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit message components**

```bash
cd frontend
git add src/features/agent/components/message-item.tsx src/features/agent/components/thinking-block.tsx
git commit -m "feat(agent): add message item and thinking block components

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Approval Card Component

**Files:**
- Create: `frontend/src/features/agent/components/approval-card.tsx`

- [ ] **Step 1: Create approval card component**

```typescript
// frontend/src/features/agent/components/approval-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useApproveAction } from "../hooks/use-approve-action";
import type { ApprovalData } from "../types";

interface ApprovalCardProps {
  approval: ApprovalData;
  sessionId: string;
}

export function ApprovalCard({ approval, sessionId }: ApprovalCardProps) {
  const approveAction = useApproveAction(sessionId);
  const [showTechnical, setShowTechnical] = useState(false);
  
  return (
    <Card className="border-yellow-500/30 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Approval Required
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/40 text-xs mb-1">Duration</div>
            <div className="font-medium">{approval.time_minutes} minutes</div>
          </div>
          <div>
            <div className="text-white/40 text-xs mb-1">Estimated Cost</div>
            <div className="font-medium">${approval.cost.toFixed(2)}</div>
          </div>
        </div>
        
        {approval.description && (
          <p className="text-sm text-white/60">{approval.description}</p>
        )}
        
        {/* Technical Details (collapsible) */}
        {approval.technical && (
          <Collapsible open={showTechnical} onOpenChange={setShowTechnical}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                {showTechnical ? "Hide" : "Show"} Technical Details
                <ChevronDown className={cn(
                  "ml-2 h-4 w-4 transition-transform",
                  showTechnical && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-2 text-xs text-white/60">
                {approval.technical.nodes && (
                  <div>Nodes: {approval.technical.nodes.join(", ")}</div>
                )}
                {approval.technical.qubits && (
                  <div>Qubits: {approval.technical.qubits}</div>
                )}
                {approval.technical.circuit_depth && (
                  <div>Circuit depth: {approval.technical.circuit_depth}</div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button 
          variant="default"
          className="flex-1"
          onClick={() => approveAction.mutate(true)}
          disabled={approveAction.isPending}
        >
          Approve & Run
        </Button>
        <Button 
          variant="outline"
          onClick={() => approveAction.mutate(false)}
          disabled={approveAction.isPending}
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
```

- [ ] **Step 2: Commit approval card**

```bash
cd frontend
git add src/features/agent/components/approval-card.tsx
git commit -m "feat(agent): add approval card component with technical details

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Chat Input Component

**Files:**
- Create: `frontend/src/features/agent/components/chat-input.tsx`

- [ ] **Step 1: Create chat input component**

```typescript
// frontend/src/features/agent/components/chat-input.tsx
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useSendMessage } from "../hooks/use-send-message";
import { AGENT_LIMITS } from "@/constants/agent";

interface ChatInputProps {
  sessionId: string | null;
}

export function ChatInput({ sessionId }: ChatInputProps) {
  const [input, setInput] = useState("");
  const sendMessage = useSendMessage(sessionId);
  
  const handleSend = () => {
    if (!input.trim() || !sessionId) return;
    
    sendMessage.mutate(
      { content: input },
      {
        onSuccess: () => {
          setInput("");
        },
      }
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="border-t border-white/10 p-4">
      <div className="max-w-3xl mx-auto flex gap-2">
        <Textarea
          placeholder="Describe your experiment goal..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="resize-none"
          rows={1}
          maxLength={AGENT_LIMITS.MAX_MESSAGE_LENGTH}
          disabled={!sessionId || sendMessage.isPending}
        />
        <Button 
          onClick={handleSend}
          disabled={!input.trim() || !sessionId || sendMessage.isPending}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {input.length > AGENT_LIMITS.MAX_MESSAGE_LENGTH * 0.9 && (
        <div className="text-xs text-white/40 text-center mt-2">
          {input.length} / {AGENT_LIMITS.MAX_MESSAGE_LENGTH} characters
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit chat input**

```bash
cd frontend
git add src/features/agent/components/chat-input.tsx
git commit -m "feat(agent): add chat input component with keyboard shortcuts

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Progress Card Component

**Files:**
- Create: `frontend/src/features/agent/components/progress-card.tsx`

- [ ] **Step 1: Create progress card component**

```typescript
// frontend/src/features/agent/components/progress-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Workflow } from "../types";

interface ProgressCardProps {
  workflow: Workflow;
}

export function ProgressCard({ workflow }: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {workflow.current_step_name || "Processing..."}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={workflow.progress_percent} />
        <div className="text-xs text-white/60">
          {workflow.progress_percent.toFixed(0)}% complete
        </div>
        <div className="text-xs text-white/40">
          Step {workflow.current_step + 1} of {workflow.total_steps}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit progress card**

```bash
cd frontend
git add src/features/agent/components/progress-card.tsx
git commit -m "feat(agent): add progress card component

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Session Sidebar Component

**Files:**
- Create: `frontend/src/features/agent/components/session-sidebar.tsx`

- [ ] **Step 1: Create session sidebar component**

```typescript
// frontend/src/features/agent/components/session-sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useAgentSessions } from "../hooks/use-agent-sessions";
import { useCreateSession } from "../hooks/use-create-session";
import { useAgentStore } from "../stores/agent-store";
import { SessionCard } from "./session-card";
import { BudgetIndicator } from "./budget-indicator";

export function SessionSidebar() {
  const { data: sessions, isLoading } = useAgentSessions();
  const createSession = useCreateSession();
  const setActiveSession = useAgentStore((s) => s.setActiveSession);
  
  const handleNewSession = () => {
    createSession.mutate({}, {
      onSuccess: (newSession) => {
        setActiveSession(newSession.session_id);
      },
    });
  };
  
  return (
    <div className="w-60 border-r border-white/10 bg-background flex flex-col">
      {/* New Session Button */}
      <div className="p-3">
        <Button 
          className="w-full" 
          variant="default"
          onClick={handleNewSession}
          disabled={createSession.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Agent Session
        </Button>
      </div>
      
      <Separator />
      
      {/* Budget Indicator */}
      <BudgetIndicator />
      
      <Separator />
      
      {/* Session List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading && (
            <div className="text-sm text-white/40 text-center py-8">
              Loading sessions...
            </div>
          )}
          {sessions && sessions.length === 0 && (
            <div className="text-sm text-white/40 text-center py-8">
              No sessions yet. Create one to start!
            </div>
          )}
          {sessions?.map((session) => (
            <SessionCard key={session.session_id} session={session} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

- [ ] **Step 2: Commit session sidebar**

```bash
cd frontend
git add src/features/agent/components/session-sidebar.tsx
git commit -m "feat(agent): add session sidebar with new session creation

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Conversation Panel Component

**Files:**
- Create: `frontend/src/features/agent/components/conversation-panel.tsx`

- [ ] **Step 1: Create conversation panel component**

```typescript
// frontend/src/features/agent/components/conversation-panel.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentSession } from "../hooks/use-agent-session";
import { useAgentStream } from "../hooks/use-agent-stream";
import { useAgentStore } from "../stores/agent-store";
import { MessageItem } from "./message-item";
import { ApprovalCard } from "./approval-card";
import { ChatInput } from "./chat-input";
import { useEffect, useRef } from "react";

interface ConversationPanelProps {
  sessionId: string | null;
}

export function ConversationPanel({ sessionId }: ConversationPanelProps) {
  const { data: session } = useAgentSession(sessionId);
  const pendingApproval = useAgentStore((s) => s.pendingApproval);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // WebSocket streaming
  useAgentStream(sessionId);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages.length]);
  
  if (!sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No Session Selected</h3>
          <p className="text-sm text-white/60">
            Create a new session or select an existing one to start
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6 max-w-3xl mx-auto">
          {session?.messages.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Welcome to Agent Mode
              </h3>
              <p className="text-sm text-white/60 max-w-md mx-auto">
                Describe your experiment goals in natural language. The agent will
                understand your intent and orchestrate the necessary tools automatically.
              </p>
            </div>
          )}
          
          {session?.messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {/* Pending Approval */}
          {pendingApproval && pendingApproval.sessionId === sessionId && (
            <div className="mt-6">
              <ApprovalCard 
                approval={pendingApproval.data}
                sessionId={sessionId}
              />
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <ChatInput sessionId={sessionId} />
    </div>
  );
}
```

- [ ] **Step 2: Commit conversation panel**

```bash
cd frontend
git add src/features/agent/components/conversation-panel.tsx
git commit -m "feat(agent): add conversation panel with auto-scroll and approval display

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Execution Context Component

**Files:**
- Create: `frontend/src/features/agent/components/execution-context.tsx`

- [ ] **Step 1: Create execution context component**

```typescript
// frontend/src/features/agent/components/execution-context.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAgentSession } from "../hooks/use-agent-session";
import { useAgentStore } from "../stores/agent-store";
import { ProgressCard } from "./progress-card";

interface ExecutionContextProps {
  sessionId: string | null;
}

export function ExecutionContext({ sessionId }: ExecutionContextProps) {
  const { data: session } = useAgentSession(sessionId);
  const { executionView, setExecutionView } = useAgentStore();
  
  if (!sessionId || !session) {
    return (
      <div className="w-96 border-l border-white/10 bg-background flex items-center justify-center">
        <div className="text-sm text-white/40 text-center p-6">
          Select a session to view execution details
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-96 border-l border-white/10 bg-background flex flex-col">
      <Tabs value={executionView} onValueChange={(v) => setExecutionView(v as any)} className="flex-1 flex flex-col">
        <div className="border-b border-white/10 px-4 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="results" className="flex-1">Results</TabsTrigger>
            <TabsTrigger value="technical" className="flex-1">Technical</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Results View */}
        <TabsContent value="results" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* Progress Card */}
              {session.workflow && (
                <ProgressCard workflow={session.workflow} />
              )}
              
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Cost</span>
                    <span className="font-medium">${session.cost.actual.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Time Elapsed</span>
                    <span className="font-medium">
                      {Math.floor(session.time.elapsed_seconds / 60)}m {session.time.elapsed_seconds % 60}s
                    </span>
                  </div>
                  {session.workflow && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Steps Completed</span>
                      <span className="font-medium">
                        {session.workflow.completed_steps} / {session.workflow.total_steps}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Results (when available) */}
              {session.results && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs text-white/80 whitespace-pre-wrap overflow-auto max-h-96">
                      {JSON.stringify(session.results, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Technical View */}
        <TabsContent value="technical" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* Workflow Steps */}
              {session.workflow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Workflow Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {session.workflow.steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                        <Badge variant={
                          step.status === "completed" ? "secondary" :
                          step.status === "running" ? "default" :
                          step.status === "failed" ? "destructive" :
                          "outline"
                        } className="shrink-0 text-xs">
                          {step.status}
                        </Badge>
                        <span className="text-sm flex-1">{step.name}</span>
                        {step.progress_percent !== undefined && (
                          <span className="text-xs text-white/40">{step.progress_percent}%</span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Logs View */}
        <TabsContent value="logs" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 font-mono text-xs space-y-1">
              {session.logs && session.logs.length > 0 ? (
                session.logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-white/40 shrink-0">{log.timestamp}</span>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {log.level}
                    </Badge>
                    <span className="text-white/80">{log.message}</span>
                  </div>
                ))
              ) : (
                <div className="text-white/40 text-center py-12">
                  No logs yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 2: Commit execution context**

```bash
cd frontend
git add src/features/agent/components/execution-context.tsx
git commit -m "feat(agent): add execution context with results/technical/logs views

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 18: Agent Workspace Container & Barrel Exports

**Files:**
- Create: `frontend/src/features/agent/components/agent-workspace.tsx`
- Create: `frontend/src/features/agent/index.ts`

- [ ] **Step 1: Create agent workspace container**

```typescript
// frontend/src/features/agent/components/agent-workspace.tsx
"use client";

import { SessionSidebar } from "./session-sidebar";
import { ConversationPanel } from "./conversation-panel";
import { ExecutionContext } from "./execution-context";
import { useAgentStore } from "../stores/agent-store";

export function AgentWorkspace() {
  const activeSessionId = useAgentStore((s) => s.activeSessionId);
  
  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-background">
      {/* Left: Session History */}
      <SessionSidebar />
      
      {/* Center: Conversation */}
      <ConversationPanel sessionId={activeSessionId} />
      
      {/* Right: Execution Context */}
      <ExecutionContext sessionId={activeSessionId} />
    </div>
  );
}
```

- [ ] **Step 2: Create barrel exports**

```typescript
// frontend/src/features/agent/index.ts
export { AgentWorkspace } from "./components/agent-workspace";
export { SessionSidebar } from "./components/session-sidebar";
export { ConversationPanel } from "./components/conversation-panel";
export { ExecutionContext } from "./components/execution-context";

export { useAgentSessions } from "./hooks/use-agent-sessions";
export { useAgentSession } from "./hooks/use-agent-session";
export { useCreateSession } from "./hooks/use-create-session";
export { useSendMessage } from "./hooks/use-send-message";
export { useApproveAction } from "./hooks/use-approve-action";
export { useAgentStream } from "./hooks/use-agent-stream";
export { useBudgetStatus } from "./hooks/use-budget-status";

export { useAgentStore } from "./stores/agent-store";

export type * from "./types";
```

- [ ] **Step 3: Commit agent workspace and exports**

```bash
cd frontend
git add src/features/agent/components/agent-workspace.tsx src/features/agent/index.ts
git commit -m "feat(agent): add agent workspace container and barrel exports

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## MILESTONE 2: Frontend Complete ✅

**Checkpoint:** Full agent workspace UI functional (without backend)

- [ ] **Test frontend**

```bash
cd frontend
bun dev
```

Open http://localhost:3000, toggle to Agent mode, verify:
- UI renders correctly (3-panel layout)
- New session button shows
- Session list displays
- Conversation panel ready
- Execution context tabs work

- [ ] **Commit Milestone 2**

```bash
cd frontend
git add .
git commit -m "milestone(agent): complete frontend UI - full agent workspace

- Session sidebar with budget tracking
- Conversation panel with message items, thinking blocks, approval cards
- Execution context with results/technical/logs tabs
- Chat input with keyboard shortcuts
- WebSocket streaming integration
- All UI components using shadcn/ui primitives

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

Now let's build the backend. This is a comprehensive backend implementation covering all agent orchestration logic.

## Task 19: Backend Dependencies

**Files:**
- Modify: `backend/pyproject.toml`

- [ ] **Step 1: Add anthropic SDK dependency**

Add to `[project.dependencies]` section:

```toml
"anthropic>=0.18.0",
```

- [ ] **Step 2: Install dependencies**

```bash
cd backend
uv sync
```

- [ ] **Step 3: Commit dependency update**

```bash
cd backend
git add pyproject.toml uv.lock
git commit -m "feat(agent): add Anthropic SDK dependency

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 20: Backend Data Models

**Files:**
- Create: `backend/src/quantum_backend_v2/agent/__init__.py`
- Create: `backend/src/quantum_backend_v2/agent/models.py`

- [ ] **Step 1: Create agent package init**

```python
# backend/src/quantum_backend_v2/agent/__init__.py
"""
Agent orchestration module for autonomous workflow execution.
"""
```

- [ ] **Step 2: Create Pydantic models**

```python
# backend/src/quantum_backend_v2/agent/models.py
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field
from bson import ObjectId


class Message(BaseModel):
    id: str
    role: Literal["user", "agent", "system"]
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class WorkflowStep(BaseModel):
    id: str
    tool: Literal["circuits", "pharma", "finance", "risk"]
    name: str
    status: Literal["pending", "running", "completed", "failed"]
    job_id: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    progress_percent: Optional[int] = None
    result: Optional[Dict[str, Any]] = None
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class Workflow(BaseModel):
    plan_id: str
    steps: List[WorkflowStep]
    current_step: int = 0
    current_step_name: Optional[str] = None
    approval_pending: bool = False
    approval_data: Optional[Dict[str, Any]] = None
    progress_percent: int = 0
    completed_steps: int = 0
    total_steps: int


class CostBreakdown(BaseModel):
    compute: float = 0.0
    storage: float = 0.0
    network: float = 0.0


class SessionCost(BaseModel):
    estimated: float = 0.0
    actual: float = 0.0
    breakdown: CostBreakdown = Field(default_factory=CostBreakdown)


class SessionTime(BaseModel):
    estimated_minutes: int = 0
    elapsed_seconds: int = 0


class SessionSettings(BaseModel):
    approval_mode: Literal["auto", "interactive"] = "auto"
    auto_approval_threshold: float = 5.0
    technical_detail_level: Literal["domain", "balanced", "full"] = "domain"


class LogEntry(BaseModel):
    timestamp: str
    level: Literal["info", "warning", "error", "debug"]
    message: str
    source: Optional[str] = None


class AgentSession(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    session_id: str
    title: str = "New Session"
    status: Literal["active", "paused", "completed", "failed"] = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List[Message] = Field(default_factory=list)
    workflow: Optional[Workflow] = None
    cost: SessionCost = Field(default_factory=SessionCost)
    time: SessionTime = Field(default_factory=SessionTime)
    settings: SessionSettings = Field(default_factory=SessionSettings)
    results: Optional[Dict[str, Any]] = None
    logs: List[LogEntry] = Field(default_factory=list)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            ObjectId: lambda v: str(v),
        }
        populate_by_name = True


class BudgetLimits(BaseModel):
    daily_usd: float = 50.0
    monthly_usd: float = 500.0
    per_session_usd: float = 100.0


class BudgetAlerts(BaseModel):
    email_on_budget_reached: bool = False
    warn_at_percentage: int = 80


class SpentTracking(BaseModel):
    daily_spent: float = 0.0
    monthly_spent: float = 0.0
    last_reset_daily: datetime = Field(default_factory=datetime.utcnow)
    last_reset_monthly: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class AgentSettings(BaseModel):
    approval_mode: Literal["auto", "interactive"] = "auto"
    auto_approval_threshold: float = 5.0
    technical_detail_level: Literal["domain", "balanced", "full"] = "domain"
    budget_limits: BudgetLimits = Field(default_factory=BudgetLimits)
    alerts: BudgetAlerts = Field(default_factory=BudgetAlerts)
    spent_tracking: SpentTracking = Field(default_factory=SpentTracking)


class BudgetStatus(BaseModel):
    daily_limit: float
    daily_spent: float
    monthly_limit: float
    monthly_spent: float
```

- [ ] **Step 3: Commit data models**

```bash
cd backend
git add src/quantum_backend_v2/agent/__init__.py src/quantum_backend_v2/agent/models.py
git commit -m "feat(agent): add Pydantic data models for sessions and workflows

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

This plan is getting very long. I'll continue with the critical backend tasks. Let me know if you want me to keep going with the full backend implementation or if you'd like to start executing what we have so far!