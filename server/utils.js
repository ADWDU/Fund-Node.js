/**
 * Validate body request
 * @param {*} body The body
 */
module.exports.validateBody = (body) => {
    ;['pingId', 'deliveryAttempt', 'date'].forEach((propertyName) => {
        if (!Number.isInteger(body[propertyName])) {
            throw new Error(
                `Invalid value for ${propertyName} - ${body[propertyName]}`
            )
        }
    })
    if (!Number.isFinite(body.responseTime)) {
        throw new Error(`Invalid value for responseTime - ${body.responseTime}`)
    }
}
