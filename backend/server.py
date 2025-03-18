from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

@app.route('/api/save-code', methods=['POST'])
def save_code():
    data = request.json
    solidity_code = data.get('solidityCode', '')

    if not solidity_code:
        return jsonify({'error': 'No Solidity code provided'}), 400

    # Define the Truffle project structure under the ilf directory
    ilf_dir = os.path.join(os.getcwd(), 'ilf')
    example_dir = os.path.join(ilf_dir, 'example', 'crowdsale')
    contracts_dir = os.path.join(example_dir, 'contracts')
    migrations_dir = os.path.join(example_dir, 'migrations')
    test_dir = os.path.join(example_dir, 'test')

    # Create directories if they don't exist
    os.makedirs(contracts_dir, exist_ok=True)
    os.makedirs(migrations_dir, exist_ok=True)
    os.makedirs(test_dir, exist_ok=True)

    # Save the Solidity code in the contracts directory
    solidity_file_path = os.path.join(contracts_dir, 'Crowdsale.sol')
    with open(solidity_file_path, 'w') as solidity_file:
        solidity_file.write(solidity_code)

    # Create a basic Truffle configuration file
    truffle_config_path = os.path.join(example_dir, 'truffle-config.js')
    if not os.path.exists(truffle_config_path):
        with open(truffle_config_path, 'w') as config_file:
            config_file.write("""
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
""")

    # Create a basic migration file
    migration_file_path = os.path.join(migrations_dir, '1_initial_migration.js')
    if not os.path.exists(migration_file_path):
        with open(migration_file_path, 'w') as migration_file:
            migration_file.write("""
const Crowdsale = artifacts.require("Crowdsale");

module.exports = function (deployer) {
  deployer.deploy(Crowdsale);
};
""")

    return jsonify({'message': 'Truffle project created successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
