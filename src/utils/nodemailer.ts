import { Transporter, createTransport } from 'nodemailer';
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';

let transporter: Transporter;

export default  {
    init: () : Transporter => {
        transporter = createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_USER_PASS // generated ethereal password
            },

        });

        var options: NodemailerExpressHandlebarsOptions = {
            viewEngine : {
                extname: '.hbs', // handlebars extension
                layoutsDir: 'src/views/email/', // location of handlebars templates
                defaultLayout: 'template', // name of main template
                partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
            },
            viewPath: 'src/views/email/',
            extName: '.hbs'
            };

        transporter.use('compile', hbs(options));

        return transporter;
    },
    getTransporter: () : Transporter => {
        if(!transporter) {
            throw new Error('Nodemailer is not initialized')
        }
        return transporter;
    }
}