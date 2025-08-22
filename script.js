// Global Variables
let userCredits = 15;
let userBookings = [];
let selectedClassForModal = null;

// Classes Data
const classes = [
    {
        id: 1,
        name: 'Morning Yoga Flow',
        instructor: 'Sarah Chen',
        time: '07:00',
        duration: 60,
        capacity: 20,
        booked: 15,
        difficulty: 'Beginner',
        type: 'Yoga',
        description: 'Start your day with energizing yoga flow sequences',
        price: 25,
        icon: '🧘‍♀️'
    },
    {
        id: 2,
        name: 'HIIT Cardio Blast',
        instructor: 'Mike Johnson',
        time: '09:00',
        duration: 45,
        capacity: 15,
        booked: 12,
        difficulty: 'Advanced',
        type: 'Cardio',
        description: 'High-intensity interval training for maximum burn',
        price: 30,
        icon: '🔥'
    },
    {
        id: 3,
        name: 'Strength & Conditioning',
        instructor: 'Alex Rodriguez',
        time: '11:00',
        duration: 90,
        capacity: 12,
        booked: 8,
        difficulty: 'Intermediate',
        type: 'Strength',
        description: 'Build muscle and improve functional strength',
        price: 35,
        icon: '💪'
    },
    {
        id: 4,
        name: 'Pilates Core',
        instructor: 'Emma Wilson',
        time: '18:00',
        duration: 60,
        capacity: 18,
        booked: 16,
        difficulty: 'Intermediate',
        type: 'Pilates',
        description: 'Focus on core strength and stability',
        price: 28,
        icon: '🎯'
    },
    {
        id: 5,
        name: 'Boxing Fundamentals',
        instructor: 'Carlos Martinez',
        time: '19:30',
        duration: 75,
        capacity: 10,
        booked: 7,
        difficulty: 'Beginner',
        type: 'Boxing',
        description: 'Learn proper boxing technique and conditioning',
        price: 32,
        icon: '🥊'
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    renderClasses();
    updateCreditsDisplay();
    renderBookings();
});

// Initialize date picker with today's date
function initializeDatePicker() {
    const datePicker = document.getElementById('date-picker');
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    updateSelectedDate(today);
    
    datePicker.addEventListener('change', function() {
        updateSelectedDate(this.value);
    });
}

// Update selected date display
function updateSelectedDate(date) {
    const selectedDateSpan = document.getElementById('selected-date');
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    selectedDateSpan.textContent = formattedDate;
}

// Render classes grid
function renderClasses() {
    const classesGrid = document.getElementById('classes-grid');
    classesGrid.innerHTML = '';
    
    classes.forEach(classItem => {
        const classCard = createClassCard(classItem);
        classesGrid.appendChild(classCard);
    });
}

