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

function composeMessage(
    destinationEmail = 'test@example.com',
    subject = 'Sending with Twilio SendGrid is Fun',
    text = 'and easy to do anywhere, even with Node.js'
    ) {
  const message =  {
        to: destinationEmail,
        from: process.env.SOURCE_EMAIL, // Use the email address or domain you verified above
        subject: subject,
        text: text,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    console.log(message);
    return message;
}

app.get('/', (req, res) => {
    res.status(200).send('Our api is working fine');
});

app.post('/send-mail', (req, res) => {
    sgMail
        .send(composeMessage(
            req.body.destinationEmail,
            req.body.subject,
            req.body.text
        ))
        .then(() => {
            console.log('message sent');
            res.status(200).send({
                message: 'mail sent successfully'
            });
        }, error => {
             console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
            res.status(501).send(error.message);
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