const SessionManager = {
    // Storage keys
    ACTIVE_USER_KEY: 'activeUserId',
    
    // Set session data
    setSession(userId, token, userData) {
        localStorage.setItem(`token_${userId}`, token);
        localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
        sessionStorage.setItem(this.ACTIVE_USER_KEY, userId);
    },

    // Get current active session
    getCurrentSession() {
        const activeUserId = sessionStorage.getItem(this.ACTIVE_USER_KEY);
        if (!activeUserId) return null;

        return {
            userId: activeUserId,
            token: this.getToken(activeUserId),
            user: this.getUser(activeUserId)
        };
    },

    // Get token for specific user
    getToken(userId) {
        return localStorage.getItem(`token_${userId}`);
    },

    // Get user data for specific user
    getUser(userId) {
        const userData = localStorage.getItem(`user_${userId}`);
        return userData ? JSON.parse(userData) : null;
    },

    // Get all active sessions
    getAllSessions() {
        const sessions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('user_')) {
                const userId = key.replace('user_', '');
                sessions.push({
                    userId,
                    user: this.getUser(userId),
                    token: this.getToken(userId)
                });
            }
        }
        return sessions;
    },

    // Clear specific session
    clearSession(userId) {
        localStorage.removeItem(`token_${userId}`);
        localStorage.removeItem(`user_${userId}`);
        if (sessionStorage.getItem(this.ACTIVE_USER_KEY) === userId) {
            sessionStorage.removeItem(this.ACTIVE_USER_KEY);
        }
    },

    // Check if user is authenticated
    requireAuth() {
        const session = this.getCurrentSession();
        if (!session || !session.token || !session.user) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};