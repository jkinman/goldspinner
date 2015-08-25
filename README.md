
# goldspinner
three card poker POC using the two fish encryption
- server	node
- frontend	angular
- framework	express
- auth	passport
- encryption	https://github.com/wouldgo/twofish
- card rendering	https://tairraos.github.io/Poker.JS/
- hand evaluator	https://www.npmjs.com/package/poker-evaluator
- database	mongo


## MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: uAjM4RRGG5iC
   Database Name: pker

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/

  RockMongo User: admin
  RockMongo Password: WHi3lvmTaSMF
URL: https://pker-jkinman.rhcloud.com/rockmongo/

## The OpenShift `nodejs` cartridge documentation can be found at:

### git repo

ssh://55d7e3442d527148370000f7@pker-jkinman.rhcloud.com/~/git/pker.git/

git push ssh://55d7e3442d527148370000f7@pker-jkinman.rhcloud.com/~/git/pker.git/ master 

### ssh access

ssh 55d7e3442d527148370000f7@pker-jkinman.rhcloud.com

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs