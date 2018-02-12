Plugin
===

A module to reduce plugin development boilerplate.

## Usage

The typical usage will be to use the `templated` plugin which allows a plugin developer to provide a `component`, `configuration` &
`viewstate generating function`. 


```javascript
const plugin = require('dashboard-plugin').templated
const component = {
    template: 'path/to/html.html',
    __dirname
}

const configuration = () => {
    return {
        myPluginId: {
            name: 'My Amazing Plugin!'
        }
    }
}

const viewStateGenerator = (configuration) => {
    return {
        textColour: 'white'
    }
}

module.exports = plugin(configuration, component, viewStateGenerator)
```

## Implementation details


Dashboard Plugins are minimal web services.

This means plugins can be hosted by cloud functions like AWS Lambda and Firebase functions/google cloud functions or locally using ngrok.

A plugin has two responsibilities, to provide a configuration and to provide a html 
for a given configuration

This is achieved by acting on two request body types (create and query):

#### Create  

    respond with a 200 containing the configuration 

Request 
```json
{
    "type": "create"
}
```

Response
```json
{
    "my-awesome-plugin": {
        "name": "my awesome plugin",   
        "template": {
            "customText": {
                "label": "Custom text!",
                "type": "string"
            }
        }
    }
}
```

#### Query

    respond with 201 and then later post to the given callbackUrl with the html

Request
```json
{
    "type": "query",
    "callbackUrl": "...",
    "configuration": {
        "customText": {
            "value": "Hello World"
        }     
    }
}
```

Response
```json
{
    "html": "<html><body>Hello World</body></html>"
}
```

Putting it all together as a Firebase function

```javascript
const functions = require('firebase-functions')
const http = require('request-promise-native')

const creationConfiguration = {
    'my-awesome-plugin': {
        name: 'My awesome plugin',   
        template: {
            customText: {
                label: 'Custom text!',
                type: 'string'
            }
        }
    }
}

const callbackRequest = (callbackUrl, html) => {
    return {
        url: callbackUrl,
        body: JSON.stringify({ html: html }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

exports.my_awesome_plugin functions.https.onRequest((request, response) => {
        const type = request.body.type
        switch (type) {
            case 'create':
                response.status(200).send(creationConfiguration)
                break
            case 'query':
                const { callbackUrl, configuration } = request.body
                response.status(201).send({ message: `will post response to ${callbackUrl}` })

                const html = `<html><body>${configuration.customText.value}</body></html>`
                http.post(callbackRequest(callbackUrl, html))
                break
            default:
                response.status(500).send(`Unhandled type: ${type}`)
        }
    }
})
```

We provide utility plugins to help streamline the creation of a plugin.

```
const plugin = require('dashboard-plugin').vanilla
```

Abstraction over the http responses

```javascript
const plugin = require('dashboard-plugin').vanilla

const createHandler = () => {
    return {
        'my-awesome-plugin': {
        name: 'My awesome plugin',   
        template: {
            customText: {
                label: 'Custom text!',
                type: 'string'
            }
        }
    }
}

const queryHandler = (configuration) => {
    const html = `<html><body>${configuration.customText.value}</body></html>`    
    return Promise.resolve(html)
}

exports.my_awesome_plugin functions.https.onRequest(plugin(createHandler, queryHandler))
```

```
const plugin = require('dashboard-plugin').templated
```

Abstraction over html templating which allows the use of external `.html` and `.css` files.


```javascript
const plugin = require('dashboard-plugin').templated

const createHandler = () => {
    return {
        'my-awesome-plugin': {
        name: 'My awesome plugin',   
        template: {
            customText: {
                label: 'Custom text!',
                type: 'string'
            }
        }
    }
}

const component = {
    template: 'template.html',
    __dirname
}

const viewStateGenerator = (configuration) => {
    const viewState = {
        text: configuration.customText.value
    }
    return Promise.resolve(viewState)
}

exports.my_awesome_plugin functions.https.onRequest(plugin(createHandler, component, viewStateGenerator))
```

template.html
```html
<link rel="stylesheet" href="{{{__dirname}}}/style.css">
<div class="green">{{text}}</div>
```

style.css 
```css
.green {
    color: green;
}
```

