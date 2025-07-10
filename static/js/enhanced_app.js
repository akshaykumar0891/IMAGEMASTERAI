// Enhanced Global State Management
const AppState = {
    currentTheme: localStorage.getItem('theme') || 'dark',
    isGenerating: false,
    currentContent: null,
    history: [],
    videoHistory: [],
    batchPrompts: 2,
    contentMode: 'image', // 'image' or 'video'
    currentHistoryMode: 'image'
};

// DOM Elements Cache
const elements = {
    // Theme and Mode
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    contentModeRadios: document.querySelectorAll('input[name="contentMode"]'),
    
    // Form Elements
    promptInput: document.getElementById('promptInput'),
    
    // Image Elements
    styleSelect: document.getElementById('styleSelect'),
    resolutionSelect: document.getElementById('resolutionSelect'),
    
    // Video Elements
    videoStyleSelect: document.getElementById('videoStyleSelect'),
    durationSelect: document.getElementById('durationSelect'),
    videoResolutionSelect: document.getElementById('videoResolutionSelect'),
    fpsSelect: document.getElementById('fpsSelect'),
    
    // Buttons
    generateBtn: document.getElementById('generateBtn'),
    batchBtn: document.getElementById('batchBtn'),
    historyBtn: document.getElementById('historyBtn'),
    galleryBtn: document.getElementById('galleryBtn'),
    
    // Preview Controls
    downloadBtn: document.getElementById('downloadBtn'),
    zoomBtn: document.getElementById('zoomBtn'),
    shareBtn: document.getElementById('shareBtn'),
    previewControls: document.getElementById('previewControls'),
    
    // States
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    errorState: document.getElementById('errorState'),
    successState: document.getElementById('successState'),
    
    // Content Display
    resultImage: document.getElementById('resultImage'),
    resultVideo: document.getElementById('resultVideo'),
    videoSource: document.getElementById('videoSource'),
    errorMessage: document.getElementById('errorMessage'),
    
    // History
    historySection: document.getElementById('historySection'),
    historyGrid: document.getElementById('historyGrid'),
    historyLoading: document.getElementById('historyLoading'),
    historyEmpty: document.getElementById('historyEmpty'),
    toggleImageHistory: document.getElementById('toggleImageHistory'),
    toggleVideoHistory: document.getElementById('toggleVideoHistory'),
    
    // Dynamic UI Elements
    panelIcon: document.getElementById('panelIcon'),
    panelTitle: document.getElementById('panelTitle'),
    generateBtnText: document.getElementById('generateBtnText'),
    imageOptions: document.getElementById('imageOptions'),
    videoOptions: document.getElementById('videoOptions'),
    imageTemplates: document.getElementById('imageTemplates'),
    videoTemplates: document.getElementById('videoTemplates'),
    
    // Loading Elements
    loadingTitle: document.getElementById('loadingTitle'),
    loadingSubtitle: document.getElementById('loadingSubtitle'),
    emptyIcon: document.getElementById('emptyIcon'),
    emptyTitle: document.getElementById('emptyTitle'),
    emptySubtitle: document.getElementById('emptySubtitle'),
    promptHint: document.getElementById('promptHint'),
    
    // Content Info
    contentPrompt: document.getElementById('contentPrompt'),
    contentStyle: document.getElementById('contentStyle'),
    contentResolution: document.getElementById('contentResolution'),
    contentDuration: document.getElementById('contentDuration')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeEventListeners();
    initializeTemplates();
    initializeContentMode();
    loadHistory();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', AppState.currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    AppState.currentTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', AppState.currentTheme);
    localStorage.setItem('theme', AppState.currentTheme);
    updateThemeIcon();
    
    // Add visual feedback
    elements.themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
    setTimeout(() => {
        elements.themeToggle.style.transform = '';
    }, 300);
}

