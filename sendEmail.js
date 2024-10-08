const express = require ('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// POST endpoint to handle email sending
app.post('/send-email', (req, res) => {
    const { recipeName, ingredients, instructions, email } = req.body;

    // Construct email body
    const emailBody = `
        Recipe Name: ${recipeName}\n
        Ingredients:\n${ingredients}\n
        Instructions:\n${instructions}\n
        Email: ${email}
    `;

    // Create a transporter using hotmail SMTP
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,  // Secure port for TLS
        secure: false,
        auth: {
          user: 'eboy12201@gmail.com',  // address
         pass: 'htcthmveifyvktub'  // Pass htcthmveifyvktub
    
        },
        
        
      
        connectionTimeout: 10000,  // Increase timeout to 10 seconds
        greetingTimeout: 10000,  // Increase greeting timeout to 10 seconds
        socketTimeout: 10000  
    });
    var mailList = [
        email,
        'eboy12201@gmail.com',
      ];
      
    // Email content
    const mailOptions = {
        to: mailList , //emaili i userit qe ben request
       from: 'eboy12201@gmail.com', //emaili qe con response dhe merr requeste
        subject: 'New Recipe Addition Request info recieved', //subjecti me te cilin i shkon emaili userit dhe textit posht
        text: "Greetings, thank you for your opinion: " +(emailBody)+ "\n We will give an answer to your request as soon as possible" };
        
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to send addittion request email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});
//=======================tjetra
app.post('/send-email1', (req, res) => {
    const { name1, reason1, email1 } = req.body;

    // Construct email body
    const emailBody1 = `
        Name: ${name1}\n
        Reason for Request:\n${reason1}\n
    `;

    // Create a transporter using hotmail SMTP
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,  // Secure port for TLS
        secure: false,
        auth: {
          user: 'eboy12201@gmail.com',  // address eboy12201@gmail.com
         pass: 'htcthmveifyvktub'  // Pass
    
        },
        
        
      
        connectionTimeout: 10000,  // Increase timeout to 10 seconds
        greetingTimeout: 10000,  // Increase greeting timeout to 10 seconds
        socketTimeout: 10000  
    });

    // Email content
    var mailList = [
        email1,
        'eboy12201@gmail.com',
      ];
    const mailOptions1 = {
        to: mailList , //emaili i userit qe ben request
       from: 'eboy12201@gmail.com', //emaili qe con response dhe merr requeste
        subject: 'New Recipe removal Request info recieved', //subjecti me te cilin i shkon emaili userit dhe textit posht
        text: "Greetings, thank you for your opinion: " +(emailBody1)+ " We will give an answer to your request as soon as possible " };

    // Send email
    transporter.sendMail(mailOptions1, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to send removal request email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
