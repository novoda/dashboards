export const loadHtml = (url) => {
    return fetch(url + "123433243")
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