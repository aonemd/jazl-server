const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 8001));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}`))
