/**
 * Main application script for the Tempora Clock Synchronization Web UI
 */

// Global variables
let referenceTime = '15:00';
let currentClockData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Core synchronization functions (matching the backend app.js)
function timeToMinutes(timeString) {
    if (typeof timeString !== 'string' || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        throw new Error(`Invalid time format: ${timeString}`);
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function synchronizeClocks(grandClockTime, clockTimes) {
    const grandClockMinutes = timeToMinutes(grandClockTime);
    return clockTimes.map(clockTime => {
        const clockMinutes = timeToMinutes(clockTime);
        return clockMinutes - grandClockMinutes;
    });
}

function getClockStatus(difference) {
    if (difference > 0) return 'AHEAD';
    if (difference < 0) return 'BEHIND';
    return 'SYNCHRONIZED';
}

function formatTimeDifference(difference) {
    const absValue = Math.abs(difference);
    if (absValue === 0) return '0 minutes';
    return `${absValue} minute${absValue !== 1 ? 's' : ''}`;
}

function initializeApp() {
    // Set up initial clock data (matching the challenge requirements)
    currentClockData = [
        { id: 1, time: '14:45', name: 'Town Square Clock' },
        { id: 2, time: '15:05', name: 'Railway Station Clock' },
        { id: 3, time: '15:00', name: 'City Hall Clock' },
        { id: 4, time: '14:40', name: 'Market Clock' }
    ];
    
    // Initialize the UI
    updateGrandClock();
    updateTownClocks();
    updateResults();
    
    // Set up clock hands animation
    animateClockHands();
    
    console.log('🕐 Tempora Clock Synchronization System initialized');
}

function updateGrandClock() {
    const grandClockTime = document.getElementById('grandClockTime');
    const grandHourHand = document.getElementById('grandHourHand');
    const grandMinuteHand = document.getElementById('grandMinuteHand');
    
    if (grandClockTime) {
        grandClockTime.textContent = referenceTime;
    }
    
    // Set clock hands for grand clock
    if (grandHourHand && grandMinuteHand) {
        setClockHands(grandHourHand, grandMinuteHand, referenceTime);
    }
}

function updateTownClocks() {
    const clocksGrid = document.getElementById('clocksGrid');
    if (!clocksGrid) return;
    
    clocksGrid.innerHTML = '';
    
    currentClockData.forEach((clock, index) => {
        const difference = timeToMinutes(clock.time) - timeToMinutes(referenceTime);
        const status = getClockStatus(difference);
        const statusClass = status.toLowerCase();
        
        const clockCard = document.createElement('div');
        clockCard.className = `clock-card ${statusClass} fade-in`;
        clockCard.style.animationDelay = `${index * 0.1}s`;
        
        clockCard.innerHTML = `
            <div class="clock-header">
                <div class="clock-title">${clock.name}</div>
                <div class="clock-status status-${statusClass}">${status}</div>
            </div>
            <div class="clock-time">${clock.time}</div>
            <div class="clock-difference">
                ${difference === 0 ? 'Perfectly synchronized' : 
                  `${formatTimeDifference(difference)} ${status.toLowerCase()}`}
            </div>
        `;
        
        clocksGrid.appendChild(clockCard);
    });
}

function updateResults() {
    const clockTimes = currentClockData.map(clock => clock.time);
    const differences = synchronizeClocks(referenceTime, clockTimes);
    
    // Calculate analysis
    const analysis = {
        ahead: differences.filter(d => d > 0).length,
        behind: differences.filter(d => d < 0).length,
        synchronized: differences.filter(d => d === 0).length,
        totalClocks: differences.length
    };
    
    // Update summary cards
    updateSummaryCards(analysis);
    
    // Update data table
    updateDataTable(differences);
    
    // Update array display
    updateArrayDisplay(differences);
}

function updateSummaryCards(analysis) {
    const elements = {
        clocksAhead: document.getElementById('clocksAhead'),
        clocksBehind: document.getElementById('clocksBehind'),
        clocksSynced: document.getElementById('clocksSynced'),
        totalClocks: document.getElementById('totalClocks')
    };
    
    if (elements.clocksAhead) elements.clocksAhead.textContent = analysis.ahead;
    if (elements.clocksBehind) elements.clocksBehind.textContent = analysis.behind;
    if (elements.clocksSynced) elements.clocksSynced.textContent = analysis.synchronized;
    if (elements.totalClocks) elements.totalClocks.textContent = analysis.totalClocks;
}

function updateDataTable(differences) {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    currentClockData.forEach((clock, index) => {
        const difference = differences[index];
        const status = getClockStatus(difference);
        const clockName = clock.name || `Clock ${index + 1}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${clockName}</strong></td>
            <td><span style="font-family: 'Orbitron', monospace; font-weight: 600;">${clock.time}</span></td>
            <td><span style="font-family: 'Orbitron', monospace;">${difference >= 0 ? '+' : ''}${difference} min</span></td>
            <td><span class="clock-status status-${status.toLowerCase()}">${status}</span></td>
            <td>
                <span class="sync-indicator ${difference === 0 ? 'sync-good' : 'sync-needed'}">
                    <i class="fas ${difference === 0 ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
                    ${difference === 0 ? 'Good' : 'Needs Sync'}
                </span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateArrayDisplay(differences) {
    const arrayContent = document.getElementById('arrayContent');
    if (!arrayContent) return;
    
    const formattedArray = differences.map(diff => {
        const color = diff > 0 ? '#f39c12' : diff < 0 ? '#e74c3c' : '#27ae60';
        return `<span style="color: ${color}; font-weight: bold;">${diff}</span>`;
    }).join(', ');
    
    arrayContent.innerHTML = formattedArray;
}

function setClockHands(hourHand, minuteHand, timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour + minute adjustment
    const minuteAngle = minutes * 6; // 6 degrees per minute
    
    if (hourHand) hourHand.style.transform = `rotate(${hourAngle}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
}

function animateClockHands() {
    // Animate all clock hands to their positions
    const grandHourHand = document.getElementById('grandHourHand');
    const grandMinuteHand = document.getElementById('grandMinuteHand');
    
    if (grandHourHand && grandMinuteHand) {
        setClockHands(grandHourHand, grandMinuteHand, referenceTime);
    }
}

// Control functions
function refreshData() {
    const button = event.target.closest('.btn');
    if (button) {
        button.classList.add('loading');
        setTimeout(() => {
            button.classList.remove('loading');
        }, 1000);
    }
    
    // Add some animation
    document.querySelectorAll('.clock-card, .summary-card').forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeIn 0.6s ease forwards`;
            card.style.animationDelay = `${index * 0.05}s`;
        }, 10);
    });
    
    // Refresh all data
    updateTownClocks();
    updateResults();
    
    console.log('🔄 Data refreshed');
}

function generateRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function addRandomClock() {
    const randomTime = generateRandomTime();
    const clockNames = [
        'Library Clock', 'Hospital Clock', 'School Clock', 'Park Clock',
        'Museum Clock', 'Theater Clock', 'Café Clock', 'Bakery Clock',
        'Bank Clock', 'Post Office Clock', 'Fire Station Clock', 'Library Clock'
    ];
    
    const usedNames = currentClockData.map(clock => clock.name);
    const availableNames = clockNames.filter(name => !usedNames.includes(name));
    
    if (availableNames.length === 0) {
        alert('Maximum number of unique clocks reached!');
        return;
    }
    
    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    const newClock = {
        id: currentClockData.length + 1,
        time: randomTime,
        name: randomName
    };
    
    currentClockData.push(newClock);
    
    // Update UI
    updateTownClocks();
    updateResults();
    
    console.log(`➕ Added new clock: ${randomName} at ${randomTime}`);
}

function synchronizeAll() {
    const button = event.target.closest('.btn');
    if (button) {
        button.classList.add('loading');
    }
    
    // Animate synchronization
    let syncCount = 0;
    const totalClocks = currentClockData.length;
    
    const syncInterval = setInterval(() => {
        if (syncCount < totalClocks) {
            // Synchronize one clock at a time
            currentClockData[syncCount].time = referenceTime;
            updateTownClocks();
            updateResults();
            syncCount++;
        } else {
            clearInterval(syncInterval);
            if (button) {
                button.classList.remove('loading');
            }
            
            // Show success message
            setTimeout(() => {
                alert('🎉 All clocks have been synchronized with the Grand Clock Tower!');
            }, 500);
        }
    }, 800);
    
    console.log('🔄 Synchronizing all clocks...');
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: var(--primary-color);
        color: white;
        border-radius: 10px;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add some interactive features
document.addEventListener('click', function(e) {
    if (e.target.closest('.clock-card')) {
        const card = e.target.closest('.clock-card');
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'r':
                e.preventDefault();
                refreshData();
                break;
            case 'n':
                e.preventDefault();
                addRandomClock();
                break;
            case 's':
                e.preventDefault();
                synchronizeAll();
                break;
        }
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

console.log('🚀 Tempora Clock Synchronization Web UI loaded successfully!');
