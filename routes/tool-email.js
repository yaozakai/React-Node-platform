const crypto = require('crypto')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

function send_email(req, resp, msg, toEmail){
    sgMail.send(msg).then((response ) => {
        console.log( 'currentUser:' + response )
        req.flash('error', `Check your email, ${toEmail}. Please verify your account through the link sent to you.`)
        resp.redirect('/')
    }).catch((error) => {
        console.log('error:' + error)
        req.flash('alertTitle', 'Email error')
        req.flash('alertMsg', 'Something when wrong when sending email. Please try again.')
        resp.redirect('/')
    }) 
}

module.exports = {
    sendVerify: function( req, resp, currentUser ) {
        const msg = {
            from: 'walt.yao@gmail.com',
            to: currentUser.email,
            subject: 'Please confirm your account',
            text: `Thanks for stopping by, follow this link to confirm: 
            http://${req.headers.host}/auth/email?token=${currentUser.emailToken}
            `,
            html: `<a href="http://${req.headers.host}/auth/email?token=${currentUser.emailToken}">Click here to activate your account!</a><br>
                <a href="http://${req.headers.host}/auth/email?token=${currentUser.emailToken}">http://${req.headers.host}/auth/email?token=${currentUser.emailToken}</a>`
        }
        send_email(req, resp, msg, currentUser.email)
        
    },
    sendForgot: async function( req, resp, currentUser ){
        // create forgotToken
        currentUser.forgotToken = crypto.randomBytes(64).toString('hex')
        await currentUser.save()
        const msg = {
            from: 'walt.yao@gmail.com',
            to: currentUser.email,
            subject: 'Reset your password',
            text: `Follow this link to reset: 
            http://${req.headers.host}/auth/reset_pass?token=${currentUser.forgotToken}
            `,
            html: `<a href="http://${req.headers.host}/auth/reset_pass?token=${currentUser.forgotToken}">Click here to activate your account!</a><br>
                <a href="http://${req.headers.host}/auth/reset_pass?token=${currentUser.forgotToken}">http://${req.headers.host}/auth/reset_pass?token=${currentUser.forgotToken}</a>`
        }
        send_email(req, resp, msg, currentUser.email)
    }
}