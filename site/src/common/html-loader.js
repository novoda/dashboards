import * as queryString from 'query-string'

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
    if (parseInt(query["Expires"]) >= Date.now()) {
        return Promise.reject({
            code: "expired",
            source: url,
            cause: "Content url has expired"
        })
    }
    return Promise.resolve(url)
}
