import * as queryString from 'query-string'

const EXPIRY_OFFSET_SECONDS = 40

export const loadHtml = (url) => {
    return validateExpires(url)
        .then(fetch)
        .then(response => response.ok ? response : toError(url, response))
        .then(response => response.text())
}

const toError = (url, response) => {
    return response.text().then(content => {
        return Promise.reject({
            code: response.status,
            source: url,
            cause: content
        })
    })
}

const validateExpires = (url) => {
    const query = queryString.parseUrl(url).query
    const expires = parseInt(query["Expires"])
    if (expires - EXPIRY_OFFSET_SECONDS <= Date.now() / 1000) {
        return Promise.reject({
            code: "expired",
            source: url,
            cause: "Content url has expired"
        })
    }
    return Promise.resolve(url)
}