function updateThemeIcon() {
    elements.themeIcon.className = AppState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Content Mode Management
function initializeContentMode() {
    updateContentModeUI();
}

function switchContentMode(mode) {
    AppState.contentMode = mode;
    updateContentModeUI();
    resetPreview();
    
    // Visual feedback
    const button = document.querySelector(`label[for="${mode}Mode"]`);
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

function updateContentModeUI() {
    const isVideoMode = AppState.contentMode === 'video';
    
    // Update panel title and icon
    elements.panelIcon.className = isVideoMode ? 'fas fa-video me-2' : 'fas fa-palette me-2';
    elements.panelTitle.textContent = isVideoMode ? 'Create Your Video' : 'Create Your Image';
    
    // Update generate button
    elements.generateBtnText.textContent = isVideoMode ? 'Generate Video' : 'Generate Image';
    
    // Show/hide options
    elements.imageOptions.style.display = isVideoMode ? 'none' : 'block';
    elements.videoOptions.style.display = isVideoMode ? 'block' : 'none';
    
    // Update templates
    elements.imageTemplates.style.display = isVideoMode ? 'none' : 'flex';
    elements.videoTemplates.style.display = isVideoMode ? 'flex' : 'none';
    
    // Update empty state
    elements.emptyIcon.className = isVideoMode ? 'fas fa-video fa-5x text-muted' : 'fas fa-image fa-5x text-muted';
    elements.emptyTitle.textContent = 'Ready to Create';
    elements.emptySubtitle.textContent = `Enter a prompt and click "Generate ${isVideoMode ? 'Video' : 'Image'}" to see your creation here`;
    
    // Update prompt hint
    elements.promptHint.textContent = isVideoMode 
        ? 'Try: "Ocean waves crashing on a rocky shore with dramatic lighting"'
        : 'Try: "A majestic dragon flying over a mystical forest at sunset"';
    
    // Update loading text
    elements.loadingTitle.textContent = isVideoMode ? 'Creating Your Video' : 'Creating Your Masterpiece';
    elements.loadingSubtitle.textContent = isVideoMode ? 'AI is rendering your video...' : 'AI is working its magic...';
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Content mode toggle
    elements.contentModeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                switchContentMode(this.value);
            }
        });
    });
    
    // Main generation
    elements.generateBtn.addEventListener('click', handleGenerate);
    
    // Action buttons
    elements.batchBtn.addEventListener('click', showBatchModal);
    elements.historyBtn.addEventListener('click', toggleHistory);
    elements.galleryBtn.addEventListener('click', showGalleryModal);
    
    // History mode toggles
    elements.toggleImageHistory.addEventListener('click', () => switchHistoryMode('image'));
    elements.toggleVideoHistory.addEventListener('click', () => switchHistoryMode('video'));
    
    // Batch generation
    document.getElementById('startBatchBtn').addEventListener('click', handleBatchGenerate);
    document.getElementById('addPromptBtn').addEventListener('click', addBatchPrompt);
    document.getElementById('removePromptBtn').addEventListener('click', removeBatchPrompt);
    
    // Preview controls
    elements.downloadBtn.addEventListener('click', downloadContent);
    elements.zoomBtn.addEventListener('click', showZoomModal);
    elements.shareBtn.addEventListener('click', shareContent);
    
    // Keyboard shortcuts
    elements.promptInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleGenerate();
        }
    });
    
    // Format selection (for images)
    document.querySelectorAll('input[name="formatSelect"]').forEach(radio => {
        radio.addEventListener('change', updateFormatSelection);
    });
    
    // Auto-resize textarea
    elements.promptInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Template Management
