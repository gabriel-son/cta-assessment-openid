const {
    authorization_endpoint, 
    grant_type, 
    scopes, 
    token_endpoint, 
    userinfo_endpoint, 
    client_id, 
    redirect_uri, 
    code_challenge_method,
    response_type,
    state,
    signout_endpoint,
    PORT
} = process.env

module.exports = {
    auth_uri: authorization_endpoint,
    grant_type,
    scopes,
    token_uri: token_endpoint,
    user_info_uri: userinfo_endpoint,
    signout_uri: signout_endpoint,
    client_id,
    redirect_uri,
    code_challenge_method,
    response_type,
    state,
    port: PORT
}