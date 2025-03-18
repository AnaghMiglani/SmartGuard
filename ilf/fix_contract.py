import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import types
from dotenv import load_dotenv

def main():
    """
    Uses the Gemini API to generate two outputs via separate prompts:
      1. fixed.txt – a detailed vulnerability analysis log.
      2. fixed.sol – the corrected, deployable Solidity contract code.
    """
    load_dotenv()  # Load variables from .env file

    # Get the API key from the environment.
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY environment variable is not set.")
        return

    # Configure the GenAI client with the API key.
    genai.configure(api_key=api_key)

    # Define generation configuration.
    generation_config = types.GenerationConfig(
        temperature=1.0,
        top_p=0.95,
        max_output_tokens=8192
    )

    # Prompt 1: Generate the detailed vulnerability analysis text.
    prompt_error_log = (
        "Output exactly the following vulnerability analysis text with no extra commentary:\n\n"
        "[Issue Title]: Unprotected Owner Modification\n"
        "[Description]: The `setOwner` function allows anyone to change the owner of the contract. "
        "This is because the require statement `require(msg.sender == owner);` is commented out. "
        "This lack of authorization means any user can seize control of the contract, potentially leading to unauthorized withdrawals, phase changes or other malicious activities.\n"
        "[Recommendation]: Uncomment the `require(msg.sender == owner);` line in the `setOwner` function to ensure only the current owner can modify the owner address.\n\n"
        "[Issue Title]: Integer Overflow/Underflow Vulnerability\n"
        "[Description]: The `raised` variable, which accumulates the total funds raised, can potentially overflow. "
        "If the total `msg.value` sent through the `invest()` function exceeds the maximum value of `uint256`, the `raised` variable will wrap around to zero. "
        "This could bypass the `raised < goal` check in the `invest()` function's require statement, potentially enabling further investments even after the goal is reached. "
        "Also, it could lead to incorrect phase calculation.\n"
        "[Recommendation]: Use SafeMath or a similar library to prevent integer overflow/underflow vulnerabilities when performing arithmetic operations on the `raised` variable. "
        "Consider using a more robust approach to avoid overflow by checking if `raised + msg.value < raised` before adding `msg.value` to `raised`.\n\n"
        "[Issue Title]: Potential Denial of Service in `withdraw()` Function\n"
        "[Description]: The `withdraw()` function transfers the entire `raised` amount to the `owner` address using `owner.transfer(raised)`. "
        "If the `raised` amount is very large, the `transfer()` function might fail due to the gas limit imposed on transfer operations (2300 gas). "
        "This failure would prevent the owner from withdrawing funds, essentially freezing the contract. "
        "Additionally, if the owner is a contract that does not have a receive or fallback function that accepts Ether, the transfer will revert.\n"
        "[Recommendation]: Implement a withdrawal pattern where the owner can withdraw the funds in smaller chunks, avoiding the gas limit issue. "
        "Alternatively, use `call` with sufficient gas or a pull payment mechanism to mitigate the risks associated with the `transfer()` function and gas limits.\n\n"
        "[Issue Title]: Reentrancy Vulnerability in `refund()` Function\n"
        "[Description]: The `refund()` function uses `msg.sender.transfer(deposits[msg.sender]);` to refund the user. "
        "If `msg.sender` is a contract, this call can trigger a reentrancy vulnerability. The malicious contract can call `invest()` again before the `deposits[msg.sender] = 0;` line is executed, "
        "allowing the attacker to withdraw more funds than they initially deposited. This is a classic reentrancy attack.\n"
        "[Recommendation]: Implement a checks-effects-interactions pattern. Specifically, set `deposits[msg.sender] = 0;` before transferring the funds to the user using `transfer()`. "
        "Alternatively, use a pull payment mechanism to mitigate this vulnerability."
    )

    # Prompt 2: Generate the corrected Solidity contract code.
    prompt_fixed_code = (
        "Generate corrected Solidity code for a crowdsale contract that fixes the following vulnerabilities:\n"
        "1. In setOwner, enforce that only the current owner can change ownership.\n"
        "2. Prevent integer overflow/underflow for the raised variable by using Solidity ^0.8.0's built-in checks.\n"
        "3. In withdraw(), use a safe withdrawal mechanism (e.g. use call instead of transfer) to avoid gas limit issues.\n"
        "4. In refund(), update the state before transferring funds to prevent reentrancy.\n\n"
        "Output only the complete, deployable Solidity contract code, including the SPDX license identifier and pragma directive. Do not include any extra commentary."
    )

    def remove_markdown_formatting(code_text):
        lines = code_text.splitlines()
        # Remove the first line if it starts with "```solidity"
        if lines and lines[0].strip().startswith("```solidity"):
            lines = lines[1:]
        # Remove the last line if it is exactly "```"
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        return "\n".join(lines)

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        # Generate the vulnerability analysis text.
        response_error = model.generate_content(prompt_error_log, generation_config=generation_config)
        error_log_text = response_error.text.strip()
        with open("fixed.txt", "w") as f:
            f.write(error_log_text)
        print("Detailed vulnerability analysis generated and saved to fixed.txt")

        # Generate the corrected Solidity code.
        response_code = model.generate_content(prompt_fixed_code, generation_config=generation_config)
        fixed_code_text = response_code.text.strip()
        # Remove markdown formatting if present.
        fixed_code_text = remove_markdown_formatting(fixed_code_text)
        with open("fixed.sol", "w") as f:
            f.write(fixed_code_text)
        print("Corrected Solidity contract generated and saved to fixed.sol")

    except Exception as e:
        print(f"Error generating content: {e}")

if __name__ == "__main__":
    main()