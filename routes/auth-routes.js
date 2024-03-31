const check_auth = require('./../components/auth-check');
const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const UserModel = require('./../components/user-model');
const toolEmail = require('./../components/tool-email');

router.get('/login', (req, resp) => {
    resp.redirect('/');
});

router.post('/login', check_auth.login, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));

router.delete('/logout', (req, resp) => {
    req.logout();
    resp.redirect('/');
});

router.post('/change', async (req, resp) => {
    try {
        req.user.username = req.body.newName;
        await UserModel.saveOrUpdate(req.user);
        var response = {
            status: 200,
            success: 'Updated Successfully',
            newGame: req.body.newName
        };
        resp.end(JSON.stringify(response));
    } catch (error) {
        console.error('Error updating user:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', check_auth.verify, async (req, resp) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const existingUserByUsername = await UserModel.getUserByUsername(req.body.username);
        const existingUserByEmail = await UserModel.getUserByEmail(req.body.email);

        if (existingUserByUsername) {
            req.flash('error', 'Sorry, username exists! Pick a different one.');
            return resp.redirect('/');
        }

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                req.flash('error', 'Sorry, e-mail exists! Please sign in with your credentials, or click "forgot password" to reset.');
                return resp.redirect('/');
            } else {
                req.flash('resendEmail', existingUserByEmail.email);
                // req.flash('error', 'Account already exists but you have not yet verified your email!');
                return resp.redirect('/');
            }
        }

        const newUser = await UserModel.createUser(req.body.email, req.body.username, hashedPassword);
        toolEmail.sendVerify(req, resp, newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('alertTitle', 'Server error');
        req.flash('Please try later (not my fault)');
        resp.redirect('/');
    }
});

router.post('/send_forgot', check_auth.home, async (req, resp, next) => {
    try {
        const currentUser = await UserModel.getUserByEmail(req.body.email);
        if (currentUser) {
            toolEmail.sendForgot(req, resp, currentUser);
            return;
        } else {
            req.flash('error', `Email ${req.body.email} does not exist!`);
            resp.redirect('/');
            return;
        }
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        req.flash('error', 'An error occurred while sending the forgot password email.');
        resp.redirect('/');
    }
});

router.get('/reset_pass', check_auth.home, async(req, resp, next) => {
    try {
        const currentUser = await UserModel.getUserByForgotToken(req.query.token);
        if (currentUser) {
            resp.render('forgot.ejs', { user: currentUser });
            return;
        } else {
            req.flash('error', `Invalid token, please get a new email by clicking on "Forgot Password?"`);
            resp.render('forgot.ejs');
            return;
        }
    } catch {
        resp.redirect('/');
    }
});

router.post('/set_pass', check_auth.home, async(req, resp, next) => {
    try {
        const currentUser = await UserModel.getUserByForgotToken(req.query.token);
        if (currentUser) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            currentUser.password = hashedPassword;
            await UserModel.saveOrUpdate(currentUser);
            req.flash('error', `Password successfully changed! Sign in to continue.`);
            resp.redirect('/');
            return;
        } else {
            req.flash('error', `Invalid token, please get a new email by clicking on "Forgot Password?"`);
            resp.redirect('/');
            return;
        }
    } catch {
        resp.redirect('/');
    }
});

router.get('/verifyEmail', check_auth.verifyEmail, async (req, resp, next) => {
    try {
        const currentUser = await UserModel.getUserByEmail(req.query.email);
        if (currentUser) {
            toolEmail.sendVerify(req, resp, currentUser);
        } else {
            req.flash('error', `User doesn't exist.`);
            resp.redirect('/');
            return;
        }
    } catch (error) {
        console.error('Error verifying email:', error);
        resp.redirect('/');
    }
});

router.get('/email', async (req, resp, next) => {
    try {
        const currentUser = await UserModel.getUserByEmailToken(req.query.token);
        if (currentUser) {
            currentUser.emailToken = '';
            currentUser.isVerified = true;
            await UserModel.saveOrUpdate(currentUser);
            req.login(currentUser, loginError => {
                if (loginError) {
                    console.error(loginError);
                    req.flash('error', 'Error logging in');
                    resp.redirect('/');
                    return;
                }
                currentUser.loginCount++;
                UserModel.saveOrUpdate(currentUser);
                req.flash('error', `Hi ${currentUser.username}! You're verified! Sign in to continue 😎`);
                resp.redirect('/dashboard');
                return;
            });
        } else {
            req.flash('alertTitle', 'Email token error');
            req.flash('alertMsg', 'Email token is invalid, please try registering again.');
            resp.redirect('/');
            return;
        }
    } catch (error) {
        console.error('Error verifying email token:', error);
        req.flash('alertTitle', 'Email token error');
        req.flash('alertMsg', 'An error occurred while verifying the email token.');
        resp.redirect('/');
    }
});

router.get('/google', check_auth.verify, passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/facebook', check_auth.verify, passport.authenticate('facebook'));

router.get('/google/redirect', check_auth.verify, passport.authenticate('google'), async (req, resp) => {
    try {
        if (req.isAuthenticated()) {
            req.user.loginCount++;
            req.user.lastSession = req.session.created;
            await UserModel.saveOrUpdate(req.user);
            resp.redirect('/dashboard');
        } else {
            req.flash('error', 'Authenticated! Please log in');
            resp.redirect('/');
        }
    } catch (error) {
        console.error('Error redirecting to Google:', error);
        resp.redirect('/');
    }
});

router.get('/facebook/redirect', check_auth.verify, passport.authenticate('facebook'), async (req, resp) => {
    try {
        if (req.isAuthenticated()) {
            req.user.loginCount++;
            req.user.lastSession = req.session.created;
            await UserModel.saveOrUpdate(req.user);
            resp.redirect('/dashboard');
        } else {
            req.flash('error', 'Authenticated! Please log in');
            resp.redirect('/');
        }
    } catch (error) {
        console.error('Error redirecting to Facebook:', error);
        resp.redirect('/');
    }
});

module.exports = router;
