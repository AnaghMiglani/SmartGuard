# Smart Guard: AI-based Fuzzer for Ethereum Smart Contracts (Refactored for Testnet Deployment)

<p align="center">
    <img width="500" alt="Smart Guard Logo" src="./assets/Logo.webp">
</p>

**This is a heavily modified and simplified version of the original Smart Guard fuzzer, adapted for direct interaction with a live Ethereum testnet (Educhain, in this case) via Web3.py. The original symbolic execution and imitation learning components are currently disabled.**  This README reflects the *current state* of this modified version, not the original Smart Guard project as described in the CCS'19 paper.

## Overview
[Demo Video](https://drive.google.com/file/d/1bAhxaTQzVBGD_ONA-RFutmCn65WGQVHc/view)
<br>
Smart Guard (Imitation Learning Fuzzer) is a tool designed to find vulnerabilities in Ethereum smart contracts. This refactored version uses a random fuzzing approach, generating transactions and sending them to a specified contract on a live testnet. It leverages the `web3.py` library for all blockchain interactions. While the original Smart Guard's core concept was to *learn* a fuzzing policy from symbolic execution traces, this functionality is *not* currently active in this version. This version is effectively a simplified, random fuzzer that works with a live testnet.

## Features (Current Version)

*   **Random Fuzzing:** Generates random transactions to interact with a deployed smart contract.
*   **Web3.py Integration:** Uses the `web3.py` library to communicate with the Ethereum blockchain (specifically, the Educhain Testnet in this configuration).
*   **Truffle Compatibility:** Designed to work with contracts deployed using the Truffle framework.
*   **Basic Transaction Observation:** Prints transaction receipts and basic log information to the console.  Includes basic checks for transaction success/failure.
*   **Configurable:** Supports setting the contract address, ABI path, RPC URL, and private key via command-line arguments.
*   **No Local EVM:** Does *not* use a local EVM or patched Geth. All interactions are with a live testnet.

## Features

*   **Imitation Learning:**  The original Smart Guard trained a neural network to mimic the transaction generation of a symbolic execution engine.  *This is not currently used in this version.*
*   **Symbolic Execution:** The original Smart Guard used symbolic execution to generate high-quality training data. *This is not currently used in this version.*
*   **Advanced Checkers:** The original Smart Guard included checkers for various vulnerability patterns (reentrancy, block state dependence, etc.).  *These are not currently used in this version.*
*   **Coverage Tracking (Advanced):** The original Smart Guard tracked code coverage based on the EVM's internal state. *This is not currently used in this version.*

## Setup and Installation

**Prerequisites:**

*   **Python 3.9+:**  (Python 3.9 or 3.10 recommended)
*   **Node.js and npm:** (Node.js 18.x LTS recommended) Required for Truffle.
*   **Truffle:**  `npm install -g truffle`
*   **Ganache:** `npm install -g ganache` (Although not strictly necessary for testnet deployment, Ganache may be needed for local development/testing of truffle and solidity files)
*   **Solidity Compiler (solc-select):** `python3 -m pip install solc-select`
    *   Then, install a specific Solidity version: `solc-select install 0.8.21` (or your desired version)
    *   And select it: `solc-select use 0.8.21`
*   **Ethereum Account with Testnet Ether:** You'll need an Ethereum account with funds on the EDUChain Testnet to deploy and interact with the contract.

**Installation:**

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Create and activate a virtual environment (recommended):**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Linux/macOS
    # venv\Scripts\activate  # Windows
    ```

3.  **Install Python dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Install `python-dotenv`:**

    ```bash
    pip install python-dotenv
    ```

5. **Install truffle dependencies:**

   ```bash
    cd example/crowdsale
    npm install
    cd ../..
   ```
**Configuration:**

1.  **`.env` file:**
    *   Create a `.env` file in the project's root directory.
    *   Add your private key:

        ```
        PRIVATE_KEY=0xYourPrivateKeyHere
        ```

        **Never commit your private key!** Add `.env` to your `.gitignore`.

2.  **`truffle-config.js`:**
    *   Modify `example/crowdsale/truffle-config.js` to connect to the EDUChain Testnet. The provided example in the previous responses shows how to do this using `@truffle/hdwallet-provider` and the `.env` file.

**Deployment (to EDUChain Testnet):**

1.  **Navigate to the `example/crowdsale` directory:**

    ```bash
    cd example/crowdsale
    ```

2.  **Compile the contract:**

    ```bash
    truffle compile
    ```

3.  **Deploy to EDUChain:**

    ```bash
    truffle migrate --network educhain
    ```

    *Record the deployed contract address.*

4.  **Copy the ABI JSON file:**  Copy the `Crowdsale.json` file from `example/crowdsale/build/contracts/` to the project's root directory.  This makes it easier to access the ABI from the main script.

    ```bash
    cp build/contracts/Crowdsale.json ../../
    ```

## Usage

```bash
python -m Smart Guard --contract_address <YOUR_CONTRACT_ADDRESS> --abi_path Crowdsale.json
```

*   **`--contract_address <YOUR_CONTRACT_ADDRESS>`:** (Required) The address of the deployed contract on the EDUChain Testnet.
*   **`--abi_path <PATH_TO_ABI>`:** (Required) The path to the contract's ABI JSON file (e.g., `Crowdsale.json`).
*   **`--rpc_url`**: (Optional) The RPC URL, that defaults to `https://rpc.open-campus-codex.gelato.digital`.
*   **`--limit`**: (Optional) The number of fuzzing iterations.

**Example:**

```bash
python -m Smart Guard --contract_address 0x964B30366fd80aF7a748bf119aFA08664335DB2F --abi_path Crowdsale.json
```

**Output:**

The fuzzer will print transaction receipts to the console.  It will also indicate if a transaction succeeded or failed.  More detailed logging and analysis can be added.

## Project Structure (Simplified)

```
.
├── example/crowdsale/      # Truffle project for the example contract
│   ├── build/contracts/   # Compiled contract artifacts (JSON)
│   ├── contracts/         # Solidity source code
│   └── truffle-config.js  # Truffle configuration
├── Smart Guard/
│   ├── common/            # Utility functions
│   ├── ethereum/          # Ethereum and Solidity-related code
│   │   └── solidity/      # ABI parsing, etc.
│   ├── fuzzers/           # Fuzzing policies and observation handlers
│   │   └── random/        # Random fuzzer implementation
│   └── __main__.py        # Main entry point
├── requirements.txt       # Python dependencies
├── .env                   # Stores your private key (KEEP SECRET!)
└── README.md              # This file
```

## Comparison with Other Fuzzers

| Feature             | Smart Guard (This Version)                                          | Echidna                                                                 | Mythril/Manticore                                                              |
| ------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Primary Technique** | Random Fuzzing (with Web3.py)                               | Property-Based Fuzzing                                                 | Symbolic Execution, Concolic Testing                                          |
| **Setup Complexity** | Medium (requires Truffle deployment and configuration)     | Low                                                                     | Medium (can be complex to configure and interpret results)                     |
| **Requires...**     | Deployed contract, ABI, private key, RPC URL               | Solidity properties                                                      | Understanding of symbolic execution                                            |
| **Strengths**       | Simple to use for basic fuzzing, interacts with live testnet | Easy to use, good for finding logic errors, strong community support  | Deep program analysis, can find complex vulnerabilities                        |
| **Weaknesses**     | Limited vulnerability detection, no advanced features yet   | Requires writing good properties, may miss some vulnerabilities        | Can be slow, path explosion problem, may produce false positives, no live testnet |

**This refactored version of Smart Guard is currently a basic random fuzzer.**  It lacks the advanced features of the original Smart Guard (imitation learning, symbolic execution, checkers). It's best suited for initial testing and as a foundation for building more sophisticated fuzzing capabilities using Web3.py.  It's closer in functionality to a simple script that interacts with a contract than a full-fledged fuzzer like Echidna.

**Echidna is generally recommended for property-based testing**, and is a good choice if you can define clear invariants for your contract.

**Future Enhancements:**

*   **Implement more sophisticated observation:** Analyze transaction receipts and logs to detect potential vulnerabilities.
*   **Add basic coverage tracking:** Track which methods of the contract have been called.
*   **Explore options for integrating more advanced analysis:** Consider how to incorporate some form of static analysis or symbolic reasoning, even if it's limited compared to the original Smart Guard.
*   **Consider adding support for other fuzzing policies (imitation learning):** This would require a way to collect training data on the testnet, which is a significant challenge.
