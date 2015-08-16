#include <nan.h>
#include <sodium.h>
#include "natrium.h"


#define EXPORT(name) Nan::Set(target, NAN_TEXT(name), Nan::GetFunction(Nan::New<v8::FunctionTemplate>(natrium::name)).ToLocalChecked())
#define EXPORT_INT(name, value) target->ForceSet(NAN_TEXT(name), Nan::New<v8::Integer>(value), v8::ReadOnly)

NAN_MODULE_INIT(Init) {
	EXPORT(random);
	EXPORT(random_seed);
	EXPORT(sign_keypair);
	EXPORT(sign);
	EXPORT(verify);
	EXPORT(box_keypair);
	EXPORT(box_key);
	EXPORT(zero);

	EXPORT_INT(size_seed, crypto_sign_SEEDBYTES);
	EXPORT_INT(size_sign_public, crypto_sign_PUBLICKEYBYTES);
	EXPORT_INT(size_sign_secret, crypto_sign_SECRETKEYBYTES);
	EXPORT_INT(size_sign, crypto_sign_BYTES);
	EXPORT_INT(size_box_public, crypto_box_PUBLICKEYBYTES);
	EXPORT_INT(size_box_secret, crypto_box_SECRETKEYBYTES);
	EXPORT_INT(size_box_key, crypto_box_BEFORENMBYTES);
}

NODE_MODULE(natrium, Init)

#undef EXPORT
