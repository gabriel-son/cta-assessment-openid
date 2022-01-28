const axios = require('axios');
const querystring = require('querystring');

const {client_id, auth_uri, grant_type, scopes, token_uri, user_info_uri, redirect_uri, code_challenge_method, response_type, state, signout_uri, port} = require('../config');

const generate_code_challenge = require('../utils/generate_code_challenge')

let user_access_token = null;
let user_id_token = null;
let code_challenge = null;
let code_verifier = null;

exports.home = (req, res) => {
    if (!code_challenge) {
      ({code_challenge, code_verifier} = generate_code_challenge())
    }
    const {successful} = req.query;

    const authorization_uri = `${auth_uri}?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&code_challenge_method=${code_challenge_method}&code_challenge=${code_challenge}&state=${state}&code_verifier=${code_verifier}&scope=${scopes}`

    res.render('pages/index', {authorization_uri, successful})
}

exports.userProfile = async (req, res) => {
    const protocol = req.protocol;
    const host = req.hostname;
  
    const dashboard_uri = `${protocol}://${host}/dashboard`
    const user_profile = await axios.get(user_info_uri, {headers: {
      'Authorization': `Bearer ${user_access_token}`
    }})

    res.render('pages/profile.ejs', {
    email: user_profile.data.email,
    display_name: user_profile.data.display_name,
    gender: user_profile.data.gender,
    first_name: user_profile.data.first_name,
    last_name: user_profile.data.last_name,
    username: user_profile.data.username,
    dashboard_uri
  })
}

exports.dashboard = (req, res) => {
    const protocol = req.protocol;
    const host = req.hostname;
    const {login} = req.query;
  
    const user_info_uri = `${protocol}://${host}/user_profile`
  res.render('pages/dashboard.ejs', {user_info_uri, signout_uri, login})
}

exports.logout = async (req, res) => {
  const logout_result = await axios.get(`${signout_uri}?id_token_hint=${user_id_token}&client_id=${client_id}`);
  if (logout_result.status === 200) {
    res.redirect('/')
  }
}

exports.callback = async (req, res) => {
    const {code, state: auth_state} = req.query;
    if (state !== auth_state) {
        res.redirect('/?successful=false')
    }

    const data = {
      client_id,
      state,
      code,
      grant_type,
      redirect_uri,
      code_verifier
    }
    
    const user_tokens = await axios.post(token_uri, querystring.stringify(data));
    
    if (user_tokens.status === 200) {
      const {access_token, id_token} = user_tokens.data
      user_id_token = id_token;
      user_access_token = access_token
      res.redirect('/dashboard?login=true')
    } else {
      res.redirect('/?successful=false')
    }
}