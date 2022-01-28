require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const {home, userProfile: profile, dashboard, callback, logout} = require('./controller');
const {port} = require('./config')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// set the view engine to ejs
app.set('view engine', 'ejs');

router.get('/', home);

router.get('/dashboard', dashboard)

router.get('/logout', logout)

router.get('/callback', callback)

router.get('/user_profile', profile)

app.use('/', router);
app.listen(port || 3000, ()=> {
    console.log('Listening on port ' + port)
})
