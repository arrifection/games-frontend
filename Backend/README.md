# Backend API

This is a FastAPI backend application.

## Setup

1. Install Python 3.10+
2. Create a virtual environment:
   ```bash
   python -m venv v.env
   ```
3. Activate the environment:
   - Windows: `.\v.env\Scripts\Activate.ps1`
   - Linux/Mac: `source v.env/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run Local Server

```bash
uvicorn main:app --reload
```

## Deployment

This app is ready for deployment on platforms like Render, Railway, or Heroku.
