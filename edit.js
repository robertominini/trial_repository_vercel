// Feed data structure
let feedData = [];
let currentEditingIndex = null;

// Load initial feed data from localStorage or use default
function loadFeedData() {
    const savedData = localStorage.getItem('feedData');
    if (savedData) {
        feedData = JSON.parse(savedData);
    } else {
        // Default feed structure
        feedData = [
            {
                type: 'intro',
                lessonNumber: 1,
                badge: 'LESSON 1 • WARM UP',
                title: '🔥 Full Body Warm Up',
                description: 'Warming up is essential to prepare your muscles and joints for exercise. This routine will increase your heart rate gradually and reduce the risk of injury.',
                stats: ['⏱️ 10 minutes', '📊 Beginner Friendly', '💪 Full Body'],
                items: ['Comfortable workout clothes', 'Water bottle', 'Clear space to move']
            },
            {
                type: 'video',
                lessonNumber: 1,
                youtubeId: 'ml6cT4AZdqI'
            },
            {
                type: 'explanation',
                title: '✅ Great Work!',
                description: 'You\'ve completed your warm-up! Your body is now ready for more intense exercise. Remember to:',
                items: ['Always start with a warm-up to prevent injuries', 'Focus on movements that mimic your workout', 'Gradually increase intensity', 'Stay hydrated throughout'],
                nextLesson: 'Ready for the next challenge? Let\'s strengthen your core! 💪'
            },
            {
                type: 'intro',
                lessonNumber: 2,
                badge: 'LESSON 2 • CORE STRENGTH',
                title: '💪 Core Strengthening',
                description: 'A strong core is the foundation of all movement. These exercises will improve your stability, posture, and overall strength.',
                stats: ['⏱️ 15 minutes', '📊 Intermediate', '🎯 Core Focus'],
                items: ['Exercise mat (optional)', 'Towel for comfort', 'Water bottle']
            },
            {
                type: 'video',
                lessonNumber: 2,
                youtubeId: '1919eTCoESo'
            },
            {
                type: 'explanation',
                title: '💪 Excellent Effort!',
                description: 'Your core is now activated! A strong core helps with:',
                items: ['Improved posture and balance', 'Better athletic performance', 'Reduced back pain', 'Enhanced stability in daily activities'],
                nextLesson: 'Time to cool down and stretch those muscles! 🧘'
            },
            {
                type: 'intro',
                lessonNumber: 3,
                badge: 'LESSON 3 • COOL DOWN',
                title: '🧘 Stretching & Recovery',
                description: 'Cooling down helps your body transition back to rest. These stretches will improve flexibility and aid muscle recovery.',
                stats: ['⏱️ 12 minutes', '📊 All Levels', '🌟 Flexibility'],
                items: ['Comfortable space', 'Mat or soft surface', 'Deep breaths and patience']
            },
            {
                type: 'video',
                lessonNumber: 3,
                youtubeId: 'g_tea8ZNk5A'
            },
            {
                type: 'congratulations',
                title: 'Congratulations!',
                message: 'You\'ve completed the Physical Wellness Training Course!',
                achievements: ['✓ Full Body Warm-Up Routine', '✓ Core Strengthening Exercises', '✓ Stretching & Recovery Session'],
                totalTime: 'Total Training Time: 37 minutes',
                motivationalText: 'Your body is stronger than it was 37 minutes ago. Keep up the amazing work!'
            }
        ];
    }
    renderFeedStructure();
}

// Save feed data to localStorage
function saveFeedData() {
    localStorage.setItem('feedData', JSON.stringify(feedData));
    showSuccessMessage('Changes saved successfully!');
}

