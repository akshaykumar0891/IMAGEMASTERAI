# Premium AI Content Studio - Images & Videos

## Overview

This is a Flask-based web application that serves as a Premium AI Content Studio for generating both images and videos. The application features a sophisticated glass-morphism interface with dual-mode content generation, strategic ad placement areas for monetization, and comprehensive content management functionality. Users can create AI-generated images and videos through an intuitive interface with advanced styling options and batch generation capabilities.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database**: SQLAlchemy ORM with SQLite (development) / PostgreSQL (production via DATABASE_URL)
- **Session Management**: Flask sessions with configurable secret key
- **Deployment**: WSGI-compatible with ProxyFix middleware for production deployment

### Frontend Architecture
- **UI Framework**: Bootstrap 5 for responsive design
- **Styling**: Custom CSS with CSS variables for theme management
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter)
- **JavaScript**: Vanilla JS with modular state management pattern

### Design System
- Glass-morphism design with backdrop blur effects
- CSS custom properties for consistent theming
- Dark/light theme support with localStorage persistence
- Responsive grid layout for different screen sizes

## Key Components

### Database Models
- **GeneratedImage**: Core model storing image generation requests and results
  - Tracks prompt, style, resolution, format preferences
  - Status tracking (pending, generating, completed, error)
  - Timestamps for creation and updates
  - URL storage for generated images

- **GeneratedVideo**: New model for video generation tracking
  - Stores video-specific parameters (duration, fps, style)
  - Tracks video URL and thumbnail URL
  - File size tracking for storage management
  - Status tracking for video processing pipeline

### API Integration
- External image generation service via buildpicoapps.com API
- Prompt enhancement based on selected style
- Error handling and status management
- Async image generation workflow

### User Interface Components
- **Dual-Mode Interface**: Toggle between image and video generation modes
- **Enhanced Generation Panel**: Unified interface for creating both images and videos
- **Advanced Preview System**: Content display with zoom, download, and share capabilities
- **Unified History Management**: View and manage both images and videos
- **Theme Toggle**: Dark/light mode switching with enhanced animations
- **Batch Generation**: Multiple content creation from different prompts
- **Strategic Ad Placement**: Monetization-ready ad spaces throughout the interface
- **Enhanced Glass Morphism**: Premium design with improved visual hierarchy

## Data Flow

1. **Image Generation Request**:
   - User inputs prompt and selects preferences
   - Frontend validates input and sends POST request to `/generate`
   - Backend creates database record with 'generating' status
   - External API call made with enhanced prompt
   - Database updated with results or error status
   - Frontend receives response and updates UI

2. **History Management**:
   - Previous generations stored in database
   - Frontend loads history via API calls
   - Images displayed in responsive grid layout
   - Download and re-generation capabilities available

3. **Theme Management**:
   - Theme preference stored in localStorage
   - CSS variables updated dynamically
   - Background gradients and colors adjusted
   - Icon states synchronized with theme

## External Dependencies

### Backend Dependencies
- Flask: Web framework
- Flask-SQLAlchemy: Database ORM
- Werkzeug: WSGI utilities and middleware
- Requests: HTTP client for external API calls

### Frontend Dependencies
- Bootstrap 5.3.0: UI component framework
- Font Awesome 6.4.0: Icon library
- Google Fonts (Inter): Typography

### External Services
- BuildPicoApps Image Generation API: Core AI image generation service

## Deployment Strategy

### Environment Configuration
- **SESSION_SECRET**: Configurable session secret key
- **DATABASE_URL**: Database connection string (SQLite default, PostgreSQL for production)
- **Debug Mode**: Enabled for development, should be disabled in production

### Database Strategy
- SQLAlchemy with automatic table creation
- Connection pooling with pre-ping health checks
- Pool recycling every 300 seconds for connection stability

### Production Considerations
- ProxyFix middleware configured for reverse proxy deployment
- Logging configured at DEBUG level (should be adjusted for production)
- Static file serving handled by Flask (consider CDN for production)

### Monetization Features
- **Header Banner Ad Space**: 728x90 premium placement above content
- **Content Banner Ad Space**: 728x90 strategically placed between main content sections
- **Footer Banner Ad Space**: 728x90 at bottom of page for maximum visibility
- **Sidebar Vertical Ad Space**: 160x600 sticky sidebar placement (desktop only)
- **Mobile Banner Ad Space**: 320x50 optimized for mobile devices
- **Ad Placeholder System**: Visual indicators for easy ad integration with Google AdSense

## Recent Enhancements (June 29, 2025)

✓ **Video Generation Capability**: Added full video generation functionality with separate model and API endpoints
✓ **Dual-Mode Interface**: Implemented toggle between image and video creation modes
✓ **Enhanced Glass Morphism Design**: Upgraded visual design with premium styling and animations
✓ **Strategic Ad Placement Areas**: Added monetization-ready ad spaces throughout the interface
✓ **Advanced State Management**: Improved UI state handling for both content types
✓ **Enhanced History System**: Unified history management for images and videos
✓ **Improved Responsive Design**: Better mobile experience with adaptive ad placements
✓ **Enhanced User Experience**: Added animations, better feedback, and intuitive navigation

## Changelog

- June 29, 2025: Major enhancement - Added video generation, improved styling, and ad placement areas
- June 29, 2025: Initial setup

## User Preferences

- Preferred communication style: Simple, everyday language
- Focus on monetization through strategic ad placement
- Premium visual design with glass morphism effects
- Dual content creation capabilities (images and videos)