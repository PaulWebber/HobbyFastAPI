Start-Process "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" -ArgumentList "--auto-open-devtools-for-tabs", "http://127.0.0.1:8000";
./.venv/Scripts/Activate.ps1; 
python -m uvicorn main:app --reload;
