import json
import sys
import requests
from backend.config import LLM_API_URL, LLM_API_KEY, MODEL_NAME


def call_llm(prompt: str, stream: bool = False, json_mode: bool = True) -> str:
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "你是一个智能事务处理助手，只输出JSON，不输出任何解释或对话。"},
            {"role": "user", "content": prompt}
        ],
        "stream": stream,
        "temperature": 0
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(
            f"{LLM_API_URL}/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=60,
            stream=stream
        )
        response.raise_for_status()

        if stream:
            full_text = ""
            for line in response.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str.strip() == "[DONE]":
                    continue
                try:
                    chunk = json.loads(data_str)
                except json.JSONDecodeError:
                    continue
                delta = chunk.get("choices", [{}])[0].get("delta", {})
                token = delta.get("content", "")
                if token:
                    sys.stdout.write(token)
                    sys.stdout.flush()
                    full_text += token
            print()
            return full_text.strip()
        else:
            return response.json()["choices"][0]["message"]["content"].strip()

    except requests.exceptions.ConnectionError:
        raise ConnectionError(f"无法连接到 LLM API ({LLM_API_URL})，请检查网络。")
    except requests.exceptions.Timeout:
        raise TimeoutError("请求超时，请重试。")