// Render feed structure in sidebar
function renderFeedStructure() {
    const container = document.getElementById('feedStructure');
    container.innerHTML = feedData.map((item, index) => {
        let title = '';
        let type = '';
        
        if (item.type === 'intro') {
            title = item.title;
            type = 'Intro Screen';
        } else if (item.type === 'video') {
            title = `Video - Lesson ${item.lessonNumber}`;
            type = 'Video';
        } else if (item.type === 'explanation') {
            title = item.title;
            type = 'Explanation';
        } else if (item.type === 'congratulations') {
            title = 'Congratulations';
            type = 'Ending';
        }
        
        return `
            <div class="feed-item ${currentEditingIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="feed-item-header">
                    <span class="feed-item-type">${type}</span>
                    <div class="feed-item-actions">
                        <button class="icon-btn drag-handle">☰</button>
                        <button class="icon-btn delete-btn" data-index="${index}">🗑️</button>
                    </div>
                </div>
                <div class="feed-item-title">${title}</div>
            </div>
        `;
    }).join('');
    
    // Add click listeners
    document.querySelectorAll('.feed-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn') && !e.target.classList.contains('drag-handle')) {
                const index = parseInt(item.dataset.index);
                editItem(index);
            }
        });
    });
    
    // Add delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            if (confirm('Are you sure you want to delete this item?')) {
                feedData.splice(index, 1);
                if (currentEditingIndex === index) {
                    currentEditingIndex = null;
                    showWelcomeMessage();
                }
                renderFeedStructure();
            }
        });
    });
}

// Edit item
function editItem(index) {
    currentEditingIndex = index;
    const item = feedData[index];
    renderFeedStructure();
    
    const editorForm = document.getElementById('editorForm');
    
    if (item.type === 'intro') {
        editorForm.innerHTML = `
            <div class="form-header">
                <h2>Edit Intro Screen</h2>
            </div>
            <div class="form-group">
                <label>Lesson Badge</label>
                <input type="text" id="badge" value="${item.badge || ''}" placeholder="LESSON 1 • WARM UP">
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="title" value="${item.title || ''}" placeholder="🔥 Full Body Warm Up">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="description" placeholder="Enter description...">${item.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Stats (one per line)</label>
                <textarea id="stats" placeholder="⏱️ 10 minutes\n📊 Beginner Friendly">${(item.stats || []).join('\n')}</textarea>
                <small>Each line will be shown as a stat badge</small>
            </div>
            <div class="form-group">
                <label>What You'll Need (one per line)</label>
                <textarea id="items" placeholder="Comfortable workout clothes\nWater bottle">${(item.items || []).join('\n')}</textarea>
            </div>
            <button class="btn btn-primary" onclick="saveCurrentItem()">💾 Save Changes</button>
        `;
    } else if (item.type === 'video') {
        editorForm.innerHTML = `
            <div class="form-header">
                <h2>Edit Video</h2>
            </div>
            <div class="form-group">
                <label>Lesson Number</label>
                <input type="number" id="lessonNumber" value="${item.lessonNumber || 1}" min="1">
            </div>
            <div class="form-group">
                <label>YouTube Video ID</label>
                <input type="text" id="youtubeId" value="${item.youtubeId || ''}" placeholder="dQw4w9WgXcQ">
                <small>The ID from the YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong></small>
            </div>
            <div class="form-group">
                <label>Preview</label>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background: #000;">
                    <iframe 
                        src="https://www.youtube.com/embed/${item.youtubeId || ''}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        frameborder="0"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            <button class="btn btn-primary" onclick="saveCurrentItem()">💾 Save Changes</button>
        `;
    } else if (item.type === 'explanation') {
        editorForm.innerHTML = `
            <div class="form-header">
                <h2>Edit Explanation Screen</h2>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="title" value="${item.title || ''}" placeholder="✅ Great Work!">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="description" placeholder="Enter description...">${item.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Key Takeaways (one per line)</label>
                <textarea id="items" placeholder="Always start with a warm-up\nFocus on proper form">${(item.items || []).join('\n')}</textarea>
            </div>
            <div class="form-group">
                <label>Next Lesson Text (optional)</label>
                <input type="text" id="nextLesson" value="${item.nextLesson || ''}" placeholder="Ready for the next challenge?">
            </div>
            <button class="btn btn-primary" onclick="saveCurrentItem()">💾 Save Changes</button>
        `;
    } else if (item.type === 'congratulations') {
        editorForm.innerHTML = `
            <div class="form-header">
                <h2>Edit Congratulations Screen</h2>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="title" value="${item.title || ''}" placeholder="Congratulations!">
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea id="message" placeholder="You've completed the course!">${item.message || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Achievements (one per line)</label>
                <textarea id="achievements" placeholder="✓ Completed warm-up\n✓ Finished core workout">${(item.achievements || []).join('\n')}</textarea>
            </div>
            <div class="form-group">
                <label>Total Time</label>
                <input type="text" id="totalTime" value="${item.totalTime || ''}" placeholder="Total Training Time: 37 minutes">
            </div>
            <div class="form-group">
                <label>Motivational Text</label>
                <textarea id="motivationalText" placeholder="Keep up the great work!">${item.motivationalText || ''}</textarea>
            </div>
            <button class="btn btn-primary" onclick="saveCurrentItem()">💾 Save Changes</button>
        `;
    }
}

