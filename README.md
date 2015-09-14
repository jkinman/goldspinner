
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

## building
### running locally

- start mongo - ```mongod

### mongo shell commands
http://docs.mongodb.org/manual/reference/sql-comparison/
- show dbs
- use pker-dev
- show collections
- db.threecardpokers.find({_id:ObjectId("55e6199b27850150599c6ef0")})


grunt
grunt build
grunt buildcontrol:openshift

grunt serve
grunt serve:dist
## links
- https://github.com/DaftMonk/generator-angular-fullstack
- https://developers.openshift.com/en/node-js-example-meanstack.html

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

to deploy:
grunt build
cd dist
git add .
git commit -am "commit message"
git push ssh://55d7e3442d527148370000f7@pker-jkinman.rhcloud.com/~/git/pker.git/ master 

### ssh access

ssh 55d7e3442d527148370000f7@pker-jkinman.rhcloud.com

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs

## known issues
- 3 card straights not being recognised
- dealer non qualify anti not being refunded properly
- anti payout not working right

## todo / notes
### Aug 27
- backdoor password tom&joel
- add tooltip for hand details

### Sept 4
- create simulation with 5 for everything and run 100 hands
- 
done
- add play bet on deal
	- add message for raising play bet
- move card name under deal qualified
- remove goldspinner from footer everywhere
- add win / lost per hand as well summary
- change to best 5 from best 6
- add option for displaying string cards names

### sept 11 feedback
-- ive fixed the wording on these pages
* I find the login part very frustrating
and I know the people I will be showing this to will also be completely frustrated and will not proceed when they are on their own.

* as I mentioned in the spec it needs to be a normal regular login system and this means being able to email the password back to the user when they they forget it.

* I have used up my email addresses and cannot get in to the site. JK - you dont need to use a real email address, anything that looks like an email adress will work.

* last time I looked the evaluation part still had problems though the raise on the Fold or Raise part, play part was accepting the raised bet.

-- The regester button on the login page was a link that went to the register page. Ive changed this to be a discriptive link not a button now. this should clear up this confusion. same with the login button on the register page.

* when I try to login the "login" button disappears so I have to click a disappeared button which will be very disturbing to the people i will be showing this to

* when I register the "register" button disappears.
