/**
 * Test suite for Tempora Clock Synchronization System
 * Simple tests for the function-based implementation
 */

const { timeToMinutes, synchronizeClocks, main } = require('../console-app');

class SimpleTestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        try {
            testFn();
            console.log(`✅ ${name}`);
            this.passed++;
        } catch (error) {
            console.log(`❌ ${name}`);
            console.log(`   Error: ${error.message}\n`);
            this.failed++;
        }
    }

    assertEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
        }
    }

    assertThrows(fn, expectedMessage = '') {
        try {
            fn();
            throw new Error('Expected function to throw an error');
        } catch (error) {
            if (expectedMessage && !error.message.includes(expectedMessage)) {
                throw new Error(`Expected error message to contain "${expectedMessage}", got "${error.message}"`);
            }
        }
    }

    printSummary() {
        const total = this.passed + this.failed;
        console.log('\n📊 TEST SUMMARY');
        console.log('================');
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / total) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log(`\n⚠️  ${this.failed} test(s) failed.`);
        }
    }
}

// Run tests
console.log('🧪 Running Tempora Clock Synchronization Tests\n');

const runner = new SimpleTestRunner();

// Test timeToMinutes function
runner.test('timeToMinutes - Valid times', () => {
    runner.assertEqual(timeToMinutes('00:00'), 0, 'Midnight should be 0 minutes');
    runner.assertEqual(timeToMinutes('01:00'), 60, '1 AM should be 60 minutes');
    runner.assertEqual(timeToMinutes('15:00'), 900, '15:00 should be 900 minutes');
    runner.assertEqual(timeToMinutes('23:59'), 1439, '23:59 should be 1439 minutes');
});

runner.test('timeToMinutes - Invalid format should throw error', () => {
    runner.assertThrows(() => timeToMinutes('25:00'), 'Invalid time format');
    runner.assertThrows(() => timeToMinutes('12:60'), 'Invalid time format');
    runner.assertThrows(() => timeToMinutes('abc'), 'Invalid time format');
});

// Test synchronizeClocks function  
runner.test('synchronizeClocks - Challenge example', () => {
    const clockTimes = ['14:45', '15:05', '15:00', '14:40'];
    const results = synchronizeClocks('15:00', clockTimes);
    runner.assertEqual(results, [-15, 5, 0, -20], 'Should match expected differences');
});

runner.test('synchronizeClocks - Basic cases', () => {
    runner.assertEqual(synchronizeClocks('15:00', ['15:00']), [0], 'Same time should be 0 difference');
    runner.assertEqual(synchronizeClocks('15:00', ['15:05']), [5], '15:05 should be 5 minutes ahead');
    runner.assertEqual(synchronizeClocks('15:00', ['14:45']), [-15], '14:45 should be 15 minutes behind');
});

runner.test('synchronizeClocks - Multiple clocks', () => {
    const results = synchronizeClocks('12:00', ['11:30', '12:15', '12:00', '13:00']);
    runner.assertEqual(results, [-30, 15, 0, 60], 'Should calculate multiple differences correctly');
});

runner.test('synchronizeClocks - Edge cases', () => {
    const results = synchronizeClocks('00:00', ['23:59', '00:01']);
    runner.assertEqual(results, [1439, 1], 'Should handle midnight correctly');
});

runner.test('Main function - Returns correct structure', () => {
    const result = main();
    runner.assertEqual(typeof result, 'object', 'Should return an object');
    runner.assertEqual(Array.isArray(result.clockTimes), true, 'Should have clockTimes array');
    runner.assertEqual(Array.isArray(result.differences), true, 'Should have differences array');
    runner.assertEqual(result.differences, [-15, 5, 0, -20], 'Should have correct differences');
});

runner.printSummary();
