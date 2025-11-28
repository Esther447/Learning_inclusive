from gtts import gTTS
from io import BytesIO

def generate_tts(text: str, voice: str = "default") -> bytes:
    """
    Stub: integrate with a TTS provider (Google, Azure, AWS Polly)
    Returns audio bytes that can be saved and served.
    """
    # For quick dev, return empty bytes or call gTTS locally (not production).
    mp3 = BytesIO()
    tts = gTTS(text)
    tts.write_to_fp(mp3)
    return mp3.getvalue()