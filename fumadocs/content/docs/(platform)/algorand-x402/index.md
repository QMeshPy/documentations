---
title: "Algorand x402 overview"
description: "Algorand x402 payment integration overview."
---
> Moved here from the `distributed-quantum` README. For setup and verification commands see the [TestNet runbook](/docs/algorand-x402/runbook); for the design see [algorand-x402-design.md](/docs/algorand-x402/design).

> **QMeshPy is a decentralized quantum-computing service network where developers and autonomous agents can discover quantum workloads, pay seamlessly with Algorand USDC through x402, and trigger real distributed quantum circuit and quantum-finance computations across a libp2p mesh.**

QMeshPy turns distributed quantum computing into **discoverable, programmable, and pay-per-use network services**. The platform combines **FastAPI, Qiskit, py-libp2p, and Algorand x402** so that quantum capabilities can be exposed as services rather than requiring every developer, researcher, or application to operate its own quantum-computing infrastructure.

The Algorand x402 integration adds the missing **machine-to-machine payment layer**: a software client can discover a quantum service, determine the payment requirement, make an on-chain USDC payment, and invoke the computation programmatically.

### Why Algorand x402?

The problem QMeshPy addresses is twofold:

1. **Access to specialized quantum computation is difficult.** Developers, researchers, financial applications, and other software increasingly need specialized quantum workloads without necessarily operating their own quantum infrastructure.
2. **Distributed compute needs native machine payments.** A decentralized compute network needs a way for software clients and autonomous agents to discover a service, understand its price, pay programmatically, and receive the resulting computation without manual payment or account-management workflows.

Algorand x402 provides a natural payment rail for this model. HTTP requests can communicate the payment requirement through the standard `402 Payment Required` flow, while **Algorand USDC provides on-chain settlement** before the corresponding QMeshPy computation proceeds.

### What QMeshPy exposes

For the Algorand x402 integration, QMeshPy currently exposes two paid services:

| Service | Description | Payment flow | Execution |
|---|---|---|---|
| **Quantum Circuit Execution** | Submit quantum circuits for distributed execution | Algorand USDC via x402 | Distributed across the QMeshPy libp2p mesh |
| **QAE Options Pricing** | Run quantum-amplitude-estimation-based options pricing | Algorand USDC via x402 | QMeshPy quantum-finance execution pipeline |

The underlying platform separates circuit, finance, discovery, and enrollment services and connects them to distributed worker peers through py-libp2p.

### How the x402 request flow works

```text
┌───────────────────────┐
│ Developer / Agent     │
│ / Application         │
└──────────┬────────────┘
           │
           │ 1. Request quantum service
           ▼
┌─────────────────────────────────────┐
│ QMeshPy x402 Endpoint               │
│ POST /api/x402/quantum/runs         │
└──────────┬──────────────────────────┘
           │
           │ 2. No payment supplied
           ▼
      HTTP 402 Payment
        Required
           │
           │ 3. Client supplies x402 payment
           ▼
┌─────────────────────────────────────┐
│ GoPlausible x402 Facilitator         │
│ Bazaar discovery + route metadata    │
└──────────┬──────────────────────────┘
           │
           │ 4. Algorand USDC settlement
           ▼
┌─────────────────────────────────────┐
│ Algorand TestNet / MainNet           │
│ On-chain payment settlement          │
└──────────┬──────────────────────────┘
           │
           │ 5. Payment verified
           ▼
┌─────────────────────────────────────┐
│ QMeshPy Quantum Service              │
│ Circuit execution / QAE pricing      │
└──────────┬──────────────────────────┘
           │
           │ 6. Distributed execution
           ▼
┌─────────────────────────────────────┐
│ py-libp2p Worker Mesh                │
│ GossipSub + libp2p streams           │
└──────────┬──────────────────────────┘
           │
           │ 7. Result returned
           ▼
┌───────────────────────┐
│ Developer / Agent     │
│ receives computation  │
└───────────────────────┘
```

