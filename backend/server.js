import express from 'express'

const app = express()
const port = process.env.PORT || 5000

app.get("/test", (req, res) => {
    res.json("working")
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})