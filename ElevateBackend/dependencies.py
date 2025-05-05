# This function extracts the JWT from the Authorization header and decodes it using your secret. 
# It then returns the user ID (which, by default, is stored in the "sub" field in NextAuth's JWT).

import os
import jwt
from fastapi import Header, HTTPException

def get_current_user_id(authorization: str = Header(...)) -> str:
    # Attempt to extract and decode the JWT token from the Authorization header
    try:
        # Split the Authorization header to extract the JWT token
        token = authorization.split("Bearer ")[-1]
        # Retrieve the secret key from environment variables
        secret = os.getenv("NEXTAUTH_SECRET")
        if not secret:
            raise HTTPException(status_code=500, detail="NEXTAUTH_SECRET not set.")
        # Decode the JWT token using the secret key
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        # Extract the user ID from the decoded token
        user_id = decoded.get("sub") or decoded.get("id")
        # Check if the user ID is present in the decoded token
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user id")
        # Return the extracted user ID
        return user_id
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e