This creates a complete **request → payment → settlement → computation → result** lifecycle where payment is handled programmatically rather than through a manual checkout workflow.

### x402 integration details

The QMeshPy Algorand integration has the following characteristics:

- **Two paid endpoints:** quantum circuit execution and QAE options pricing.
- **GoPlausible facilitator:** both routes use the GoPlausible x402 facilitator.
- **Bazaar discovery:** x402 Bazaar discovery is enabled for the routes.
- **Global challenge metadata:** the `x402-global-challenge` tag is set in the route metadata.
- **HTTP 402 flow:** unpaid requests return a proper `402 Payment Required` response with the payment requirement.
- **Real Algorand USDC:** paid TestNet requests use real Algorand USDC rather than a mocked payment implementation.
- **On-chain settlement:** successful payments settle on-chain and increase the service receiver's balance.
- **Computation after payment:** once payment is settled, QMeshPy creates the corresponding quantum job and executes it.
- **Distributed execution:** quantum circuit jobs are dispatched through the QMeshPy py-libp2p mesh.
- **Real result:** the QAE options-pricing endpoint has completed successfully and returned a real computation result.

### Algorand TestNet configuration

The current integration is configured for Algorand TestNet.

The x402 endpoint is:

```text
POST /api/x402/quantum/runs
```

The platform acts as the **seller/service provider**. The seller only needs a public Algorand receiver address; private keys and mnemonics are not required by the QMeshPy repository.

The current TestNet configuration uses:

```dotenv
X402_ENABLED=true
X402_NETWORK=testnet
X402_AVM_ADDRESS=<Algorand receiver address>
X402_FACILITATOR_URL=https://facilitator.goplausible.xyz
X402_QUANTUM_RUN_PRICE=$0.01
```

The QMeshPy TestNet flow uses the Algorand USDC ASA:

```text
10458941
```

A complete setup and verification procedure is available in:

