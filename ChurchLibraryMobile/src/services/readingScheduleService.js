import api from './api';

// Create a new reading schedule
export const createSchedule = async (scheduleData) => {
    try {
        const response = await api.post('/reading-schedules', scheduleData);
        return { ok: true, data: response.data };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || error.message || "Failed to create schedule."
        };
    }
};

// Get all schedules for the current user
export const getSchedules = async () => {
    try {
        const response = await api.get('/reading-schedules');
        return { ok: true, data: response.data };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || error.message || "Failed to fetch schedules."
        };
    }
};

// Get a specific schedule by ID
export const getScheduleById = async (id) => {
    try {
        const response = await api.get(`/reading-schedules/${id}`);
        return { ok: true, data: response.data };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || error.message || "Failed to fetch schedule details."
        };
    }
};

// Update a schedule
export const updateSchedule = async (id, updateData) => {
    try {
        const response = await api.put(`/reading-schedules/${id}`, updateData);
        return { ok: true, data: response.data };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || error.message || "Failed to update schedule."
        };
    }
};

// Update reading progress
export const updateProgress = async (id, chaptersRead) => {
    try {
        const response = await api.put(`/reading-schedules/${id}/progress`, { chaptersRead });
        return { ok: true, data: response.data };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || error.message || "Failed to update progress."
        };
    }
};

// Delete a schedule
export const deleteSchedule = async (id) => {
    try {
        const response = await api.delete(`/reading-schedules/${id}`);
        return { ok: true, data: response.data };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || error.message || "Failed to delete schedule."
        };
    }
};
