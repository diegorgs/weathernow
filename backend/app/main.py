from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.database import Base, engine, get_db
from app.models import User, UserCityHistory, UserPreference
from app.schemas import (
    Token,
    UserCityHistoryCreate,
    UserCityHistoryResponse,
    UserCreate,
    UserLogin,
    UserPreferenceResponse,
    UserPreferenceUpdate,
    UserResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="WeatherNow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=UserResponse)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Este e-mail já está cadastrado.")

    new_user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(id=new_user.id, name=new_user.name, email=new_user.email)


@app.post("/api/auth/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")

    access_token = create_access_token(subject=user.email)
    return Token(
        access_token=access_token,
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(id=current_user.id, name=current_user.name, email=current_user.email)


@app.post("/api/user/session", response_model=dict)
def save_user_city_session(
    payload: UserCityHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history_entry = UserCityHistory(
        user_id=current_user.id,
        city_name=payload.city_name.strip(),
        latitude=payload.latitude,
        longitude=payload.longitude,
        country=payload.country,
    )

    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    recent_history = (
        db.query(UserCityHistory)
        .filter(UserCityHistory.user_id == current_user.id)
        .order_by(UserCityHistory.created_at.desc())
        .limit(10)
        .all()
    )

    return {
        "message": "Histórico salvo com sucesso.",
        "history": [
            {
                "id": item.id,
                "city_name": item.city_name,
                "latitude": item.latitude,
                "longitude": item.longitude,
                "country": item.country,
                "created_at": item.created_at,
            }
            for item in recent_history
        ],
    }


@app.get("/api/user/session", response_model=list[UserCityHistoryResponse])
def get_user_city_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = (
        db.query(UserCityHistory)
        .filter(UserCityHistory.user_id == current_user.id)
        .order_by(UserCityHistory.created_at.desc())
        .limit(10)
        .all()
    )

    return [
        UserCityHistoryResponse(
            id=item.id,
            city_name=item.city_name,
            latitude=item.latitude,
            longitude=item.longitude,
            country=item.country,
            created_at=item.created_at,
        )
        for item in history
    ]


@app.get("/api/user/preferences", response_model=UserPreferenceResponse)
def get_user_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preferences = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not preferences:
        preferences = UserPreference(user_id=current_user.id, daily_email_enabled=False, daily_email_hour="08:00")
        db.add(preferences)
        db.commit()
        db.refresh(preferences)

    return UserPreferenceResponse(
        daily_email_enabled=preferences.daily_email_enabled,
        daily_email_hour=preferences.daily_email_hour,
    )


@app.post("/api/user/preferences", response_model=UserPreferenceResponse)
def save_user_preferences(
    payload: UserPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preferences = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not preferences:
        preferences = UserPreference(user_id=current_user.id)
        db.add(preferences)

    preferences.daily_email_enabled = payload.daily_email_enabled
    preferences.daily_email_hour = payload.daily_email_hour or "08:00"

    db.commit()
    db.refresh(preferences)

    return UserPreferenceResponse(
        daily_email_enabled=preferences.daily_email_enabled,
        daily_email_hour=preferences.daily_email_hour,
    )