**[algorand-x402-runbook.md](https://github.com/QMeshPy/documentations/blob/main/algorand-x402/algorand-x402-runbook.md)**

The runbook covers receiver setup, TestNet funding, USDC opt-in, payer setup, environment variables, unpaid 402 verification, paid requests, and the MainNet transition.

---

## ✅ Algorand x402 TestNet Verification

The integration has been tested end-to-end against **Algorand TestNet** using real Algorand USDC.

The verification covered the complete payment and computation lifecycle:

1. Send an unpaid request.
2. Receive the expected HTTP `402 Payment Required`.
3. Provide the required x402 payment.
4. Settle the payment using Algorand USDC.
5. Verify the on-chain transaction.
6. Confirm that the service receiver balance increased.
7. Create the corresponding QMeshPy job.
8. Execute the workload through the QMeshPy execution infrastructure.
9. Return the computation result.

### Verified behavior

**Quantum circuit execution**

The paid circuit endpoint has been exercised against the QMeshPy distributed execution layer. Circuit jobs are routed through the py-libp2p mesh, where worker peers participate in the computation.

Two early test transactions exposed issues in the sample circuit itself rather than the payment flow. After correcting the circuit, the paid request completed successfully.

**QAE options pricing**

The paid options-pricing endpoint completed successfully after Algorand USDC settlement and returned a real computation result.

This is important because the TestNet verification is not only checking that an Algorand transaction exists: it verifies that **payment enables an actual downstream computation**.

### TestNet transaction evidence

#### 1. Quantum circuits — first paid call

The first paid circuit request successfully exercised the payment flow, but the resulting job failed because the submitted sample circuit was invalid.

**Transaction:**  
https://lora.algokit.io/testnet/transaction/XKHMXGIXMN3AWDZHXR2SNMTOLFXC2YUWNVCO5I4DLIWIHAT622RQ

**Result:** Payment flow exercised successfully; computation failed because of the sample circuit.

#### 2. QAE options pricing — successful

The options-pricing request completed successfully and returned a real result after payment settlement.

**Transaction:**  
https://lora.algokit.io/testnet/transaction/CRKLH5GMLK3WESENWBUO22VA7N6WFASUW2C6A5GYHCN7GYDMNVEQ

**Result:** Payment settled and QAE options-pricing job completed successfully.

#### 3. Quantum circuits — second paid call

A second circuit request was submitted after the initial test. The job reached execution but failed on the `measure q -> c` line in the submitted circuit.

**Transaction:**  
https://lora.algokit.io/testnet/transaction/NRWBXMIC6R5HZ6BKBL2C4ATYZC5ADM37SSAPZWIT3MEQ6KI2QIMQ

**Result:** Payment flow exercised successfully; computation failed on the circuit's measurement instruction.

#### 4. Quantum circuits — fixed circuit, successful

The circuit was corrected and submitted again. This time the paid request completed successfully and the job ran through the QMeshPy execution infrastructure.

**Transaction:**  
https://lora.algokit.io/testnet/transaction/M3EJCHKT6BZIDVBVQSVOK3S2AVMW367FKQDNK2LWHT6XBYSOC7IA

**Result:** Payment settled and the distributed quantum circuit job completed successfully.

### Test payer account

The Algorand TestNet payer account used for the paid integration tests is:

https://lora.algokit.io/testnet/account/YFBKZ4PSSKSOJNHUGXOK3GOBO5J7R2GXR57FPQLYKUJOTLIAWB7S7JY724

### What the TestNet results demonstrate

The successful tests demonstrate that QMeshPy can connect the following components into one machine-driven workflow:

```text
HTTP request
    ↓
x402 payment requirement
    ↓
Algorand USDC payment
    ↓
On-chain settlement
    ↓
Payment verification
    ↓
QMeshPy job creation
    ↓
libp2p distributed execution
    ↓
Quantum / quantum-finance result
```

The important distinction is that the Algorand transaction is not an isolated payment demonstration. The payment is directly connected to access to a computational service.

---

## 🔎 Discovery + Payment + Computation

QMeshPy is designed around a broader service-network model.

A future application or autonomous agent should not need to know which machine owns the quantum hardware or simulator. Instead, it should be able to:

1. **Discover** a quantum-capable service.
2. **Inspect** the service capability and payment requirement.
3. **Request** computation.
4. **Receive an HTTP 402** when payment is required.
5. **Pay programmatically** using Algorand USDC through x402.
6. **Wait for settlement and authorization.**
7. **Submit or trigger the quantum workload.**
8. **Receive the resulting computation.**

This makes quantum computation behave more like a programmable network resource.

The role of each layer is deliberately separated:

| Layer | Responsibility |
|---|---|
| **x402** | Standard payment-required interaction between client and service |
| **Algorand** | On-chain USDC payment and settlement |
| **GoPlausible** | x402 payment facilitation |
| **Bazaar** | Service discovery within the x402 ecosystem |
| **FastAPI** | QMeshPy service/API layer |
| **py-libp2p** | Peer discovery, communication, and distributed execution |
| **Qiskit** | Quantum circuit and quantum-finance computation |
| **Worker peers** | Distributed computation providers |

This separation allows QMeshPy to keep its decentralized execution model while adding a standardized economic interface for machine-to-machine computation.

---

## 🤖 Machine-to-Machine Quantum Services

One of the longer-term goals of QMeshPy is to make specialized computation accessible to **software rather than only human operators**.

For example, an autonomous financial agent could discover a QAE options-pricing service, determine that the service costs a specified amount of USDC, make the required Algorand payment through x402, and receive the resulting computation.

Likewise, a quantum application could discover a circuit-execution service, pay for execution, and submit a workload without manually managing a quantum-computing backend.

This creates a model where:

```text
Autonomous Agent
      │
      ├── Discover service
      │
      ├── Determine price
      │
      ├── Pay with Algorand USDC
      │
      ├── Invoke computation
      │
      └── Consume result
             │
             ▼
       QMeshPy Service
             │
             ▼
       libp2p Worker Mesh
```

Algorand x402 therefore provides an important economic primitive for QMeshPy: **machine-payable access to distributed computation**.

---

## 🌐 Vision: An Open Marketplace for Quantum Services

The long-term vision is an open network where independent compute providers can contribute quantum-capable worker nodes and applications can dynamically discover and pay for specialized quantum capabilities.

QMeshPy's architecture already moves in this direction through:

- distributed worker discovery;
- capability advertisements;
- peer-to-peer communication;
- distributed circuit execution;
- quantum-finance services;
- service-oriented APIs;
- and a roadmap toward an open node network and autonomous workloads.

The existing roadmap includes:

| Milestone | Theme |
|---|---|
| **M1** | Production SDK & Platform |
| **M2** | Bring Your Own Node Network |
| **M3** | Autonomous Research & Drug Discovery Platform |
| **M4** | Torrent-Native Service Network |
| **M5** | Hydra Self-Healing Network |

Within this architecture, **Algorand x402 provides the economic layer** that allows computational services to be consumed programmatically.

The goal is not simply to attach payments to a quantum API. The goal is to combine:

**discovery + capability + payment + distributed execution + results**

into a composable network primitive for quantum computing.

---

## 🏗️ Platform Architecture

QMeshPy combines a service/API layer with a decentralized execution layer:

```text
                         ┌───────────────────────────────┐
                         │ Developer / AI Agent / App    │
                         └───────────────┬───────────────┘
                                         │
                              x402 payment request
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │       QMeshPy API Layer       │
                         │                               │
                         │  Circuit Execution            │
                         │  QAE Options Pricing          │
                         │  Discovery / Enrollment       │
                         └───────────────┬───────────────┘
                                         │
                              payment verified
                                         │
                         ┌───────────────▼───────────────┐
                         │      FastAPI Coordinator       │
                         │                               │
                         │  Circuit Jobs │ Finance       │
                         └───────────────┬───────────────┘
                                         │
                              py-libp2p / GossipSub
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
             ┌────────────┐      ┌────────────┐      ┌────────────┐
             │ Worker     │      │ Worker     │      │ Worker     │
             │ Peer       │      │ Peer       │      │ Peer       │
             └────────────┘      └────────────┘      └────────────┘
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         │
                                         ▼
                              Quantum computation
                                         │
                                         ▼
                                  Result / Job
```

Algorand x402 is intentionally positioned at the service boundary. The payment layer does not replace the decentralized networking layer; it authorizes access to services that are then executed across the QMeshPy peer-to-peer infrastructure.

---

## 🔗 Algorand x402 Resources

- **QMeshPy Algorand x402 implementation:**  
  https://github.com/QMeshPy/distributed-quantum/tree/feat/algorand-x402

- **Algorand TestNet transaction — successful QAE options pricing:**  
  https://lora.algokit.io/testnet/transaction/CRKLH5GMLK3WESENWBUO22VA7N6WFASUW2C6A5GYHCN7GYDMNVEQ

- **Algorand TestNet transaction — successful fixed circuit:**  
  https://lora.algokit.io/testnet/transaction/M3EJCHKT6BZIDVBVQSVOK3S2AVMW367FKQDNK2LWHT6XBYSOC7IA

- **Algorand TestNet payer account:**  
  https://lora.algokit.io/testnet/account/YFBKZ4PSSKSOJNHUGXOK3GOBO5J7R2GXR57FPQLYKUJOTLIAWB7S7JY724

- **Complete x402 TestNet runbook:**  
  [algorand-x402/algorand-x402-runbook.md](https://github.com/QMeshPy/documentations/blob/main/algorand-x402/algorand-x402-runbook.md)