// Create individual class card
function createClassCard(classItem) {
    const card = document.createElement('div');
    card.className = 'class-card';
    
    const availabilityRatio = classItem.booked / classItem.capacity;
    let availabilityClass = 'high';
    if (availabilityRatio >= 0.8) availabilityClass = 'low';
    else if (availabilityRatio >= 0.5) availabilityClass = 'medium';
    
    const difficultyClass = `difficulty-${classItem.difficulty.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="class-card-content">
            <div class="class-header">
                <div class="class-title">
                    <div class="class-icon">${classItem.icon}</div>
                    <div class="class-info">
                        <h3>${classItem.name}</h3>
                        <p>${classItem.instructor}</p>
                    </div>
                </div>
                <span class="difficulty-badge ${difficultyClass}">${classItem.difficulty}</span>
            </div>
            
            <p class="class-description">${classItem.description}</p>
            
            <div class="class-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${classItem.time} (${classItem.duration}min)</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Studio ${classItem.id}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span class="availability ${availabilityClass}">${classItem.booked}/${classItem.capacity} spots filled</span>
                </div>
                <div class="detail-item price">
                    <span>$${classItem.price}</span>
                </div>
            </div>
            
            <div class="class-actions">
                <button class="btn btn-primary" onclick="showClassDetails(${classItem.id})">
                    View Details
                </button>
                <button class="btn btn-success" onclick="bookClass(${classItem.id})" 
                        ${classItem.booked >= classItem.capacity || userCredits === 0 ? 'disabled' : ''}>
                    ${classItem.booked >= classItem.capacity ? 'Full' : 'Book Now'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show class details in modal
function showClassDetails(classId) {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;
    
    selectedClassForModal = classItem;
    
    // Populate modal with class details
    document.getElementById('modal-class-name').textContent = classItem.name;
    document.getElementById('modal-class-icon').textContent = classItem.icon;
    document.getElementById('modal-class-description').textContent = classItem.description;
    document.getElementById('modal-instructor').textContent = classItem.instructor;
    document.getElementById('modal-time').textContent = classItem.time;
    document.getElementById('modal-duration').textContent = `${classItem.duration} minutes`;
    document.getElementById('modal-price').textContent = `$${classItem.price}`;
    
    const difficultyBadge = document.getElementById('modal-difficulty');
    difficultyBadge.textContent = classItem.difficulty;
    difficultyBadge.className = `difficulty-badge difficulty-${classItem.difficulty.toLowerCase()}`;
    
    // Update book button
    const bookBtn = document.getElementById('modal-book-btn');
    if (classItem.booked >= classItem.capacity) {
        bookBtn.textContent = 'Class Full';
        bookBtn.disabled = true;
    } else if (userCredits === 0) {
        bookBtn.textContent = 'No Credits Left';
        bookBtn.disabled = true;
    } else {
        bookBtn.textContent = 'Book This Class';
        bookBtn.disabled = false;
    }
    
    // Show modal
    document.getElementById('class-modal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('class-modal').classList.add('hidden');
    selectedClassForModal = null;
}

// Book class from modal
function bookFromModal() {
    if (selectedClassForModal) {
        bookClass(selectedClassForModal.id);
        closeModal();
    }
}

// Book a class
function bookClass(classId) {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;
    
    // Check if class is full or user has no credits
    if (classItem.booked >= classItem.capacity) {
        alert('This class is full!');
        return;
    }
    
    if (userCredits <= 0) {
        alert('You have no credits remaining!');
        return;
    }
    
    // Book the class
    classItem.booked += 1;
    userCredits -= 1;
    
    // Add to user bookings
    const booking = {
        id: Date.now(),
        classId: classItem.id,
        name: classItem.name,
        instructor: classItem.instructor,
        time: classItem.time,
        date: document.getElementById('date-picker').value
    };
    
    userBookings.push(booking);
    
    // Update UI
    renderClasses();
    updateCreditsDisplay();
    renderBookings();
    
    alert(`Successfully booked ${classItem.name}!`);
}

// Cancel a booking
function cancelBooking(bookingId) {
    const booking = userBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Find the class and reduce booked count
    const classItem = classes.find(c => c.id === booking.classId);
    if (classItem) {
        classItem.booked -= 1;
    }
    
    // Remove booking and restore credit
    userBookings = userBookings.filter(b => b.id !== bookingId);
    userCredits += 1;
    
    // Update UI
    renderClasses();
    updateCreditsDisplay();
    renderBookings();
    
    alert(`Cancelled booking for ${booking.name}`);
}

// Update credits display
function updateCreditsDisplay() {
    document.getElementById('credits').textContent = userCredits;
    document.getElementById('credits-display').textContent = userCredits;
}

// Render user bookings
function renderBookings() {
    const bookingsContainer = document.getElementById('user-bookings');
    
    if (userBookings.length === 0) {
        bookingsContainer.innerHTML = '<p class="no-bookings">No bookings yet</p>';
        return;
    }
    
    bookingsContainer.innerHTML = '';
    
    userBookings.forEach(booking => {
        const bookingElement = document.createElement('div');
        bookingElement.className = 'booking-item';
        
        bookingElement.innerHTML = `
            <h4>${booking.name}</h4>
            <p>${booking.time} • ${booking.date}</p>
            <p>${booking.instructor}</p>
            <button class="cancel-btn" onclick="cancelBooking(${booking.id})">Cancel</button>
        `;
        
        bookingsContainer.appendChild(bookingElement);
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('class-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});