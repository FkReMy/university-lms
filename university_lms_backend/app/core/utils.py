"""
Global Utility Functions (Production)
-------------------------------------
Utility and helper functions used across the University LMS backend.

- All helpers here are safe for production.
- No samples, demos, or legacy/test functions.
"""

from typing import Any, Dict, Optional, List
from datetime import datetime

def to_camel_case(snake_str: str) -> str:
    """
    Converts a snake_case string to camelCase for JSON APIs.
    """
    parts = snake_str.split('_')
    return parts[0] + ''.join(word.title() if word else '' for word in parts[1:])

def dict_keys_to_camel_case(data: Any) -> Any:
    """
    Recursively convert all dict keys from snake_case to camelCase.
    """
    if isinstance(data, dict):
        return {to_camel_case(k): dict_keys_to_camel_case(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [dict_keys_to_camel_case(item) for item in data]
    return data

def utc_now() -> datetime:
    """
    Returns the current UTC time (production safe).
    """
    return datetime.utcnow()

def parse_iso_datetime(dt_str: str) -> Optional[datetime]:
    """
    Parses an ISO-8601 datetime string to a Python datetime. Returns None if invalid.
    """
    try:
        return datetime.fromisoformat(dt_str)
    except (ValueError, TypeError):
        return None

def paginate(items: List[Any], page: int, page_size: int) -> List[Any]:
    """
    Returns a slice of items for the current page. (Simple production-safe pagination)
    """
    start = max(0, (page - 1) * page_size)
    end = start + page_size
    return items[start:end]

def remove_none_fields(d: Dict) -> Dict:
    """
    Removes keys from a dict where the value is None.
    """
    return {k: v for k, v in d.items() if v is not None}