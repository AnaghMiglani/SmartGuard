import json

def extract_unique_bugs(log_file, output_file):
    unique_bugs = set()

    with open(log_file, 'r') as file:
        for line in file:
            try:
                # Extract JSON portion from the log line
                if "{" in line and "}" in line:
                    start = line.index("{")
                    end = line.rindex("}") + 1
                    log_entry = json.loads(line[start:end])
                    # Extract "bugs" key from the "Crowdsale" object if it exists
                    crowdsale_data = log_entry.get("Crowdsale", {})
                    bugs = crowdsale_data.get("bugs", {})
                    if bugs:
                        unique_bugs.add(json.dumps(bugs, sort_keys=True))  # Serialize with sorted keys for consistency
            except (json.JSONDecodeError, ValueError):
                continue  # Skip lines that are not valid JSON

    # Write unique bugs to the output file
    with open(output_file, 'w') as file:
        for bug in unique_bugs:
            file.write(f"{bug}\n")

if __name__ == "__main__":
    log_file = "smartguard.log"  # Input log file
    output_file = "vulner-initial.txt"  # Output file for unique bugs
    extract_unique_bugs(log_file, output_file)
    print(f"Unique bugs have been written to {output_file}")
