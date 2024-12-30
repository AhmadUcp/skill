import time
import requests

# Configuration
CLIENT_ID = "mqyr2wg5g8gptg5g"  
CLIENT_SECRET = "irTWomLa"  
AUTH_URL = "https://auth.emsicloud.com/connect/token"
API_BASE_URL = "https://emsiservices.com/skills/versions/latest"
AUTH_SCOPE = "emsi_open"  
TOKEN_EXPIRATION_BUFFER = 10  # Buffer time (in seconds) before token expiration

# Global variables to store token info
access_token = None
token_expiry_time = None

def get_new_token():
    """
    Fetch a new access token from the authentication endpoint and update the global variables.
    """
    global access_token, token_expiry_time
    auth_payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials",
        "scope": AUTH_SCOPE
    }
    auth_headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
    auth_response = requests.post(AUTH_URL, data=auth_payload, headers=auth_headers)
    
    if auth_response.status_code == 200:
        token_info = auth_response.json()
        access_token = token_info.get("access_token")
        expires_in = token_info.get("expires_in", 3600)  # Default to 3600 seconds
        token_expiry_time = time.time() + expires_in - TOKEN_EXPIRATION_BUFFER  # Adjust for buffer
        print("New access token generated.")
    else:
        print("Failed to fetch access token.")
        print("Status Code:", auth_response.status_code)
        print("Response:", auth_response.json())
        raise Exception("Unable to fetch access token.")

def is_token_expired():
    """
    Check if the current token has expired or is about to expire.
    """
    return token_expiry_time is None or time.time() >= token_expiry_time

def fetch_data(endpoint, querystring=None, payload=None, method="GET"):
    """
    Generic function to fetch data from a given API endpoint with automatic token regeneration.
    """
    global access_token
    
    # Regenerate token if expired
    if is_token_expired():
        print("Token expired. Fetching a new token...")
        get_new_token()
    
    headers = {"Authorization": f"Bearer {access_token}"}
    response = None

    if method == "GET":
        response = requests.get(endpoint, headers=headers, params=querystring)
    elif method == "POST":
        headers["Content-Type"] = "application/json"
        response = requests.post(endpoint, headers=headers, json=payload)
    
    if response.status_code == 401:  # Unauthorized (likely due to token expiration)
        print("Token expired during the request. Regenerating token...")
        get_new_token()
        headers["Authorization"] = f"Bearer {access_token}"  # Update with the new token
        if method == "GET":
            response = requests.get(endpoint, headers=headers, params=querystring)
        elif method == "POST":
            response = requests.post(endpoint, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch data.")
        print("Status Code:", response.status_code)
        print("Response:", response.text)
        return None

def fetch_skill_details(skill_id):
    """
    Fetch details for a specific skill.
    """
    endpoint = f"{API_BASE_URL}/skills/{skill_id}"
    return fetch_data(endpoint)

def fetch_related_skills(skill_id):
    """
    Fetch related skills for a specific skill.
    """
    endpoint = f"{API_BASE_URL}/related"
    payload = {"ids": [skill_id]}
    return fetch_data(endpoint, payload=payload, method="POST")

def fetch_job_postings(skill_id):
    """
    Fetch job postings for a specific skill. This is hypothetical since the exact endpoint for job postings
    was not explicitly stated in the documentation summary.
    """
    # Replace with the actual endpoint if available
    endpoint = f"{API_BASE_URL}/jobs/{skill_id}"
    return fetch_data(endpoint)

# Example usage
try:
    # Fetch the initial token before making any requests
    get_new_token()

    # Unique Skill ID
    skill_id = "KS6833T66CBZHBTRQG5Q"
    
    # 1. Fetch skill details
    skill_details = fetch_skill_details(skill_id)
    print("Skill Details:", skill_details)

    # 2. Fetch related skills
    related_skills = fetch_related_skills(skill_id)
    print("Related Skills:", related_skills)

    # 3. Fetch job postings (hypothetical, depending on API capabilities)
    job_postings = fetch_job_postings(skill_id)
    print("Job Postings:", job_postings)
except Exception as e:
    print("Error:", e)
