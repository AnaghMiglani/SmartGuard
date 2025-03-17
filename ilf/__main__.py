import argparse
import os
import warnings
from joblib import load  # Ensure joblib is imported directly to avoid deprecation warnings

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, required=True, help='Path to the model directory')
    parser.add_argument('--limit', type=int, default=2000, help='Limit for fuzzing iterations')
    args = parser.parse_args()

    # Ensure paths are handled correctly
    model_dir = os.path.abspath(args.model)
    print(f"Resolved model directory: {model_dir}")  # Debug log
    if not os.path.exists(model_dir):
        raise FileNotFoundError(f"Model directory not found: {model_dir}")

    # Pass arguments correctly to the policy
    policy = PolicyImitation(model_dir=model_dir, limit=args.limit)
    try:
        print(f"Looking for scaler.pkl in: {os.path.join(model_dir, 'scaler.pkl')}")  # Debug log
        policy.load_model()
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Required file not found in model directory: {e}")

    # ...existing code...

if __name__ == "__main__":
    # Suppress sklearn deprecation warnings
    warnings.filterwarnings("ignore", category=FutureWarning)
    main()
