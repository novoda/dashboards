const http = require('request-promise-native')

const plugin = (create, query) => {
    return (request, response) => {
        const type = request.body.type
        switch (type) {
            case 'create':
                const configuration = create()
                response.status(200).send(configuration)
                break;
            case 'query':
                const callbackUrl = request.body.callbackUrl
                query(request.body.configuration, request.body.meta)
                    .then(postHtml(callbackUrl))
                    .then(() => {
                        response.status(201).send({ message: `response posted to ${request.body.callbackUrl}` })
                    })
                    .catch((error) => {
                        console.error(error)
                        response.status(500).send({ message: error })
                    })
                    break;
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
}

module.exports = plugin
