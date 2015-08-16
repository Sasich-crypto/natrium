import natrium from './build/debug.node';
import debug from 'debug';

let log = debug('natrium');

export class Natrium {
	size = {
		public: natrium.size_sign_public,
		secret: natrium.size_sign_secret,
		seed: natrium.size_seed,
		signature: natrium.size_sign,
		box_public: natrium.size_box_public,
		box_secret: natrium.size_box_secret,
		box_key: natrium.size_box_keyt
	}

	random(size) {
		if(!Number.isInteger(size) || size < 1)
			return Promise.reject(new Error('size should be an integer number and greater than 0'));

		return new Promise(function(success) {
			natrium.random(size, success);
		});
	}

	random_seed() {
		return new Promise(function(success) {
			natrium.random_seed(success);
		});
	}

	sign_keypair(seed) {
		if(!Buffer.isBuffer(seed) || seed.length != this.size.seed)
			return Promise.reject(new Error('seed should be a Buffer of size ' + this.size.seed));

		return new Promise(function(success, fail) {
			natrium.sign_keypair(seed, function (error, pk, sk) {
				if(error)
					return fail(error);

				success({public: pk, secret: sk, seed});
			});
		});
	}

	new_sign_keypair() {
		return this.random_seed().then(seed => this.sign_keypair(seed));
	}

	sign(secret, message) {
		if(!Buffer.isBuffer(secret) || secret.length != this.size.secret)
			return Promise.reject(new Error('secret should be a Buffer of size ' + this.size.secret));

		if(!Buffer.isBuffer(message) || message.length === 0)
			return Promise.reject(new Error('message should be a Buffer of a size greater than 0'));

		return new Promise(function(success, fail) {
			natrium.sign(secret, message, function (error, signature) {
				if(error)
					return fail(error);

				success(signature);
			});
		});
	}

	verify(pk, signature, message) {
		if(!Buffer.isBuffer(pk) || pk.length != this.size.public)
			return Promise.reject(new Error('public key should be a Buffer of size ' + this.size.public));

		if(!Buffer.isBuffer(signature) || signature.length === 0)
			return Promise.reject(new Error('signature should be a Buffer of a size greater than 0'));

		if(!Buffer.isBuffer(message) || message.length === 0)
			return Promise.reject(new Error('message should be a Buffer of a size greater than 0'));

		return new Promise(function(success, fail) {
			natrium.verify(pk, signature, message, function (error) {
				if(error)
					return fail(error);

				success();
			});
		});
	}

	box_keypair() {
		return new Promise(function(success, fail) {
			natrium.box_keypair(function (error, pk, sk) {
				if(error)
					return fail(error);

				success({public: pk, secret: sk});
			});
		});
	}

	// secret is own secret key
	// pk is the someone else's public key
	box_key(secret, pk) {
		if(!Buffer.isBuffer(pk) || pk.length != this.size.box_public)
			return Promise.reject(new Error('public key should be a Buffer of size ' + this.size.box_public));

		if(!Buffer.isBuffer(secret) || secret.length != this.size.box_secret)
			return Promise.reject(new Error('secret key should be a Buffer of size ' + this.size.box_secret));

		return new Promise(function(success, fail) {
			natrium.box_key(pk, secret, function (error, key) {
				if(error)
					return fail(error);

				success(key);
			});
		});
	}
}

let na = new Natrium();
export default na;


//na.new_sign_keypair().then(function (key) {
//	return na.random(4).then(function (message) {
//		return na.sign(key.secret, message).then(function (signature) {
//			log({message, signature});
//			return na.verify(key.public, signature, message).then(() => log('Verified!'));
//		});
//	});
//}).catch(log);

na.box_keypair().then(function (alice) {
	log({alice});

	return na.box_keypair().then(function (bob) {
		log({bob});

		return na.box_key(alice.secret, bob.public).then(function (key) {
			log({key});
		}).then(function () {
		return na.box_key(bob.secret, alice.public).then(function (key) {
			log({key});
		});
		});
	});
}).catch(log);
