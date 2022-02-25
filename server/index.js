const http = require('http')
const { URL } = require('url')

const { validateBody } = require('./utils')

const port = 8080

// Variable for storing requests data
const delays = []

const server = http.createServer(async (req, res) => {
    const url = new URL(`http://${req.headers.host}${req.url}`)

    // Handle "/data" route
    if (url.pathname == '/data' && req.method === 'POST') {
        // Receive data from request body
        const buffers = []
        for await (const chunk of req) {
            buffers.push(chunk)
        }
        const data = Buffer.concat(buffers).toString()

        // Parse body data and validate it
        let parsedData
        try {
            parsedData = JSON.parse(data)
            validateBody(parsedData)
        } catch (parseError) {
            console.error(parseError.message)
            res.statusCode = 400
            res.end(parseError.message)
        }

        const requestFate = Math.random()
        if (requestFate < 0.6) {
            // 60% for success outcome - 200 code
            console.log(parsedData)
            delays.push(parsedData.responseTime)
            res.statusCode = 200
            res.end()
        } else if (requestFate < 0.8) {
            // 20% for internar server error - 500 code
            res.statusCode = 500
            res.end()
        }

        // Rest 20% for holding response without sending it to client
    } else {
        // For all routes except POST "/data" respond with not found status.
        res.statusCode = 404
        res.write('not found')
        res.end()
    }
})

// Close process event handler with logging results
process.on('SIGINT', () => {
    console.log('Server is close, here is a result:')
    if (delays.length) {
        const totalDelays = delays.length
        const arithmeticMean =
            delays.reduce((partialSum, delay) => partialSum + delay, 0) /
            totalDelays
        console.log(`Arithmetic mean: ${arithmeticMean}`)
        const median =
            totalDelays % 2 === 0
                ? (delays[totalDelays / 2] + delays[totalDelays / 2 - 1]) / 2
                : delays[(totalDelays - 1) / 2]
        console.log(`Median: ${median}`)
    } else {
        console.log(`There was no request`)
    }

    process.exit(0)
})

// Startup server
server.listen(port, () => console.log(`Server listening ${port}`))
