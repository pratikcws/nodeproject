var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ' rahul.narmadatech@gmail.com',
        pass: 'vdpoorkrfqpdgqys'
    }
});

module.exports = transporter;