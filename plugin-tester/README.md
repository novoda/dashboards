## plugin-tester

A `localhost` plugin tester by querying a local plugin and hosting the response on `localhost:5000` 

## Usage

Install the plugin-tester as a global dependency.

```bash
npm install -g 
```

Basic usage

```bash
plugin-tester local ~/my-awesome-plugin
```

Typical usage 

```bash
plugin-tester local ~/my-awesome-plugin --watch --config ~/my-plugin-config.json
```

## Options

```bash
local <path>
``` 

The path to a local plugin entry point. The `plugin-tester` expects an entry point which exports a plugin with the following signature:

```javascript
module.exports.plugin = () => {
    return (request, response) => {
        // plugin implementation
    }
}
```

The recommended approach is to use the [dashboard-plugin](https://github.com/novoda/dashboards/tree/master/plugin) module and create plugins as independent modules.

Examples can be found [here](https://github.com/novoda/dashboard-plugins)

```bash
-p --port
```

The local server port, defaults to 5000. 

```bash
-w --watch
```

Enables watching the plugin module for changes and automatically requerying the plugin.

```bash
-c <path> --config
```

The path to a JSON configuration which will be used to query the plugin with.

The JSON must be in the following format: 

```JSON
{
    "first_name": {
        "value": "James"
    },
    "last_name": {
        "value": "Bond"
    }
} 
```
