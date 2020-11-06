import express from 'express';

const app = express()

const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hello Nana')
})

app.listen(PORT, () => {
    console.log('server started')
})