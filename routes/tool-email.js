const sgMail = require('@sendgrid/mail')
// import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_KEY)
// new sgMail.MailService().setApiKey(process.env.SENDGRID_KEY)

module.exports = {
    sendVerify: function ( req, resp, currentUser ) {
        const msg = {
            from: 'walt.yao@gmail.com',
            to: currentUser.email,
            subject: 'Please confirm your account',
            text: `Thanks for stopping by, click on this link to confirm: 
            http://${req.headers.host}/auth/email?token=${currentUser.emailToken}
            `,
            html: `<a href="http://${req.headers.host}/auth/email?token=${currentUser.emailToken}">Click here to activate your account!</a><br>
                <a href="http://${req.headers.host}/auth/email?token=${currentUser.emailToken}">http://${req.headers.host}/auth/email?token=${currentUser.emailToken}</a>`
        }
        sgMail.send(msg).then((response ) => {
            console.log( 'currentUser:' + response )
            // req.flash('alertTitle', 'Check your email!')
            // req.flash('alertMsg', `Email has been sent to ${currentUser.email}. Please verify your account through the link sent to you.`)
            req.flash('error', `Check your email, ${currentUser.email}. Please verify your account through the link sent to you.`)
            resp.redirect('/')
        }).catch((error) => {
            console.log('error:' + error)
            req.flash('alertTitle', 'Email error')
            req.flash('alertMsg', 'Something when wrong when sending email. Please try again.')
        }) 
    }
}