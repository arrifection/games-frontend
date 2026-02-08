from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bmi import router as bmi_router
from advice import router as advice_router
from bmr import router as bmr_router
from macros import router as macros_router
from exchange_list import router as exchange_router
from patient_router import router as patient_router
from plan_router import router as plan_router
from clinical_router import router as clinical_router
from auth_router import router as auth_router
from history_router import router as history_router

from fastapi import Request
import time

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    print(f"DEBUG: {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}ms)")
    return response

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local network testing

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bmi_router)
app.include_router(advice_router)
app.include_router(bmr_router)
app.include_router(macros_router)
app.include_router(exchange_router)
app.include_router(patient_router)
app.include_router(plan_router)
app.include_router(clinical_router)
app.include_router(auth_router)
app.include_router(history_router)


@app.get("/")
def home():
    return {"message": "Backend is running successfully"}
