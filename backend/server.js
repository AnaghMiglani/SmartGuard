const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json()); // Parse JSON request bodies

// Simplified vulnerability detection (replace with a real analyzer)
function analyzeSolidityCode(code) {
    const vulnerabilities = [];

    // Example 1: Check for reentrancy (very basic check)
    if (code.includes(".call.value(")) {
        vulnerabilities.push("Potential reentrancy vulnerability.  Review external calls.");
    }

    // Example 2: Check for unchecked external calls
    if (code.includes(".send(") || code.includes(".transfer(")) {
        vulnerabilities.push("Potential unchecked external call. Ensure proper error handling.");
    }

    // Example 3: Check for integer overflow/underflow (VERY simplified)
    if (code.includes("+") || code.includes("-") || code.includes("*") || code.includes("/")) {
        if (!code.includes("SafeMath")) { // A very rudimentary check
            vulnerabilities.push("Potential integer overflow/underflow. Consider using SafeMath or similar libraries.");
        }
    }
     // Example 4: Check for tx.origin
    if (code.includes("tx.origin")) {
        vulnerabilities.push("Use of tx.origin for authorization, vulnerable to phishing attacks. Use msg.sender instead.");
    }

    // Example 5: Check for timestamp dependence
    if (code.includes("block.timestamp")) {
      vulnerabilities.push("Potential timestamp dependence vulnerability.  Block timestamps can be manipulated by miners.");
    }
    // Add more checks as needed...

    return vulnerabilities;
}

app.post('/analyze', (req, res) => {
    const { solidityCode } = req.body;

    if (!solidityCode) {
        return res.status(400).json({ error: 'Solidity code is required.' });
    }

    try {
        const vulnerabilities = analyzeSolidityCode(solidityCode);
        res.json({ vulnerabilities });
    } catch (error) {
        console.error("Error analyzing code:", error);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});

// Endpoint to save Solidity code and create Truffle project
app.post('/api/save-code', (req, res) => {
    const { solidityCode } = req.body;

    if (!solidityCode) {
        return res.status(400).json({ error: 'No Solidity code provided.' });
    }

    // Define the Truffle project structure under the ilf directory
    const ilfDir = path.join(__dirname, '../ilf');
    const exampleDir = path.join(ilfDir, 'example', 'crowdsale');
    const contractsDir = path.join(exampleDir, 'contracts');
    const migrationsDir = path.join(exampleDir, 'migrations');
    const testDir = path.join(exampleDir, 'test');

    // Create directories if they don't exist
    [contractsDir, migrationsDir, testDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Save the Solidity code in the contracts directory
    const solidityFilePath = path.join(contractsDir, 'Crowdsale.sol');
    fs.writeFileSync(solidityFilePath, solidityCode);

    // Create a basic Truffle configuration file
    const truffleConfigPath = path.join(exampleDir, 'truffle-config.js');
    if (!fs.existsSync(truffleConfigPath)) {
        fs.writeFileSync(truffleConfigPath, `
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.0" // Specify the Solidity compiler version
    }
  }
};
`);
    }

    // Create a basic migration file
    const migrationFilePath = path.join(migrationsDir, '1_initial_migration.js');
    if (!fs.existsSync(migrationFilePath)) {
        fs.writeFileSync(migrationFilePath, `
const Crowdsale = artifacts.require("Crowdsale");

module.exports = function (deployer) {
  deployer.deploy(Crowdsale);
};
`);
    }

    res.json({ message: 'Truffle project created successfully' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});