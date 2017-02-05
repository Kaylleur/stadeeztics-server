/**
	* Created by Thomas on 24/11/2016.
	* Project : server
	*/
module.exports = {
	app: {
		id: 'YOUR_APP_ID',
		secret: 'YOUR_SECRET_KEY'
	},
	salt: {
		before: 'SALT_BEFORE',
		after: 'SALT_AFTER'
	},
	jwt: {
		secret: 'SESSION_SECRET_ENCODE JWT'
	},
	session: {
		algorithm: 'HS512',
		expiresIn: '8h',
		issuer: os.hostname(),
		subject: 'session',
		audience: '' //list of possible recipient ?
	},
	cors : {
		urls : 'URL_AUTHORIZED',
		method : 'GET,PUT,POST,DELETE',
		headers : ''
	}
};