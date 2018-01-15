const http = require('request-promise-native')

const plugin = (create, query) => {
    return (request, response) => {
        const type = request.body.type
        switch (type) {
            case 'create':
                const configuration = create()
                response.status(200).send(configuration)
                break
            case 'query':
                response.status(201).send({ message: `will post response to ${request.body.callbackUrl}` })
                const callbackUrl = request.body.callbackUrl
                query(request.body.configuration)
                    .then(postHtml(callbackUrl))
                    .catch(console.error)
                break
            default:
                response.status(500).send(`Unhandled type: ${type}`)
        }
    }
}

const postHtml = (callbackUrl) => (html) => {
    const callbackRequest = {
        url: callbackUrl,
        body: JSON.stringify({ html: html }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return http.post(callbackRequest)
        .catch(console.error)
}

module.exports = plugin
