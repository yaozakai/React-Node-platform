const passport = require('passport')
const router = require('express').Router()
const User = require('../components/user-model')

/**
 * @swagger
 * /test/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/components/schemas/user'
 *       500:
 *         description: SERVER ERROR
 */
router.get('/users', async (req, resp) => {
    const users = await User.find({})
    
    var userMap = {};
    
    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    resp.send(userMap)

})
/**
 * @swagger
 * /test/user/{email}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by email
 *     description: ''
 *     operationId: getUserByEmail
 *     parameters:
 *      - name: email
 *        in: path
 *        description: The email for login
 *        required: false
 *        schema:
 *          type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *           application/xml:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid email supplied
 *       '404':
 *         description: User not found
 */
router.get('/user/:email', async (req, resp) => {
    const regex_email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if( regex_email.test( req.params.email ) ){
        const user = await User.findOne({ email: req.params.email })
        if( user ){
            resp.status(200).send({user})
        } else {
            resp.status(404).send()
        }
    } else {
        resp.status(400).send()
    }
})
/**
* @swagger
* /test/login:
*   post:
*     tags:
*       - Users
*     summary: Logs user into the system
*     description: ''
*     operationId: loginUser
*     parameters:
*       - name: email
*         in: formData
*         description: The email for login
*         default: "munkeeking@gmail.com"
*         required: false
*         schema:
*           type: string
*       - name: password
*         in: formData
*         description: The password for login in clear text
*         default: "few"
*         required: false
*         schema:
*           type: string
*     responses:
*       '200':
*         description: successful operation
*         content:
*           application/xml:
*             schema:
*               type: string
*           application/json:
*             schema:
*               type: string
*       '400':
*         description: Invalid username/password supplied
*/
router.post('/login', 
    passport.authenticate('local'), (req, resp) => {
        // update user stats (after passport authenticate, otherwise, user is redirected at check_auth.verify)
        if( !req.user ){
            resp.status(400).send()
        } else {
            User.findOne({ email: req.body.email }).then( async (user) => {
                req.user.loginCount++
                req.user.lastSession = req.session.created
                await req.user.save()
                resp.status(200).send(req.user)
            })  
        }
    }
)
/**
 * @swagger
 * /test/logout:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A user object
 *         schema:
 *           $ref: '#/components/schemas/user'
 *       500:
 *         description: SERVER ERROR
 */
router.get('/logout', async (req, resp) => {
    if( req.isUnauthenticated() ){
        resp.status(400).send()
    }

    try {
        req.logout()
        resp.status(200).send(req.user)
    } catch {
        resp.status(500).send()
    }
})
/**
 * @swagger
 * /test/change:
 *   post:
 *     tags:
 *       - Users
 *     description: Change a username
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newName
 *         in: formData
 *         description: The new username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *         schema:
 *           $ref: '#/components/schemas/user'
 *       404:
 *         description: USER NOT LOGGED IN
 *       500:
 *         description: SERVER ERROR
 */
router.post('/change', async (req, resp) => {
    if( req.isUnauthenticated() ){
        resp.status(404).send()
    }
    try {
        req.user.username = req.body.newName
        req.user.save().then(() => {
            var response = {
                status  : 200,
                success : 'Updated Successfully',
                newGame: req.body.newName
            }
            resp.status(200).end(JSON.stringify(response));
            

        }).catch(() => {
            resp.status(500).send()
        })
    } catch {
        resp.status(500).send()
    }
})

module.exports = router