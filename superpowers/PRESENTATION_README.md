# Ground Truth Presentation Materials

**Event**: Ground Truth: Libp2p and IPFS for AI/ML  
**Duration**: 3 minutes  
**Theme**: Composability for Agentic Systems  
**Date**: 2026-05-20

---

## 📚 Files Overview

### **1. GROUND_TRUTH_PRESENTATION.md** (24KB) - The Complete Guide
**Purpose**: Comprehensive presentation guide with full context, Q&A prep, backup plans

**Use When**:
- First time preparing (read everything)
- Need to understand the "why" behind decisions
- Preparing for Q&A session
- Creating slides or visuals
- 1+ days before presentation

**Key Sections**:
- Full speech script (3-minute version)
- Demo flow with detailed timing
- Q&A preparation (7 expected questions)
- Emergency backup plans
- Technical setup instructions

---

### **2. 3MIN_SCRIPT.md** (3.7KB) - Word-for-Word Script
**Purpose**: Exact words to say during the 3-minute demo

**Use When**:
- Practicing with a timer
- During actual presentation (can read verbatim)
- Need to memorize opening/closing
- 1-2 hours before presentation

**Key Features**:
- 380 words (~2:55 at 130 WPM)
- Timed sections (0:00-0:30, 0:30-1:30, etc.)
- Tab switching cues (Cmd+1, Cmd+2, Cmd+3)
- Emergency cut instructions if running over

**Memorize These**:
- Opening: "My name is Soham. Thesis: AI agents shouldn't call APIs..."
- Closing: "Protocols over platforms. Thank you."

---

### **3. DEMO_CHEAT_SHEET.md** (3.3KB) - One-Page Reference
**Purpose**: Quick reference you can print and keep next to you during demo

**Use When**:
- During actual presentation (glance at it)
- 5 minutes before going on stage
- Need quick reminders without reading full script
- Forgot a key point mid-demo

