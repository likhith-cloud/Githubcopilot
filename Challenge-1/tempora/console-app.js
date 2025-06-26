/**
 * Tempora Clock Synchronization System - Simple Console Version
 */

/**
 * Converts time string to minutes since midnight
 */
function timeToMinutes(timeString) {
    if (typeof timeString !== 'string' || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        throw new Error(`Invalid time format: ${timeString}`);
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Synchronize clocks with Grand Clock Tower
 */
function synchronizeClocks(grandClockTime, clockTimes) {
    const grandClockMinutes = timeToMinutes(grandClockTime);
    return clockTimes.map(clockTime => {
        const clockMinutes = timeToMinutes(clockTime);
        return clockMinutes - grandClockMinutes;
    });
}

/**
 * Display results in console
 */
function displayResults(clockTimes, differences) {
    console.log('🕐 TEMPORA CLOCK SYNCHRONIZATION SYSTEM 🕐');
    console.log('==========================================');
    console.log('Grand Clock Tower Time: 15:00');
    console.log('------------------------------------------');
    
    clockTimes.forEach((time, index) => {
        const diff = differences[index];
        const status = diff > 0 ? 'AHEAD' : diff < 0 ? 'BEHIND' : 'SYNCHRONIZED';
        const diffText = diff === 0 ? '0 minutes' : `${Math.abs(diff)} minute${Math.abs(diff) !== 1 ? 's' : ''}`;
        console.log(`Clock ${index + 1}: ${time} | ${diffText} ${status}`);
    });
    
    console.log('------------------------------------------');
    console.log('Time Differences Array:', differences);
    
    const ahead = differences.filter(d => d > 0).length;
    const behind = differences.filter(d => d < 0).length;
    const synced = differences.filter(d => d === 0).length;
    
    console.log('\n📊 ANALYSIS:');
    console.log(`• Clocks ahead: ${ahead}`);
    console.log(`• Clocks behind: ${behind}`);
    console.log(`• Clocks synchronized: ${synced}`);
}

// Main execution
function main() {
    const grandClockTowerTime = '15:00';
    const townClockTimes = ['14:45', '15:05', '15:00', '14:40'];
    
    const differences = synchronizeClocks(grandClockTowerTime, townClockTimes);
    displayResults(townClockTimes, differences);
    
    return { clockTimes: townClockTimes, differences };
}

// Export for web usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { timeToMinutes, synchronizeClocks, displayResults, main };
}

// Run if executed directly
if (require.main === module) {
    main();
}
