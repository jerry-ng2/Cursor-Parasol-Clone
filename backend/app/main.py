from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from . import models, schemas, database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=database.engine)

@app.post("/api/db/claims", response_model=schemas.ClaimOut)
def create_claim(claim: schemas.ClaimCreate, db: Session = Depends(get_db)):
    db_claim = models.Claim(**claim.dict())
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim

@app.get("/api/db/claims", response_model=list[schemas.ClaimOut])
def list_claims(db: Session = Depends(get_db)):
    return db.query(models.Claim).all()

@app.get("/api/db/claims/{claim_id}", response_model=schemas.ClaimOut)
def get_claim(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@app.post("/api/db/claims/{claim_id}/original_image", response_model=schemas.ImageOut)
def upload_image(claim_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    images_dir = os.path.join(os.path.dirname(__file__), 'images')
    os.makedirs(images_dir, exist_ok=True)
    file_path = os.path.join(images_dir, file.filename)
    with open(file_path, "wb") as image_file:
        image_file.write(file.file.read())
    db_image = models.Image(claim_id=claim_id, file_path=file_path)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image 