**Key Contents**:
- Timing table (one glance = know where you are)
- Key points (don't forget these)
- Emergency pivots (if X breaks, do Y)
- Pre-demo checklist
- Tab shortcuts
- Opening/closing memorization aids

**🖨️ PRINT THIS** - Keep it on your desk during demo

---

### **4. DEMO_FLOW_DIAGRAM.md** (15KB) - Visual Flowcharts
**Purpose**: Visual representation of the demo flow, timing, and decision trees

**Use When**:
- Visual learner (diagrams > text)
- Need to understand overall structure
- Preparing backup plans
- Explaining to someone else

**Key Diagrams**:
- 3-minute timeline (ASCII art)
- Tab state diagram (when to switch)
- Conceptual flow (what you're proving)
- Emergency decision tree (if things break)
- Key moments (don't miss these)

---

## 🚀 Quick Start Guide

### **3 Days Before**
1. Read `GROUND_TRUTH_PRESENTATION.md` (full guide)
2. Understand the thesis and composability theme
3. Set up backend + frontend, ensure they run
4. Generate test transactions and results

### **1 Day Before**
1. Read `3MIN_SCRIPT.md` (exact words)
2. Practice with timer 3 times
3. Print `DEMO_CHEAT_SHEET.md`
4. Bookmark critical URLs (dashboard, Basescan, results)

### **1 Hour Before**
1. Run pre-demo setup (see GROUND_TRUTH_PRESENTATION.md)
2. Submit proposal → wait for agent funding → bookmark TX
3. Submit circuit → wait for results → bookmark page
4. Open only 4 tabs: Dashboard, Basescan, Results, Terminal
5. Practice tab switching (Cmd+1, Cmd+2, Cmd+3)

### **5 Minutes Before**
1. Glance at `DEMO_CHEAT_SHEET.md`
2. Close all other tabs and apps
3. Start on dashboard (Cmd+1)
4. Set phone timer for 3:00
5. Deep breath

### **During Demo**
1. Start timer as you say first word
2. Follow `3MIN_SCRIPT.md` or cheat sheet
3. Switch tabs at exactly 0:30, 1:30
4. Stop talking at 2:55-3:00

---

## 📋 Pre-Demo Checklist

### **30 Minutes Before**
- [ ] Backend running (`cd backend && make run-clean`)
- [ ] Frontend running (`cd frontend && npm run dev`)
- [ ] 4+ workers visible in dashboard
- [ ] AI agent wallet funded on Basescan
- [ ] **Submit test proposal** → agent funds → bookmark TX hash
- [ ] **Submit test circuit** → results ready → bookmark results page
- [ ] Only 4 browser tabs open
- [ ] Practice script with timer one final time

### **5 Minutes Before**
- [ ] Start on dashboard (Cmd+1)
- [ ] Cheat sheet printed and visible
- [ ] Phone timer ready
- [ ] All notifications silenced
- [ ] Water nearby

---

## ⏱️ Timing Summary

| Section | Duration | Tab | Key Line |
|---------|----------|-----|----------|
| Opening | 30 sec | Cmd+1 | "Agents join networks, not call APIs" |
| Agent Funding | 60 sec | Cmd+2 | "No human approved this" |
| Execution | 60 sec | Cmd+3 | "Don't trust me - verify the hash" |
| Closing | 30 sec | Any | "Protocols over platforms" |

**Total**: 3:00 (target 2:50-2:55 for buffer)

---

## 🎯 Core Thesis

**One Sentence**: "AI agents should join networks as first-class peers, not call APIs as clients."

**Proof Points**:
1. ✅ **Economic agency**: Agents have wallets (AgentKit), autonomously fund research (Basescan)
2. ✅ **Peer coordination**: libp2p DHT for discovery, GossipSub for events, no API gateway
3. ✅ **Verifiable storage**: IPFS CIDs, cryptographic hashes, no trust required
4. ✅ **Autonomous intelligence**: Claude 3.5 analyzes, decides, executes

**Conclusion**: "Protocols over platforms"

---

## 🔑 Critical URLs to Bookmark

Before demo, generate these and bookmark:

1. **Dashboard**: `http://localhost:3000/dashboard`
2. **Basescan Transaction**: `https://sepolia.basescan.org/tx/[YOUR_TX_HASH]`
3. **Results Page**: `http://localhost:3000/runs/[YOUR_JOB_ID]`
4. **(Optional) Terminal**: Keep visible but minimized

---

## 🆘 Emergency Scenarios

### **If Dashboard Won't Load**
→ Skip to Basescan (Cmd+2), say "Network running in background"

### **If Basescan Transaction Missing**
→ Show agent wallet address history instead  
→ `https://sepolia.basescan.org/address/[AGENT_WALLET]`

### **If Results Page Broken**
→ Show MongoDB Compass with IPFS CID  
→ OR show terminal logs with CID

### **If Everything Broken**
→ Use 90-second nuclear option speech (in GROUND_TRUTH_PRESENTATION.md)  
→ Show Basescan on phone if needed

---

## 💡 Speed Hacks

**Talk 1.5x Normal Speed**
- Practice with timer until this feels natural
- 130 words/minute target (380 words in 2:55)

**Cut ALL Filler Words**
- ❌ "um", "so", "basically", "actually", "you know"
- ✅ Direct statements only

**Point Instead of Describing**
- ❌ "That number on the left side that says 10"
- ✅ [Point] "This number"

**Use Keyboard Shortcuts**
- Cmd+1, Cmd+2, Cmd+3 for instant tab switching
- Practice until muscle memory

**Pre-Load Everything**
- All pages loaded before demo starts
- No waiting for anything to load

---

## 📊 Success Metrics

**You nailed it if**:
- ✅ Finished under 3:00
- ✅ Showed dashboard, Basescan, IPFS CID
- ✅ Said "Protocols over platforms"
- ✅ Audience understands thesis
- ✅ At least one "wow" moment (usually Basescan)

**You did great if**:
- ✅ Questions focus on "how" not "why"
- ✅ Someone asks for GitHub link
- ✅ Mentor nods during composability explanation
- ✅ No one looked confused

---

## 🎤 Recommended Practice Schedule

### **Day 1** (3 days before)
- Read full guide
- Practice script without timer (just read)
- Set up technical demo

### **Day 2** (2 days before)
- Practice with timer 3 times
- Identify sections where you're slow
- Generate test transactions and results

### **Day 3** (1 day before)
- Practice with timer 3 times (must finish <3:00)
- Memorize opening and closing
- Run full technical test

### **Demo Day** (morning of)
- Read script once more
- Practice opening and closing only
- Don't over-practice (stay fresh)

---

## 📞 Need Help?

**Technical Issues**:
- Check `backend/logs/app.log` for errors
- Verify workers: `curl http://localhost:8081/api/v1/discovery/peers | jq`
- Check agent wallet balance on Basescan

**Timing Issues**:
- If consistently over 3:00: Cut auto-fragmentation details, just say "AI analyzed"
- If consistently under 2:30: Add back details from full guide
- Target: 2:50-2:55

**Content Questions**:
- See Q&A section in GROUND_TRUTH_PRESENTATION.md
- 7 expected questions with answers

---

## 🎉 Post-Demo

**After presenting**:
1. Upload recording (if available)
2. Note what worked / what didn't in GROUND_TRUTH_PRESENTATION.md
3. Save any new questions you got (add to Q&A section)
4. Share GitHub link with attendees
5. Follow up with mentor on feedback

---

## 📁 File Sizes (For Reference)

```
GROUND_TRUTH_PRESENTATION.md  →  24 KB (comprehensive)
3MIN_SCRIPT.md               →  3.7 KB (exact words)
DEMO_CHEAT_SHEET.md          →  3.3 KB (print this)
DEMO_FLOW_DIAGRAM.md         →  15 KB (visual)
```

**Total**: ~46 KB of preparation materials

---

## 🚀 Final Reminders

1. **Pre-generate everything**: Don't wait for agent to analyze in real-time
2. **Start on dashboard**: Don't waste time navigating there
3. **Use tab shortcuts**: Cmd+1, Cmd+2, Cmd+3
4. **Talk fast but clear**: 1.5x normal speed
5. **Stop at 3:00**: Even if not done
6. **Confidence > perfection**: You got this!

---

**Everything you need is in these 4 files. Print the cheat sheet. Practice with timer. You'll crush it! 🚀**

---

## Quick Links

- **Full Guide**: [GROUND_TRUTH_PRESENTATION.md](./GROUND_TRUTH_PRESENTATION.md)
- **Exact Script**: [3MIN_SCRIPT.md](./3MIN_SCRIPT.md)
- **Cheat Sheet**: [DEMO_CHEAT_SHEET.md](./DEMO_CHEAT_SHEET.md) ← **PRINT THIS**
- **Flow Diagram**: [DEMO_FLOW_DIAGRAM.md](./DEMO_FLOW_DIAGRAM.md)
- **Project Context**: [AGENTKIT_CONTEXT.md](./AGENTKIT_CONTEXT.md)
- **Design Spec**: [specs/2026-05-20-agentkit-crowdfunding-design.md](./specs/2026-05-20-agentkit-crowdfunding-design.md)
