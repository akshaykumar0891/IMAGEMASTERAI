import os
import requests
import json
import logging
from flask import render_template, request, jsonify, flash, redirect, url_for
from app import app, db
from models import GeneratedImage, GeneratedVideo

@app.route('/')
def index():
    """Main page with the enhanced AI content generator interface"""
    return render_template('enhanced_index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
    """Generate an image based on the provided parameters"""
    try:
        data = request.get_json()
        
        if not data or not data.get('prompt'):
            return jsonify({'status': 'error', 'message': 'Prompt is required'}), 400
        
        prompt = data.get('prompt', '').strip()
        style = data.get('style', 'realistic')
        resolution = data.get('resolution', '512x512')
        format_type = data.get('format', 'PNG')
        
        if len(prompt) < 3:
            return jsonify({'status': 'error', 'message': 'Prompt must be at least 3 characters long'}), 400
        
        # Create database record
        image_record = GeneratedImage(
            prompt=prompt,
            style=style,
            resolution=resolution,
            format=format_type,
            status='generating'
        )
        db.session.add(image_record)
        db.session.commit()
        
        # Enhanced prompt based on style
        enhanced_prompt = enhance_prompt_with_style(prompt, style)
        
        # Call the external API
        api_url = "https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQm9ZV21vTFh2d011RXYtczgtYzVpTU9ZRWw1cHhzeE1xaHV2V2VoV2NUaUxHaWowLWpNaUhwUV9kVmllQTZacVB6MGpsb1pIano2YjdGUlBMZHpDREtEaE9NOWc9PQ=="
        
        payload = {
            'prompt': enhanced_prompt
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        logging.info(f"Sending request to API with prompt: {enhanced_prompt}")
        
        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        logging.info(f"API response: {result}")
        
        if result.get('status') == 'success' and result.get('imageUrl'):
            # Update record with success
            image_record.status = 'completed'
            image_record.image_url = result['imageUrl']
            db.session.commit()
            
            return jsonify({
                'status': 'success',
                'imageUrl': result['imageUrl'],
                'id': image_record.id,
                'prompt': prompt,
                'style': style,
                'resolution': resolution,
                'format': format_type
            })
        else:
            # Update record with error
            error_msg = result.get('message', 'Unknown error occurred')
            image_record.status = 'failed'
            image_record.error_message = error_msg
            db.session.commit()
            
            return jsonify({
                'status': 'error',
                'message': error_msg
            }), 500
            
    except requests.exceptions.Timeout:
        logging.error("API request timed out")
        if 'image_record' in locals():
            image_record.status = 'failed'
            image_record.error_message = 'Request timed out'
            db.session.commit()
        return jsonify({'status': 'error', 'message': 'Request timed out. Please try again.'}), 500
        
    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        if 'image_record' in locals():
            image_record.status = 'failed'
            image_record.error_message = f'API request failed: {str(e)}'
            db.session.commit()
        return jsonify({'status': 'error', 'message': 'Failed to connect to image generation service'}), 500
        
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        if 'image_record' in locals():
            image_record.status = 'failed'
            image_record.error_message = f'Unexpected error: {str(e)}'
            db.session.commit()
        return jsonify({'status': 'error', 'message': 'An unexpected error occurred'}), 500

@app.route('/history')
def get_history():
    """Get the history of generated images"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        images = GeneratedImage.query.order_by(GeneratedImage.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'status': 'success',
            'images': [img.to_dict() for img in images.items],
            'total': images.total,
            'pages': images.pages,
            'current_page': page
        })
        
    except Exception as e:
        logging.error(f"Error fetching history: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch history'}), 500

@app.route('/generate_video', methods=['POST'])
def generate_video():
    """Generate a video based on the provided parameters"""
    try:
        data = request.get_json()
        
        if not data or not data.get('prompt'):
            return jsonify({'status': 'error', 'message': 'Prompt is required'}), 400
        
        prompt = data.get('prompt', '').strip()
        style = data.get('style', 'cinematic')
        duration = data.get('duration', '5s')
        resolution = data.get('resolution', '720p')
        fps = data.get('fps', 24)
        
        if len(prompt) < 3:
            return jsonify({'status': 'error', 'message': 'Prompt must be at least 3 characters long'}), 400
        
        # Create database record
        video_record = GeneratedVideo(
            prompt=prompt,
            style=style,
            duration=duration,
            resolution=resolution,
            fps=fps,
            status='generating'
        )
        db.session.add(video_record)
        db.session.commit()
        
        # Enhanced prompt based on style
        enhanced_prompt = enhance_video_prompt_with_style(prompt, style)
        
        # For now, simulate video generation (replace with actual API later)
        # This is a placeholder - you would integrate with actual video generation API
        logging.info(f"Simulating video generation with prompt: {enhanced_prompt}")
        
        # Simulate processing time and success
        import time
        time.sleep(2)  # Simulate processing
        
        # Mock successful response (replace with real API integration)
        video_record.status = 'completed'
        video_record.video_url = f"https://example.com/video/{video_record.id}.mp4"
        video_record.thumbnail_url = f"https://example.com/thumbnail/{video_record.id}.jpg"
        video_record.file_size = 1024 * 1024 * 5  # 5MB mock size
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'videoUrl': video_record.video_url,
            'thumbnailUrl': video_record.thumbnail_url,
            'id': video_record.id,
            'prompt': prompt,
            'style': style,
            'duration': duration,
            'resolution': resolution,
            'fps': fps,
            'fileSize': video_record.file_size
        })
        
    except Exception as e:
        logging.error(f"Video generation error: {str(e)}")
        if 'video_record' in locals():
            video_record.status = 'failed'
            video_record.error_message = f'Error: {str(e)}'
            db.session.commit()
        return jsonify({'status': 'error', 'message': 'Failed to generate video'}), 500

@app.route('/video_history')
def get_video_history():
    """Get the history of generated videos"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        videos = GeneratedVideo.query.order_by(GeneratedVideo.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'status': 'success',
            'videos': [video.to_dict() for video in videos.items],
            'total': videos.total,
            'pages': videos.pages,
            'current_page': page
        })
        
    except Exception as e:
        logging.error(f"Error fetching video history: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch video history'}), 500

@app.route('/batch_generate', methods=['POST'])
def batch_generate():
    """Generate multiple images from a list of prompts"""
    try:
        data = request.get_json()
        prompts = data.get('prompts', [])
        style = data.get('style', 'realistic')
        resolution = data.get('resolution', '512x512')
        format_type = data.get('format', 'PNG')
        
        if not prompts or len(prompts) == 0:
            return jsonify({'status': 'error', 'message': 'At least one prompt is required'}), 400
            
        if len(prompts) > 5:  # Limit batch size
            return jsonify({'status': 'error', 'message': 'Maximum 5 prompts allowed per batch'}), 400
        
        results = []
        
        for prompt in prompts:
            if not prompt or len(prompt.strip()) < 3:
                continue
                
            # Create database record for each prompt
            image_record = GeneratedImage(
                prompt=prompt.strip(),
                style=style,
                resolution=resolution,
                format=format_type,
                status='generating'
            )
            db.session.add(image_record)
            db.session.commit()
            
            results.append({
                'id': image_record.id,
                'prompt': prompt.strip(),
                'status': 'queued'
            })
        
        return jsonify({
            'status': 'success',
            'message': f'Batch generation started for {len(results)} images',
            'results': results
        })
        
    except Exception as e:
        logging.error(f"Batch generation error: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to start batch generation'}), 500

def enhance_prompt_with_style(prompt, style):
    """Enhance the prompt based on the selected style"""
    style_enhancements = {
        'realistic': f"{prompt}, photorealistic, high quality, detailed, professional photography",
        'artistic': f"{prompt}, artistic style, creative, expressive, beautiful artwork",
        'cartoon': f"{prompt}, cartoon style, animated, colorful, fun, illustration",
        'abstract': f"{prompt}, abstract art, creative interpretation, artistic expression",
        'vintage': f"{prompt}, vintage style, retro, classic, nostalgic aesthetic",
        'futuristic': f"{prompt}, futuristic style, sci-fi, modern, high-tech aesthetic"
    }
    
    return style_enhancements.get(style, prompt)

def enhance_video_prompt_with_style(prompt, style):
    """Enhance the video prompt based on the selected style"""
    style_enhancements = {
        'cinematic': f"{prompt}, cinematic style, dramatic lighting, high quality, professional videography, film-like",
        'documentary': f"{prompt}, documentary style, natural lighting, realistic, authentic footage",
        'animated': f"{prompt}, animated style, colorful, smooth motion, cartoon-like animation",
        'artistic': f"{prompt}, artistic style, creative visuals, expressive, beautiful cinematography",
        'vintage': f"{prompt}, vintage style, retro aesthetic, classic film look, nostalgic",
        'modern': f"{prompt}, modern style, sleek visuals, contemporary, high-tech aesthetic"
    }
    
    return style_enhancements.get(style, prompt)

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