function initializeTemplates() {
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.dataset.template;
            elements.promptInput.value = template;
            elements.promptInput.focus();
            
            // Auto-resize textarea
            elements.promptInput.style.height = 'auto';
            elements.promptInput.style.height = Math.min(elements.promptInput.scrollHeight, 120) + 'px';
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Main Generation Function
async function handleGenerate() {
    const prompt = elements.promptInput.value.trim();
    
    if (!prompt) {
        showNotification(`Please enter a prompt to generate ${AppState.contentMode}`, 'warning');
        elements.promptInput.focus();
        return;
    }
    
    if (prompt.length < 3) {
        showNotification('Prompt must be at least 3 characters long', 'warning');
        return;
    }
    
    if (AppState.isGenerating) {
        showNotification('Generation already in progress', 'info');
        return;
    }
    
    AppState.isGenerating = true;
    showLoadingState();
    
    try {
        if (AppState.contentMode === 'image') {
            await generateImage(prompt);
        } else {
            await generateVideo(prompt);
        }
    } catch (error) {
        console.error('Generation error:', error);
        showErrorState('An unexpected error occurred. Please try again.');
        showNotification('Generation failed', 'error');
    } finally {
        AppState.isGenerating = false;
    }
}

// Image Generation
async function generateImage(prompt) {
    const requestData = {
        prompt: prompt,
        style: elements.styleSelect.value,
        resolution: elements.resolutionSelect.value,
        format: getSelectedFormat()
    };
    
    const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
        showSuccessState(data, 'image');
        AppState.currentContent = { ...data, type: 'image' };
        showNotification('Image generated successfully!', 'success');
        loadHistory();
    } else {
        showErrorState(data.message || 'Failed to generate image');
        showNotification(data.message || 'Generation failed', 'error');
    }
}

// Video Generation
async function generateVideo(prompt) {
    const requestData = {
        prompt: prompt,
        style: elements.videoStyleSelect.value,
        duration: elements.durationSelect.value,
        resolution: elements.videoResolutionSelect.value,
        fps: parseInt(elements.fpsSelect.value)
    };
    
    const response = await fetch('/generate_video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
        showSuccessState(data, 'video');
        AppState.currentContent = { ...data, type: 'video' };
        showNotification('Video generated successfully!', 'success');
        loadHistory();
    } else {
        showErrorState(data.message || 'Failed to generate video');
        showNotification(data.message || 'Generation failed', 'error');
    }
}

// State Management
function showLoadingState() {
    hideAllStates();
    elements.loadingState.style.display = 'block';
    elements.generateBtn.disabled = true;
    elements.generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>Generating...`;
    
    // Enhanced progress animation
    const progressBar = elements.loadingState.querySelector('.progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3; // More realistic progress
        if (progress > 85) progress = 85;
        progressBar.style.width = progress + '%';
        
        if (!AppState.isGenerating) {
            clearInterval(interval);
            progressBar.style.width = '100%';
        }
    }, 800);
}

function showSuccessState(data, contentType) {
    hideAllStates();
    elements.successState.style.display = 'block';
    
    if (contentType === 'image') {
        elements.resultImage.src = data.imageUrl;
        elements.resultImage.alt = `Generated image: ${data.prompt}`;
        elements.resultImage.style.display = 'block';
        elements.resultVideo.style.display = 'none';
        elements.contentDuration.style.display = 'none';
    } else {
        elements.videoSource.src = data.videoUrl;
        elements.resultVideo.load();
        elements.resultVideo.style.display = 'block';
        elements.resultImage.style.display = 'none';
        elements.contentDuration.style.display = 'inline-block';
        elements.contentDuration.textContent = data.duration;
    }
    
    // Update content info
    elements.contentPrompt.textContent = data.prompt;
    elements.contentStyle.textContent = data.style;
    elements.contentResolution.textContent = data.resolution;
    
    // Show preview controls
    elements.previewControls.style.display = 'block';
    
    resetGenerateButton();
    
    // Smooth scroll to preview
    elements.successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showErrorState(message) {
    hideAllStates();
    elements.errorState.style.display = 'block';
    elements.errorMessage.textContent = message;
    elements.previewControls.style.display = 'none';
    resetGenerateButton();
}

function hideAllStates() {
    elements.loadingState.style.display = 'none';
    elements.emptyState.style.display = 'none';
    elements.errorState.style.display = 'none';
    elements.successState.style.display = 'none';
}

function resetPreview() {
    hideAllStates();
    elements.emptyState.style.display = 'block';
    elements.previewControls.style.display = 'none';
    AppState.currentContent = null;
}

function resetGenerateButton() {
    elements.generateBtn.disabled = false;
    const isVideoMode = AppState.contentMode === 'video';
    elements.generateBtn.innerHTML = `<i class="fas fa-magic me-2"></i>${isVideoMode ? 'Generate Video' : 'Generate Image'}`;
}

// Utility Functions
function getSelectedFormat() {
    const selected = document.querySelector('input[name="formatSelect"]:checked');
    return selected ? selected.value : 'PNG';
}

function updateFormatSelection() {
    // Visual feedback for format selection
    document.querySelectorAll('label[for^="format"]').forEach(label => {
        label.classList.remove('active');
    });
    
    const selected = document.querySelector('input[name="formatSelect"]:checked');
    if (selected) {
        document.querySelector(`label[for="${selected.id}"]`).classList.add('active');
    }
}

// Download and Share Functions
function downloadContent() {
    if (!AppState.currentContent) {
        showNotification('No content to download', 'warning');
        return;
    }
    
    const link = document.createElement('a');
    const isVideo = AppState.currentContent.type === 'video';
    
    link.href = isVideo ? AppState.currentContent.videoUrl : AppState.currentContent.imageUrl;
    
    const extension = isVideo ? 'mp4' : (AppState.currentContent.format || 'png').toLowerCase();
    link.download = `generated-${isVideo ? 'video' : 'image'}-${Date.now()}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`${isVideo ? 'Video' : 'Image'} download started`, 'success');
}

