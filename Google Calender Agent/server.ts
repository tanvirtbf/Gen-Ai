import express from 'express'

const app = express();

app.get("/auth", (req, res) => {
    // Generate the link

    const link = ""
    res.redirect(link)
})

app.get('/callback' , (req, res) => {
    const code = req.query.code

    // exchange code with access token / refresh token
    res.send("Connected You can close this tab now")
})
