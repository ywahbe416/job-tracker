from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

JOB_STATUSES = ["Not Applied", "Applied", "Phone Screen", "Technical", "Onsite", "Offer", "Rejected"]


# ── Auth ──────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Jobs ──────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    company: str
    role_title: str
    status: str = "Not Applied"
    careers_url: Optional[str] = None
    notes: Optional[str] = None


class JobUpdate(BaseModel):
    company: Optional[str] = None
    role_title: Optional[str] = None
    status: Optional[str] = None
    careers_url: Optional[str] = None
    notes: Optional[str] = None


class JobOut(BaseModel):
    id: int
    user_id: int
    company: str
    role_title: str
    status: str
    careers_url: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
