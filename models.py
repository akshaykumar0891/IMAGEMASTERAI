from app import db
from datetime import datetime
from sqlalchemy.sql import func

class GeneratedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.Text, nullable=False)
    style = db.Column(db.String(50), nullable=False, default='realistic')
    resolution = db.Column(db.String(20), nullable=False, default='512x512')
    format = db.Column(db.String(10), nullable=False, default='PNG')
    image_url = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')
    error_message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'prompt': self.prompt,
            'style': self.style,
            'resolution': self.resolution,
            'format': self.format,
            'image_url': self.image_url,
            'status': self.status,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class GeneratedVideo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.Text, nullable=False)
    style = db.Column(db.String(50), nullable=False, default='cinematic')
    duration = db.Column(db.String(10), nullable=False, default='5s')
    resolution = db.Column(db.String(20), nullable=False, default='720p')
    fps = db.Column(db.Integer, nullable=False, default=24)
    video_url = db.Column(db.Text, nullable=True)
    thumbnail_url = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')
    error_message = db.Column(db.Text, nullable=True)
    file_size = db.Column(db.Integer, nullable=True)  # in bytes
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'prompt': self.prompt,
            'style': self.style,
            'duration': self.duration,
            'resolution': self.resolution,
            'fps': self.fps,
            'video_url': self.video_url,
            'thumbnail_url': self.thumbnail_url,
            'status': self.status,
            'error_message': self.error_message,
            'file_size': self.file_size,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
