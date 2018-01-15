window.config = {
    'model_': 'AppConfig',
    'id': 1,
    'appName': 'Dashboard V2 Kiosk',
    'enableNavBttns': false,
    'enableHomeBttn': false,
    'enableReloadBttn': false,
    'enableLogoutBttn': false,
    'kioskEnabled': true
}

const runApp = function () {
    if (chrome.power) {
        chrome.power.requestKeepAwake('display');
    }
    chrome.app.window.create('index.html', {
        id: 'main',
        state: 'fullscreen',
    })
    chrome.app.window.current().fullscreen();
}

chrome.app.runtime.onLaunched.addListener(function () {
    runApp()
})

chrome.app.runtime.onRestarted.addListener(function () {
    runApp()
})
