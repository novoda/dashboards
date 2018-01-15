import * as config from './config.json'

const ONE_DAY_IN_MINUTES = 60 * 24
const SERVER_URL = config.serverUrl;

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
content.onkeydown = window.onkeyup = function (e) { if (e.keyCode == 27 /* ESC */) { e.preventDefault(); } };

content.onload = () => {
    chrome.alarms.create('refreshTick', alarmInterval)

    const webView = document.querySelector('webview');
    webView.setAttribute('src', SERVER_URL);

    chrome.alarms.onAlarm.addListener(() => {
        webView.clearData({ since: 0 }, clearDataType, () => {
            webView.reload()
        })
    })
};

content.onfocus = () => {
    document.body.requestPointerLock();
}

content.onblur = () => {
    document.body.exitPointerLock();
}
