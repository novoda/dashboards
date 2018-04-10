export const loadHtml = (url) => {
    return fetch(url)
        .then(response => response.ok ? response : Promise.reject(`Failed to fetch ${response.status}`))
        .then(response => response.text())
}
