const https = require('https')
const http = require('http')

const { getExpDelay } = require('./utils')

// Request options to ping
const pingOptions = {
    hostname: 'fundraiseup.com',
    method: 'GET',
}

// Request options to send info regarding ping
const serverOptions = {
    hostname: process.argv[2] || 'localhost',
    port: 8080,
    path: '/data',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

// Global counters
let pingIdGlobal = 1
let successCounter = 0
let internalServerErrorCounter = 0
let timeoutErrorCounter = 0

// Ping and send info to server once in a second.
setInterval(() => {
    const start = process.hrtime.bigint()
    const pingId = pingIdGlobal++
    const date = Date.now()
    const pingRequest = https.request(pingOptions, (res) => {
        const end = process.hrtime.bigint()
        const responseTime = Number(end - start) / 1e9
        const data = {
            pingId,
            deliveryAttempt: 1,
            date,
            responseTime,
        }

        sendRequestToServer(data)
    })

    pingRequest.on('error', (error) => {
        console.error(error)
    })

    pingRequest.end()
}, 1000)

/**
 * Sending request to server with data regarding ping
 * @param {*} data The data that contains ping id, response time and etc.
 */
const sendRequestToServer = (data) => {
    console.log(`Send ${data.pingId} (attempt = ${data.deliveryAttempt})`)
    const serverRequest = http.request(serverOptions, (res) => {
        // Handle successful outcome - just increase counter
        if (res.statusCode === 200) {
            successCounter++
            console.log(`${data.pingId}: Success`)
        }

        // Handle internal server error outcome - increase counters and resending the request with delay
        if (res.statusCode === 500) {
            internalServerErrorCounter++
            data.deliveryAttempt++
            const delay = getExpDelay(data.deliveryAttempt)
            console.log(
                `${data.pingId}: Internal server error, will try again in ${delay}ms`
            )
            setTimeout(() => sendRequestToServer(data), delay)
        }
    })

    serverRequest.on('error', (error) => {
        console.error(error)
    })

    // Handle "response holding" outcome - increase counters and resending the request with delay
    serverRequest.setTimeout(10 * 1e3, () => {
        timeoutErrorCounter++
        data.deliveryAttempt++
        const delay = getExpDelay(data.deliveryAttempt)
        console.log(
            `${data.pingId}: Timeout error, will try again in ${delay}ms`
        )
        setTimeout(() => sendRequestToServer(data), delay)
    })

    serverRequest.write(JSON.stringify(data))
    serverRequest.end()
}

// Close process event handler with logging results
process.on('SIGINT', () => {
    console.log('Final results:')
    console.log(
        `All requests: ${
            successCounter + internalServerErrorCounter + timeoutErrorCounter
        }`
    )
    console.log(`Successful requests: ${successCounter}`)
    console.log(`Internal server error requests: ${internalServerErrorCounter}`)
    console.log(`Timeout error requests: ${timeoutErrorCounter}`)
    process.exit(0)
})
