const runApp = () => {
    if (chrome.power) {
        chrome.power.requestKeepAwake('display');
    }
    chrome.app.window.create('index.html', {
        id: 'main',
        state: 'fullscreen'
    })
}

chrome.app.runtime.onLaunched.addListener(() => {
    runApp()
})

chrome.app.runtime.onRestarted.addListener(() => {
    runApp()
})
