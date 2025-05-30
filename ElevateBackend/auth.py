from google.oauth2 import id_token
from google.auth.transport import requests
import os
from fastapi import HTTPException

def verify_google_token(token: str):
    try:
        # Retrieve the client ID from environment variables
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not client_id:
            raise HTTPException(
                status_code=500,
                detail="GOOGLE_CLIENT_ID not configured in backend environment"
            )
            
        # Verify the token with Google's authentication service
        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            client_id
        )
        
        # Validate the token issuer
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError("Invalid token issuer")
            
        # Return the verified user information
        return {
            "sub": id_info['sub'],
            "email": id_info['email'],
            "name": id_info.get('name', '')
        }
    except Exception as e:
        # Handle any exceptions that occur during verification
        raise HTTPException(
            status_code=401,
            detail="Invalid Google authentication token"
        ) from e