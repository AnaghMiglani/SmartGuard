const express = require('express');
const cors = require('cors');
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});