import os
from dotenv import load_dotenv

load_dotenv()

# LLM 配置
LLM_API_URL = os.environ.get("LLM_API_URL", "https://api.deepseek.com")
LLM_API_KEY = os.environ.get("DEEPSEEK_API_KEY", os.environ.get("LLM_API_KEY", ""))
MODEL_NAME = os.environ.get("MODEL_NAME", "deepseek-chat")
