from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class UserCityHistoryCreate(BaseModel):
    city_name: str
    latitude: float
    longitude: float
    country: str | None = None


class UserCityHistoryResponse(BaseModel):
    id: int
    city_name: str
    latitude: float
    longitude: float
    country: str | None = None
    created_at: datetime


class UserPreferenceUpdate(BaseModel):
    daily_email_enabled: bool = False
    daily_email_hour: str = "08:00"


class UserPreferenceResponse(BaseModel):
    daily_email_enabled: bool
    daily_email_hour: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
