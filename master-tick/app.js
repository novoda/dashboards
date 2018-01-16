const express = require('express');
const http = require('request-promise-native')
const config = require('./config.json')

const app = express();

app.get('/tasks/tick', (req, res) => {
    http.post(`https://us-central1-${config.projectId}.cloudfunctions.net/masterTick`)
        .then(() => {
            res.status(200).send().end()
        }).catch(err => {
            res.status(500).send(err).end()
        })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT)