function shareContent() {
    if (!AppState.currentContent) {
        showNotification('No content to share', 'warning');
        return;
    }
    
    const isVideo = AppState.currentContent.type === 'video';
    const url = isVideo ? AppState.currentContent.videoUrl : AppState.currentContent.imageUrl;
    
    if (navigator.share) {
        navigator.share({
            title: 'AI Generated Content',
            text: AppState.currentContent.prompt,
            url: url
        }).then(() => {
            showNotification('Content shared successfully', 'success');
        }).catch(() => {
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

// Zoom Modal
function showZoomModal() {
    if (!AppState.currentContent) return;
    
    const isVideo = AppState.currentContent.type === 'video';
    
    if (isVideo) {
        document.getElementById('zoomVideoSource').src = AppState.currentContent.videoUrl;
        document.getElementById('zoomVideo').load();
        document.getElementById('zoomVideo').style.display = 'block';
        document.getElementById('zoomImage').style.display = 'none';
    } else {
        document.getElementById('zoomImage').src = AppState.currentContent.imageUrl;
        document.getElementById('zoomImage').style.display = 'block';
        document.getElementById('zoomVideo').style.display = 'none';
    }
    
    const zoomModal = new bootstrap.Modal(document.getElementById('zoomModal'));
    zoomModal.show();
}

// History Management
function switchHistoryMode(mode) {
    AppState.currentHistoryMode = mode;
    
    // Update button states
    elements.toggleImageHistory.classList.toggle('btn-primary', mode === 'image');
    elements.toggleImageHistory.classList.toggle('btn-outline-light', mode !== 'image');
    elements.toggleVideoHistory.classList.toggle('btn-primary', mode === 'video');
    elements.toggleVideoHistory.classList.toggle('btn-outline-light', mode !== 'video');
    
    loadHistory();
}

async function loadHistory() {
    try {
        elements.historyLoading.style.display = 'block';
        elements.historyEmpty.style.display = 'none';
        
        const endpoint = AppState.currentHistoryMode === 'video' ? '/video_history' : '/history';
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.status === 'success') {
            const items = AppState.currentHistoryMode === 'video' ? data.videos : data.images;
            if (AppState.currentHistoryMode === 'video') {
                AppState.videoHistory = items;
            } else {
                AppState.history = items;
            }
            renderHistory(items);
        } else {
            console.error('Failed to load history:', data.message);
            renderHistory([]);
        }
    } catch (error) {
        console.error('History loading error:', error);
        renderHistory([]);
    } finally {
        elements.historyLoading.style.display = 'none';
    }
}

function renderHistory(items) {
    elements.historyGrid.innerHTML = '';
    
    if (items.length === 0) {
        elements.historyEmpty.style.display = 'block';
        return;
    }
    
    items.forEach(item => {
        const historyItem = createHistoryItem(item);
        elements.historyGrid.appendChild(historyItem);
    });
}

function createHistoryItem(item) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
    
    const status = item.status || 'unknown';
    const statusClass = `status-${status}`;
    const isVideo = AppState.currentHistoryMode === 'video';
    
    const mediaContent = item.image_url || item.video_url ? 
        (isVideo ? 
            `<video class="history-image" muted>
                <source src="${item.video_url || item.thumbnail_url}" type="video/mp4">
            </video>` :
            `<img src="${item.image_url}" alt="${item.prompt}" class="history-image">`
        ) :
        `<div class="history-image d-flex align-items-center justify-content-center bg-secondary">
            <i class="fas fa-${isVideo ? 'video' : 'image'} fa-2x text-white"></i>
        </div>`;
    
    col.innerHTML = `
        <div class="history-item" onclick="loadHistoryItem(${item.id}, '${AppState.currentHistoryMode}')">
            ${mediaContent}
            <div class="history-prompt">${item.prompt}</div>
            <div class="history-meta">
                <span class="status-badge ${statusClass}">${status}</span>
                <small>${formatDate(item.created_at)}</small>
            </div>
            ${isVideo && item.duration ? `<div class="text-muted small mt-1">Duration: ${item.duration}</div>` : ''}
        </div>
    `;
    
    return col;
}

function loadHistoryItem(itemId, type) {
    const items = type === 'video' ? AppState.videoHistory : AppState.history;
    const item = items.find(i => i.id === itemId);
    
    if (!item) return;
    
    const contentUrl = type === 'video' ? item.video_url : item.image_url;
    if (!contentUrl) return;
    
    // Switch to correct mode if needed
    if (AppState.contentMode !== type) {
        const modeRadio = document.getElementById(`${type}Mode`);
        modeRadio.checked = true;
        switchContentMode(type);
    }
    
    AppState.currentContent = {
        type: type,
        prompt: item.prompt,
        style: item.style,
        resolution: item.resolution,
        ...(type === 'video' ? {
            videoUrl: item.video_url,
            duration: item.duration,
            fps: item.fps
        } : {
            imageUrl: item.image_url,
            format: item.format
        })
    };
    
    showSuccessState(AppState.currentContent, type);
    
    // Update form with item settings
    elements.promptInput.value = item.prompt;
    
    if (type === 'video') {
        elements.videoStyleSelect.value = item.style;
        elements.durationSelect.value = item.duration;
        elements.videoResolutionSelect.value = item.resolution;
        elements.fpsSelect.value = item.fps;
    } else {
        elements.styleSelect.value = item.style;
        elements.resolutionSelect.value = item.resolution;
        
        // Set format radio button
        const formatRadio = document.querySelector(`input[value="${item.format}"]`);
        if (formatRadio) {
            formatRadio.checked = true;
            updateFormatSelection();
        }
    }
    
    showNotification(`${type === 'video' ? 'Video' : 'Image'} loaded from history`, 'info');
}

function toggleHistory() {
    const isVisible = elements.historySection.style.display !== 'none';
    elements.historySection.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        loadHistory();
        elements.historySection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Batch Generation
function showBatchModal() {
    // Update modal content based on current mode
    const isVideoMode = AppState.contentMode === 'video';
    document.getElementById('batchModalTitle').textContent = `Batch ${isVideoMode ? 'Video' : 'Image'} Generation`;
    document.getElementById('batchDescription').textContent = `Generate multiple ${isVideoMode ? 'videos' : 'images'} from different prompts (max 5 per batch)`;
    document.getElementById('batchStartBtnText').textContent = `Start Batch ${isVideoMode ? 'Videos' : 'Images'}`;
    
    const batchModal = new bootstrap.Modal(document.getElementById('batchModal'));
    batchModal.show();
}

function addBatchPrompt() {
    if (AppState.batchPrompts >= 5) {
        showNotification('Maximum 5 prompts allowed', 'warning');
        return;
    }
    
    AppState.batchPrompts++;
    const promptDiv = document.createElement('div');
    promptDiv.className = 'mb-3';
    promptDiv.innerHTML = `
        <textarea class="form-control batch-prompt" rows="2" placeholder="Prompt ${AppState.batchPrompts}..."></textarea>
    `;
    
    document.getElementById('batchPrompts').appendChild(promptDiv);
}

function removeBatchPrompt() {
    if (AppState.batchPrompts <= 1) {
        showNotification('At least one prompt is required', 'warning');
        return;
    }
    
    const batchPrompts = document.getElementById('batchPrompts');
    const lastPrompt = batchPrompts.lastElementChild;
    if (lastPrompt) {
        lastPrompt.remove();
        AppState.batchPrompts--;
    }
}

async function handleBatchGenerate() {
    const prompts = Array.from(document.querySelectorAll('.batch-prompt'))
        .map(textarea => textarea.value.trim())
        .filter(prompt => prompt.length >= 3);
    
    if (prompts.length === 0) {
        showNotification('Please enter at least one valid prompt', 'warning');
        return;
    }
    
    const isVideoMode = AppState.contentMode === 'video';
    const endpoint = isVideoMode ? '/batch_generate_video' : '/batch_generate';
    
    const requestData = {
        prompts: prompts,
        ...(isVideoMode ? {
            style: elements.videoStyleSelect.value,
            duration: elements.durationSelect.value,
            resolution: elements.videoResolutionSelect.value,
            fps: parseInt(elements.fpsSelect.value)
        } : {
            style: elements.styleSelect.value,
            resolution: elements.resolutionSelect.value,
            format: getSelectedFormat()
        })
    };
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showNotification(`Batch generation started for ${data.results.length} ${isVideoMode ? 'videos' : 'images'}`, 'success');
            
            // Close modal
            const batchModal = bootstrap.Modal.getInstance(document.getElementById('batchModal'));
            batchModal.hide();
            
            // Refresh history after delay
            setTimeout(() => {
                loadHistory();
            }, 3000);
        } else {
            showNotification(data.message || 'Batch generation failed', 'error');
        }
    } catch (error) {
        console.error('Batch generation error:', error);
        showNotification('Network error during batch generation', 'error');
    }
}

// Gallery Modal (placeholder for future feature)
function showGalleryModal() {
    showNotification('Gallery feature coming soon!', 'info');
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    document.querySelectorAll('.notification-toast').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: slideInRight 0.3s ease-out;
    `;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${iconMap[type]} me-2"></i>
            <span class="flex-grow-1">${message}</span>
            <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }
    }, duration);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function smoothScrollTo(element) {
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter: Generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
    }
    
    // Ctrl/Cmd + H: Toggle History
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        toggleHistory();
    }
    
    // Ctrl/Cmd + T: Toggle Theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Tab: Switch between image and video modes
    if (e.key === 'Tab' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const currentMode = AppState.contentMode;
        const newMode = currentMode === 'image' ? 'video' : 'image';
        const modeRadio = document.getElementById(`${newMode}Mode`);
        modeRadio.checked = true;
        switchContentMode(newMode);
        e.preventDefault();
    }
});

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-toast {
        animation: slideInRight 0.3s ease-out;
    }
`;
document.head.appendChild(style);