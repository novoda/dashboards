# Chrome Kiosk App

This Chrome app is just a simple host for the dashboards client. It will run in kiosk mode on a Chrome OS device (Chromebit).

## Configuration

In `app_scripts.js`, assign your server's URL to the `serverUrl` constant.

## Publishing

To publish the app zip everything together with `zip -r app.zip src/.`. Go to the
 [Chrome Webstore Dashboard](https://chrome.google.com/webstore/developer/dashboard) and make sure that you have a listing for the app. Upload the ZIP archive and publish, having the `Visibility options` set to `Private` for your organization.
 