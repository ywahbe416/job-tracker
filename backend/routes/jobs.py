from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from auth_utils import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=List[schemas.JobOut])
def get_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Job).filter(models.Job.user_id == current_user.id).order_by(models.Job.created_at.desc()).all()


@router.post("", response_model=schemas.JobOut, status_code=status.HTTP_201_CREATED)
def create_job(body: schemas.JobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if body.status not in schemas.JOB_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {schemas.JOB_STATUSES}")

    job = models.Job(**body.model_dump(), user_id=current_user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.put("/{job_id}", response_model=schemas.JobOut)
def update_job(job_id: int, body: schemas.JobUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if body.status and body.status not in schemas.JOB_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {schemas.JOB_STATUSES}")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