// Save current item being edited
window.saveCurrentItem = function() {
    if (currentEditingIndex === null) return;
    
    const item = feedData[currentEditingIndex];
    
    if (item.type === 'intro') {
        item.badge = document.getElementById('badge').value;
        item.title = document.getElementById('title').value;
        item.description = document.getElementById('description').value;
        item.stats = document.getElementById('stats').value.split('\n').filter(s => s.trim());
        item.items = document.getElementById('items').value.split('\n').filter(s => s.trim());
    } else if (item.type === 'video') {
        item.lessonNumber = parseInt(document.getElementById('lessonNumber').value);
        item.youtubeId = document.getElementById('youtubeId').value;
    } else if (item.type === 'explanation') {
        item.title = document.getElementById('title').value;
        item.description = document.getElementById('description').value;
        item.items = document.getElementById('items').value.split('\n').filter(s => s.trim());
        item.nextLesson = document.getElementById('nextLesson').value;
    } else if (item.type === 'congratulations') {
        item.title = document.getElementById('title').value;
        item.message = document.getElementById('message').value;
        item.achievements = document.getElementById('achievements').value.split('\n').filter(s => s.trim());
        item.totalTime = document.getElementById('totalTime').value;
        item.motivationalText = document.getElementById('motivationalText').value;
    }
    
    renderFeedStructure();
    showSuccessMessage('Item updated!');
};

// Show welcome message
function showWelcomeMessage() {
    document.getElementById('editorForm').innerHTML = `
        <div class="welcome-message">
            <h2>👈 Select an item from the sidebar to start editing</h2>
            <p>You can reorder items by dragging them in the sidebar</p>
        </div>
    `;
}

// Show success message
function showSuccessMessage(message) {
    const el = document.createElement('div');
    el.className = 'success-message';
    el.textContent = message;
    document.body.appendChild(el);
    
    setTimeout(() => {
        el.remove();
    }, 3000);
}

// Add new item
function addNewItem(type) {
    let newItem = { type };
    
    if (type === 'intro') {
        newItem = {
            type: 'intro',
            lessonNumber: 1,
            badge: 'NEW LESSON',
            title: 'New Lesson Title',
            description: 'Enter your lesson description here...',
            stats: ['⏱️ Duration', '📊 Level', '💪 Focus'],
            items: ['Item 1', 'Item 2', 'Item 3']
        };
    } else if (type === 'video') {
        newItem = {
            type: 'video',
            lessonNumber: 1,
            youtubeId: 'dQw4w9WgXcQ'
        };
    } else if (type === 'explanation') {
        newItem = {
            type: 'explanation',
            title: 'Explanation Title',
            description: 'Description text...',
            items: ['Point 1', 'Point 2', 'Point 3'],
            nextLesson: 'What\'s next?'
        };
    } else if (type === 'congratulations') {
        newItem = {
            type: 'congratulations',
            title: 'Congratulations!',
            message: 'You did it!',
            achievements: ['Achievement 1', 'Achievement 2'],
            totalTime: 'Total Time',
            motivationalText: 'Keep going!'
        };
    }
    
    feedData.push(newItem);
    renderFeedStructure();
    closeModal();
    editItem(feedData.length - 1);
}

// Modal functions
function openModal() {
    document.getElementById('addItemModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addItemModal').classList.remove('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFeedData();
    
    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveFeedData();
    });
    
    // Preview button
    document.getElementById('previewBtn').addEventListener('click', () => {
        saveFeedData();
        window.open('feed.html', '_blank');
    });
    
    // Add item button
    document.getElementById('addItemBtn').addEventListener('click', openModal);
    
    // Modal close
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Item type buttons
    document.querySelectorAll('.item-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            addNewItem(type);
        });
    });
    
    // Close modal on outside click
    document.getElementById('addItemModal').addEventListener('click', (e) => {
        if (e.target.id === 'addItemModal') {
            closeModal();
        }
    });
});
