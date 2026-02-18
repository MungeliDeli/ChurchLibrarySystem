const readingScheduleRoutes = require('./routes/readingSchedule.routes');
const express = require('express');

console.log('--- DEBUG START ---');
console.log('Type of exports:', typeof readingScheduleRoutes);
console.log('Is function?', typeof readingScheduleRoutes === 'function');
console.log('Is Router (has stack)?', !!readingScheduleRoutes.stack);
if (readingScheduleRoutes.stack) {
    console.log('Stack length:', readingScheduleRoutes.stack.length);
    readingScheduleRoutes.stack.forEach(layer => {
        if (layer.route) {
            console.log('Route:', layer.route.path, layer.route.methods);
        }
    });
}
console.log('--- DEBUG END ---');
