/**
 * Get exponential backoff
 * @param {number} attemptNumber The attempt number to send request (for attemptNumber = 1, return always 0)
 * @returns The exponential backoff
 */
module.exports.getExpDelay = (attemptNumber) => {
    return getRandomInt(attemptNumber) * process.argv[3] || 200
}

/**
 * Get random integer in range from 0 to max, not including max
 * @param {number} max The maximum of range
 * @returns Random integer
 */
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}
