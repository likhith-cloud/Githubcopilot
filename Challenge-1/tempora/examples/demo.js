/**
 * Demo examples for the Tempora Clock Synchronization System
 */

const { timeToMinutes, synchronizeClocks, displayResults, main } = require('../console-app');

console.log('🎯 TEMPORA CLOCK SYNC - DEMO EXAMPLES\n');

// Example 1: Basic usage with challenge data
console.log('📋 EXAMPLE 1: Challenge Data');
console.log('============================');
main();

// Example 2: Different reference time
console.log('\n\n📋 EXAMPLE 2: Morning Office Scenario');
console.log('====================================');
const morningClocks = ['08:58', '09:02', '09:00', '08:55', '09:05'];
const morningDiffs = synchronizeClocks('09:00', morningClocks);
console.log('Grand Clock Tower Time: 09:00');
console.log('------------------------------------------');
morningClocks.forEach((time, index) => {
    const diff = morningDiffs[index];
    const status = diff > 0 ? 'AHEAD' : diff < 0 ? 'BEHIND' : 'SYNCHRONIZED';
    const diffText = diff === 0 ? '0 minutes' : `${Math.abs(diff)} minute${Math.abs(diff) !== 1 ? 's' : ''}`;
    console.log(`Clock ${index + 1}: ${time} | ${diffText} ${status}`);
});
console.log('Time Differences Array:', morningDiffs);

// Example 3: Midnight scenario
console.log('\n\n📋 EXAMPLE 3: Midnight Shift');
console.log('===========================');
const midnightClocks = ['23:58', '00:02', '00:00', '23:55'];
const midnightDiffs = synchronizeClocks('00:00', midnightClocks);
console.log('Grand Clock Tower Time: 00:00');
console.log('------------------------------------------');
midnightClocks.forEach((time, index) => {
    const diff = midnightDiffs[index];
    const status = diff > 0 ? 'AHEAD' : diff < 0 ? 'BEHIND' : 'SYNCHRONIZED';
    const diffText = diff === 0 ? '0 minutes' : `${Math.abs(diff)} minute${Math.abs(diff) !== 1 ? 's' : ''}`;
    console.log(`Clock ${index + 1}: ${time} | ${diffText} ${status}`);
});
console.log('Time Differences Array:', midnightDiffs);

// Example 4: Large differences
console.log('\n\n📋 EXAMPLE 4: Broken Clocks (Large Differences)');
console.log('===============================================');
const brokenClocks = ['10:00', '18:30', '12:00', '02:15'];
const brokenDiffs = synchronizeClocks('12:00', brokenClocks);
console.log('Grand Clock Tower Time: 12:00');
console.log('------------------------------------------');
brokenClocks.forEach((time, index) => {
    const diff = brokenDiffs[index];
    const status = diff > 0 ? 'AHEAD' : diff < 0 ? 'BEHIND' : 'SYNCHRONIZED';
    const diffText = diff === 0 ? '0 minutes' : `${Math.abs(diff)} minute${Math.abs(diff) !== 1 ? 's' : ''}`;
    console.log(`Clock ${index + 1}: ${time} | ${diffText} ${status}`);
});
console.log('Time Differences Array:', brokenDiffs);

// Example 5: All synchronized
console.log('\n\n📋 EXAMPLE 5: Perfect Synchronization');
console.log('====================================');
const perfectClocks = ['15:00', '15:00', '15:00', '15:00'];
const perfectDiffs = synchronizeClocks('15:00', perfectClocks);
console.log('Grand Clock Tower Time: 15:00');
console.log('------------------------------------------');
perfectClocks.forEach((time, index) => {
    const diff = perfectDiffs[index];
    const status = diff > 0 ? 'AHEAD' : diff < 0 ? 'BEHIND' : 'SYNCHRONIZED';
    const diffText = diff === 0 ? '0 minutes' : `${Math.abs(diff)} minute${Math.abs(diff) !== 1 ? 's' : ''}`;
    console.log(`Clock ${index + 1}: ${time} | ${diffText} ${status}`);
});
console.log('Time Differences Array:', perfectDiffs);

console.log('\n🎉 Demo completed! All examples executed successfully.');
