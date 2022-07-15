require("dotenv").config();
const bodyParser = require("body-parser");
const sgMail = require('@sendgrid/mail');
const express = require("express");
const app = express();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Metheds', 'GET,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const msg = {
  to: 'test@example.com',
  from: 'test@example.com', // Use the email address or domain you verified above
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

app.get('/', (req, res) => {
    res.status(200).send('Our api is working fine');
});

app.get('/send-mail', (req, res) => {
    sgMail
        .send(msg)
        .then(() => {}, error => {
             console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        }
    );
});

try{
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}catch(error){
    console.log(error);
}