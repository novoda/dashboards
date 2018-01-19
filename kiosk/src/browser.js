const ONE_DAY_IN_MINUTES = 60 * 24

const nextEvening = () => {
    const now = new Date()
    const midnight = now.getHours() + (now.getHours() - 23)
    return new Date().setHours(midnight)
}

const alarmInterval = {
    when: nextEvening(),
    periodInMinutes: ONE_DAY_IN_MINUTES
}

const clearDataType = {
    appcache: true,
    cache: true
}

const content = chrome.app.window.current().contentWindow

content.onload = () => {
    chrome.alarms.create('refreshTick', alarmInterval)

    const webView = document.querySelector('webview');

    chrome.alarms.onAlarm.addListener(() => {
        webView.clearData({ since: 0 }, clearDataType, () => {
            webView.reload()
        })
    })

    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            console.log(config)
            const serverUrl = config.serverUrl
            webView.setAttribute('src', serverUrl);
        }).catch(console.log)


}
