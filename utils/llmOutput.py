import json
from typing import Dict

def format_llm_output_to_dict(llm_output: str) -> Dict:
    """
    Validates and formats the output from the LLM to ensure it is a proper JSON object.

    :param llm_output: The raw output string from the LLM.
    :return: A dictionary representing the formatted JSON.
    :raises ValueError: If the output cannot be parsed into a valid JSON.
    """
    try:
        # Attempt to parse directly as JSON
        return json.loads(llm_output)
    except json.JSONDecodeError:
        # If not directly JSON, attempt to extract JSON from within the string
        try:
            # Find the first occurrence of a JSON-like structure
            start_idx = llm_output.find("{")
            end_idx = llm_output.rfind("}")
            if start_idx != -1 and end_idx != -1:
                extracted_json = llm_output[start_idx:end_idx + 1]
                return json.loads(extracted_json)
        except Exception as e:
            raise ValueError(f"Failed to format LLM output. Error: {str(e)}")

    # If all parsing attempts fail, raise an error
    raise ValueError("LLM output is not valid JSON and could not be formatted.")