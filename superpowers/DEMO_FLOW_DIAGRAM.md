# 3-Minute Demo Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         3-MINUTE DEMO FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

                            START TIMER ⏱️
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│  0:00-0:30 | OPENING                                    | Cmd+1        │
│─────────────────────────────────────────────────────────────────────────│
│  SHOW: Dashboard with 3D network graph                                 │
│                                                                         │
│  SAY: "Thesis: agents join networks, not call APIs"                    │
│       "Green = workers, Blue = AI agents with wallets"                 │
│       "Watch what happens when we submit proposal"                     │
│                                                                         │
│  ACTION: Point to graph, show peer connections                         │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Press Cmd+2
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│  0:30-1:30 | AGENT FUNDING                              | Cmd+2        │
│─────────────────────────────────────────────────────────────────────────│
│  SHOW: Basescan transaction page (pre-loaded)                          │
│                                                                         │
│  SAY: "Agent received GossipSub notification"                          │
│       "Analyzed with Claude 3.5"                                       │
│       "Funded with $10 USDC"                                           │
│       "Real blockchain transaction - agent autonomously decided"       │
│                                                                         │
│  ACTION: Point to From/To/Value/Status fields                          │
│                                                                         │
│  KEY PHRASE: "Agents with economic agency"                             │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Press Cmd+3
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│  1:30-2:30 | DISTRIBUTED EXECUTION                      | Cmd+3        │
│─────────────────────────────────────────────────────────────────────────│
│  SHOW: Results page (pre-loaded)                                       │
│                                                                         │
│  SAY: "Workers discovered via libp2p DHT"                              │
│       "Executed peer-to-peer"                                          │
│       "Results stored on IPFS"                                         │
│       [Scroll to CID]                                                  │
│       "This CID is a cryptographic hash"                               │
│       "Don't trust me - verify the hash"                               │
│                                                                         │
│  ACTION: Scroll to show IPFS CID clearly                               │
│                                                                         │
│  KEY PHRASE: "All autonomous. All verifiable."                         │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Stay on current tab
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│  2:30-3:00 | CLOSING                                    | Any          │
│─────────────────────────────────────────────────────────────────────────│
│  SHOW: Stay on results OR switch back to dashboard (optional)          │
│                                                                         │
│  SAY: "Coordination: libp2p"                                           │
│       "Storage: IPFS"                                                  │
│       "Incentives: Blockchain"                                         │
│       "Intelligence: Claude 3.5"                                       │
│       "Give agents wallets, peer identity, CIDs = composable infra"   │
│                                                                         │
│  KEY PHRASE: "Protocols over platforms. Thank you."                    │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                            STOP AT 3:00 ⏱️
```

---

## Visual Timeline

```
0:00 ├──────────┤ 0:30 ├────────────────────┤ 1:30 ├────────────────────┤ 2:30 ├────────┤ 3:00
     │          │      │                    │      │                    │      │        │
   Opening   SWITCH   Agent Funding      SWITCH  Distributed Exec    SWITCH  Closing  STOP
             Cmd+2                        Cmd+3                        Any
```

---

## Tab State Diagram

```
┌─────────────┐
│   Cmd+1     │ ◄─── START HERE
│  Dashboard  │
└──────┬──────┘
       │
       │ 0:30
       ▼
┌─────────────┐
│   Cmd+2     │
│  Basescan   │
└──────┬──────┘
       │
       │ 1:30
       ▼
┌─────────────┐
│   Cmd+3     │
│  Results    │
└──────┬──────┘
       │
       │ 2:30
       ▼
┌─────────────┐
│ Stay or     │
│ Cmd+1 back  │
└─────────────┘
```

---

## Conceptual Flow (What You're Proving)

```
┌──────────────────────────────────────────────────────────────────┐
│                       THESIS                                     │
│   "AI agents should join networks, not call APIs"               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  PROOF 1: Economic Agency     │
         │  Agent has wallet → funds     │
         │  autonomously → blockchain    │
         │  verifiable                   │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │  PROOF 2: Peer Coordination   │
         │  libp2p DHT → GossipSub →    │
         │  P2P streams → no API gateway │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │  PROOF 3: Content Addressing  │
         │  IPFS CID → cryptographic     │
         │  verification → no trust      │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │        CONCLUSION             │
         │  "Protocols over platforms"   │
         └───────────────────────────────┘
```

---

## Emergency Decision Tree

```
                    Is everything working?
                            │
            ┌───────────────┴───────────────┐
            │                               │
           YES                             NO
            │                               │
            ▼                               ▼
    Follow standard flow         Is dashboard working?
    (Cmd+1 → Cmd+2 → Cmd+3)              │
                                 ┌────────┴────────┐
                                 │                 │
                                YES               NO
                                 │                 │
                                 ▼                 ▼
                    Skip opening,       Is Basescan working?
                    go straight to              │
                    Basescan proof      ┌───────┴───────┐
                                        │               │
                                       YES             NO
                                        │               │
                                        ▼               ▼
                            Start at        Use 90-second
                            Basescan,       nuclear option
                            show wallet     (talk with hands,
                            history         show Basescan
                                           on phone)
```

---

## Key Moments (Don't Miss These)

```
┌──────────────────────────────────────────────────────────────┐
│ ⭐ MOMENT 1: "Watch what happens when we submit proposal"    │
│    → Builds anticipation                                     │
├──────────────────────────────────────────────────────────────┤
│ ⭐ MOMENT 2: Basescan transaction visible                    │
│    → "No human approved this" (pause here)                  │
├──────────────────────────────────────────────────────────────┤
│ ⭐ MOMENT 3: IPFS CID on screen                             │
│    → "Don't trust me - verify the hash"                     │
├──────────────────────────────────────────────────────────────┤
│ ⭐ MOMENT 4: "Protocols over platforms"                      │
│    → Final mic drop line                                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Pacing Guide

```
Opening:    ████████░░░░░░░░░░░░░░ (Fast - set stage quickly)
Agent:      ██████████████░░░░░░░░ (Medium - this is key proof)
Execution:  ████████████████░░░░░░ (Medium-fast - show CID clearly)
Closing:    ████████████████████░░ (Fast - punch line and done)
```

---

## Backup Timeline (If Running Over at 2:45)

```
2:45 ├─ Still on Basescan?      → Jump straight to: "Protocols over platforms. Thank you."
     │
     ├─ On Results page?         → Show CID, say: "IPFS verification. Protocols over platforms. Thank you."
     │
     └─ Already in closing?      → Speed up, cut examples, end at "Thank you."
```

---

## Success Checklist

✅ Opened on dashboard (Cmd+1)  
✅ Showed Basescan transaction (Cmd+2)  
✅ Showed IPFS CID (Cmd+3)  
✅ Said "Protocols over platforms"  
✅ Stopped talking before 3:00  

**If you hit all 5, you nailed it. 🚀**

---

## Post-Demo

**If they clap**: Smile, wait for questions  
**If silence**: "Happy to take questions"  
**If time for Q&A**: Use Q&A section from main doc  
**If no time**: "GitHub link is [URL], happy to connect offline"

---

**Print this diagram. Keep it visible during demo.**
