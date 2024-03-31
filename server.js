if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

// const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING), () => {
//     console.log('mongao koneckt!!!!')
// }
// mongoose.connection.on('connected', () => console.log('Connected'));
// import { initializeApp } from 'firebase/app';
// const firebaseConfig = {
// 	//...
//   };
// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseDB = getFirestore(firebaseApp);


const authRoutes = require('./routes/auth-routes')
const dashboardRoutes = require('./routes/dashboard-routes')
const check_auth = require('./components/auth-check')
const testRoutes = require('./routes/test-routes')

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cookieSession = require('cookie-session')
const methodOverride = require('method-override')

// Mongo DB access
const User = require('./components/user-model')

const fs = require('fs').promises

const hostname = require('os').hostname()
var port = 3000
if( hostname === 'srv.gambits.vip'){
    port = 5000
}

app.set('view-engine', 'ejs')
// to avoid using POST and require devs to use DELETE
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public/'))
app.use(flash())
app.use(cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,  // 3 days
        keys: [process.env.SESSION_SECRET]
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    req.session.created = Date.now()
    next()
})

// add routes from other files here
app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/test', testRoutes)

app.use(function(err, req, res, next) {
    console.log(err);
});

const swaggerJsonDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerOptions = {
	swaggerDefinition: {
        openapi: '3.0.3',
		info: {
            version: '1.0.0',
            title: "Walt Yao's Sign In/Sign Up/Dashboard App",
			description: "Below is a sample of use cases for API testing",
			servers: [
                {
                  url: 'http://localhost:3000',
                  description: "Localhost"
                },
                {
                  url: `http://${hostname}`,
                  description: "Production server"
                }
            ]
		},
		"components": {
			"schemas": {
				"user": {
					"properties": {
						"_id": {
							"type": "string"
						},
						"created": {
							"type": "string"
						},
						"lastSession": {
							"type": "string"
						},
						"loginCount": {
							"type": "string"
						},
						"isVerified": {
							"type": "string"
						},
						"username": {
							"type": "string"
						},
						"email": {
							"type": "string"
						},
						"emailToken": {
							"type": "string"
						},
						"forgotToken": {
							"type": "string"
						},
						"password": {
							"type": "string"
						},
						"image": {
							"type": "string"
						},
						"googleId": {
							"type": "string"
						}
					}
				}
			}
		}
	},
	apis: ['./routes/test-routes.js']
}
const swaggerDocs = swaggerJsonDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))


// login modules
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => User.findOne({email: email}).email,
    id => User.findOne({googleId: id}).id
)

app.get('/', check_auth.home, (req, resp) => {
    resp.render('home.ejs')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })