import express from "express";
import { google } from "googleapis";

const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

app.get("/auth", (req, res) => {
  // Generate the link

  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = ["https://www.googleapis.com/auth/calendar"]; // er mane holo user er ki ki access nibo setar list . ekhane only calender er access nicchi

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline", // online dile sudhu access token pauya jay. jokhon 1 hour por seta expire hoye jay tokhon user ke abaro permission dite hoy but offline dile refresh token soho dey jeta lifetime access pauya jay user er google calender er

    prompt: "consent",

    // If you only need one scope, you can pass it as a string
    scope: scopes,
  });

  console.log("url: ", url);

  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  const { tokens } = await oauth2Client.getToken(code);

  console.log("tokens: ", tokens);

  // exchange code with access token / refresh token
  res.send("Connected You can close this tab now");
});


app.listen(3600, () => {
    console.log(`Server is running on port: http://localhost:3600`)
})
