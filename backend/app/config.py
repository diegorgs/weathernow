from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "WeatherNow API"
    database_url: str = "mysql+pymysql://weather_user:weather_pass@localhost:3306/weather_now"
    secret_key: str = "change-me-for-a-strong-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
