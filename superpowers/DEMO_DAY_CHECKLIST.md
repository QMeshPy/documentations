# Demo Day Checklist

**Event**: Ground Truth: Libp2p and IPFS for AI/ML  
**Date**: 2026-05-20  
**Duration**: 3 minutes

**🖨️ PRINT THIS AND CHECK BOXES AS YOU GO**

---

## 📅 3 Days Before Demo

- [ ] Read `GROUND_TRUTH_PRESENTATION.md` (complete guide)
- [ ] Understand core thesis: "Agents join networks, not call APIs"
- [ ] Verify backend runs: `cd backend && make run`
- [ ] Verify frontend runs: `cd frontend && npm run dev`
- [ ] Dashboard loads at `http://localhost:3000/dashboard`
- [ ] At least 4 worker nodes visible in dashboard
- [ ] AI agent configured in MongoDB (`ai_agents` collection)
- [ ] Agent wallet has address on Base Sepolia

---

## 📅 2 Days Before Demo

- [ ] Read `3MIN_SCRIPT.md` (exact words to say)
- [ ] Practice script out loud **3 times** with stopwatch
  - [ ] Run 1: ______ seconds (just read, don't worry about time)
  - [ ] Run 2: ______ seconds (try to finish under 3:00)
  - [ ] Run 3: ______ seconds (add pauses, still under 3:00)
- [ ] Identify slow sections, cut unnecessary words
- [ ] Print `DEMO_CHEAT_SHEET.md` (keep next to you during demo)
- [ ] Fund agent wallet with testnet USDC (use Base Sepolia faucet)
- [ ] Verify funds on Basescan: `https://sepolia.basescan.org/address/[AGENT_WALLET]`

---

## 📅 1 Day Before Demo

- [ ] Final practice with timer **3 times**
  - [ ] Run 1: ______ seconds
  - [ ] Run 2: ______ seconds
  - [ ] Run 3: ______ seconds
  - [ ] **Goal**: Consistently finish between 2:50-3:00
- [ ] Memorize opening: "My name is Soham. Thesis: AI agents shouldn't call APIs..."
- [ ] Memorize closing: "Protocols over platforms. Thank you."
- [ ] Review `DEMO_FLOW_DIAGRAM.md` (visualize the flow)
- [ ] Prepare clothing (look professional)
- [ ] Set multiple alarms for demo day morning
- [ ] Get good sleep (8 hours)

---

## 📅 Demo Day Morning (3-4 Hours Before)

- [ ] Eat a good breakfast (you'll be nervous, need energy)
- [ ] Read `3MIN_SCRIPT.md` once (refresh memory)
- [ ] Practice opening and closing only (don't over-practice)
- [ ] Charge laptop fully
- [ ] Charge phone (for timer)
- [ ] Test screen brightness (demo room might be bright)
- [ ] Pack:
  - [ ] Laptop
  - [ ] Charger
  - [ ] Phone (for timer)
  - [ ] Printed cheat sheet
  - [ ] Water bottle
  - [ ] Business cards (if you have them)

---

## 📅 1 Hour Before Demo

### **Technical Setup** (30 minutes)

- [ ] Start backend:
  ```bash
  cd backend
  make run-clean
  ```
- [ ] Wait for: "Uvicorn running on http://0.0.0.0:8081"
- [ ] Verify: `curl http://localhost:8081/api/v1/health` returns `{"status":"healthy"}`
- [ ] Start frontend:
  ```bash
  cd frontend  
  npm run dev
  ```
- [ ] Wait for: "Local: http://localhost:3000"
- [ ] Open dashboard: `http://localhost:3000/dashboard`
- [ ] Verify: 4+ workers visible in network graph

### **Generate Demo Artifacts** (15 minutes)

- [ ] Submit research proposal:
  ```bash
  curl -X POST http://localhost:8081/api/v1/proposals \
    -H "Content-Type: application/json" \
    -d '{
      "title": "QAOA Portfolio Optimization",
      "description": "Testing quantum advantage",
      "budget_required": 50.0,
      "deadline": "2026-05-27T00:00:00Z"
    }'
  ```
- [ ] Wait 30 seconds for agent to analyze and fund
- [ ] Check MongoDB `payments` collection for `transaction_hash`
- [ ] Copy transaction hash: `0x________________`
- [ ] Bookmark: `https://sepolia.basescan.org/tx/[TRANSACTION_HASH]`
- [ ] Submit quantum circuit:
  ```bash
  curl -X POST http://localhost:8081/api/v1/circuits/submit \
    -H "Content-Type: application/json" \
    -d '{
      "openqasm": "OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];\nmeasure q -> c;"
    }'
  ```
- [ ] Note job_id from response: `_______________`
- [ ] Wait 5 seconds for completion
- [ ] Bookmark: `http://localhost:3000/runs/[JOB_ID]`
- [ ] Open results page, verify IPFS CID is visible

### **Browser Setup** (10 minutes)

- [ ] Close ALL other tabs and apps
- [ ] Open exactly 4 tabs in order:
  - [ ] Tab 1 (Cmd+1): `http://localhost:3000/dashboard`
  - [ ] Tab 2 (Cmd+2): `https://sepolia.basescan.org/tx/[TRANSACTION_HASH]`
  - [ ] Tab 3 (Cmd+3): `http://localhost:3000/runs/[JOB_ID]`
  - [ ] Tab 4 (Cmd+4): Terminal (minimized, visible if needed)
- [ ] Practice switching: Cmd+1 → Cmd+2 → Cmd+3 (3 times)
- [ ] Verify all pages load instantly (no spinners)

### **Final Prep** (5 minutes)

- [ ] Position printed cheat sheet next to laptop
- [ ] Set phone timer to 3:00 (don't start yet)
- [ ] Test phone timer sound (make sure it's loud enough)
- [ ] Silence all notifications (laptop + phone)
- [ ] Set laptop brightness to 100%
- [ ] Close Slack, email, all distracting apps
- [ ] Have water nearby
- [ ] Use bathroom (seriously)

---

## 📅 5 Minutes Before Demo

- [ ] Open laptop to dashboard (Cmd+1)
- [ ] Glance at cheat sheet (don't read full script)
- [ ] Deep breath (3 slow breaths)
- [ ] Shake out hands (release tension)
- [ ] Stand up and stretch (if possible)
- [ ] Mentally rehearse opening line: "My name is Soham..."
- [ ] Mentally rehearse closing line: "Protocols over platforms. Thank you."
- [ ] Check laptop battery: >80%
- [ ] Check screen brightness: 100%
- [ ] Position laptop for audience visibility

---

## 📅 During Demo (3 Minutes)

### **Opening (0:00-0:30)** - Cmd+1

- [ ] **START PHONE TIMER** as you say first word
- [ ] Say: "My name is Soham. Thesis: AI agents shouldn't call APIs—they should join networks."
- [ ] Point to graph: "Green nodes are workers. Blue nodes are AI agents with wallets."
- [ ] Say: "No central coordinator. Watch what happens when we submit a research proposal."

### **Agent Funding (0:30-1:30)** - Cmd+2

- [ ] Press Cmd+2 (switch to Basescan)
- [ ] Say: "Agent received GossipSub notification, analyzed with Claude 3.5, funded with $10 USDC."
- [ ] Point to screen: "Real blockchain transaction. Agent wallet → Escrow → 10 USDC."
- [ ] Say: "No human approved this. Autonomous economic decision."

### **Execution (1:30-2:30)** - Cmd+3

- [ ] Press Cmd+3 (switch to results)
- [ ] Say: "Distributed quantum execution. Workers discovered via libp2p DHT. Results back in 3 seconds."
- [ ] Scroll to IPFS CID
- [ ] Say: "Stored on IPFS. That CID is a cryptographic hash. Don't trust me—verify the hash."

### **Closing (2:30-3:00)** - Any

- [ ] Say: "Coordination: libp2p. Storage: IPFS. Incentives: Blockchain. Intelligence: Claude."
- [ ] Say: "Give agents wallets, peer identity, CIDs—you get composable infrastructure."
- [ ] Say: "Protocols over platforms. Thank you."
- [ ] **STOP TALKING** (check timer: should be <3:00)

---

## 📅 Immediately After Demo

- [ ] Stop timer (note actual time: ______ seconds)
- [ ] Deep breath (you did it!)
- [ ] Wait for applause (don't fidget)
- [ ] If Q&A time: "Happy to take questions"
- [ ] If no time: "GitHub link is [URL], happy to connect"
- [ ] Smile and make eye contact with audience

---

## 📅 Post-Demo (Within 24 Hours)

- [ ] Write down what worked well:
  - _______________________________________________
  - _______________________________________________
  - _______________________________________________
- [ ] Write down what to improve next time:
  - _______________________________________________
  - _______________________________________________
  - _______________________________________________
- [ ] Note any unexpected questions received:
  - _______________________________________________
  - _______________________________________________
- [ ] Get mentor feedback:
  - _______________________________________________
  - _______________________________________________
- [ ] Share GitHub link with interested attendees
- [ ] Update `GROUND_TRUTH_PRESENTATION.md` with learnings
- [ ] Celebrate! 🎉

---

## 🚨 Emergency Checklist

**If something breaks during demo:**

- [ ] Don't panic (no one knows it broke)
- [ ] Don't apologize (don't call attention to it)
- [ ] Check emergency decision tree:
  - Dashboard won't load? → Skip to Basescan (Cmd+2)
  - Basescan transaction missing? → Show wallet address history
  - Results page broken? → Show terminal or MongoDB
  - Everything broken? → 90-second nuclear option (talk with hands)

---

## ⏱️ Time Checkpoints

Use these to stay on track:

- [ ] 0:30 - Should be switching to Basescan (Cmd+2)
- [ ] 1:30 - Should be switching to Results (Cmd+3)
- [ ] 2:30 - Should be starting closing statement
- [ ] 2:45 - **ALERT**: If not in closing yet, cut to "Protocols over platforms. Thank you."
- [ ] 3:00 - **STOP TALKING**

---

## 🎯 Success Criteria

**You nailed it if you:**

- [ ] Finished under 3:00
- [ ] Showed all 3 pages (dashboard, Basescan, results)
- [ ] Said "Protocols over platforms"
- [ ] Audience looked engaged (not confused)
- [ ] Got at least one good question

**You did GREAT if you:**

- [ ] Someone asked for GitHub link
- [ ] Mentor gave positive feedback
- [ ] Someone said "wow" or similar
- [ ] Questions were about "how" not "why"
- [ ] You felt confident throughout

---

## 📊 Practice Log

**Use this to track your practice runs:**

| Date | Time | Notes | Finish Time |
|------|------|-------|-------------|
| __/__  | Morning | First practice | __:__ |
| __/__  | Afternoon | Second practice | __:__ |
| __/__  | Evening | Third practice | __:__ |
| __/__  | Morning | Fourth practice | __:__ |
| __/__  | Afternoon | Fifth practice | __:__ |
| __/__  | Evening | Sixth practice | __:__ |
| __/__  | Morning | Final practice | __:__ |
| __/__  | **DEMO DAY** | **ACTUAL DEMO** | **__:__** |

**Goal**: Consistently finish between 2:50-3:00 by final practice

---

## 💪 Confidence Boosters

**Read these before going on stage:**

✅ You've practiced this script 6+ times  
✅ All your demo artifacts are pre-generated  
✅ You have 4 backup plans if things break  
✅ Your thesis is solid and well-researched  
✅ The technology actually works (you've tested it)  
✅ You know this material better than anyone in the room  
✅ Even if you mess up, the idea is strong  
✅ 3 minutes is short—it'll be over before you know it  
✅ You've prepared more than most presenters ever do  
✅ **You got this!** 🚀

---

## 🎤 Opening Line (Memorize This)

"My name is Soham. Thesis: AI agents shouldn't call APIs—they should join networks. This is a live libp2p network. Green nodes are workers. Blue nodes are AI agents with wallets. No central coordinator. Watch what happens when we submit a research proposal."

---

## 🎤 Closing Line (Memorize This)

"Coordination: libp2p. Storage: IPFS. Incentives: Blockchain. Intelligence: Claude. Traditional infrastructure assumes agents are API clients. Wrong. Give agents wallets, peer identity, CIDs—you get composable infrastructure. Protocols over platforms. Thank you."

---

**NOW GO CRUSH IT! 🚀🚀🚀**
