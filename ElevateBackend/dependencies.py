#This function extracts the JWT from the Authorization header and decodes it using your secret. 
# It then returns the user ID (which, by default, is stored in the "sub" field in NextAuth's JWT).

import os
import jwt
from fastapi import Header, HTTPException

def get_current_user_id(authorization: str = Header(...)) -> str:
    """
    Decode the NextAuth JWT using NEXTAUTH_SECRET and return the user ID.
    Checks both 'sub' and 'id' fields.
    """
    try:
        token = authorization.split("Bearer ")[-1]
        secret = os.getenv("NEXTAUTH_SECRET")
        if not secret:
            raise HTTPException(status_code=500, detail="NEXTAUTH_SECRET not set.")
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        user_id = decoded.get("sub") or decoded.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user id")
        return user_id
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e
