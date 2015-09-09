'use strict';

var crypto = require('crypto');
var _ = require('lodash');
var Threecardpoker = require('./threecardpoker.model');
var Shuffle = require('shuffle');
var PokerEvaluator = require("poker-evaluator");
var encrypt = require('triplesec');
var decrypt = require('triplesec');
var triplesec = require('triplesec');

exports.getCards = function(num) {
	var deck = Shuffle.shuffle();
	deck.reset();
	deck.shuffle();
	deck.shuffle();

	console.log('shuffling a new deck');
	console.log('getting ' + num + 'cards');

	// get short name
	var retval = [];
	for (var i = deck.cards.length - 1; i >= 0; i--) {
		var card = deck.cards[i].toShortDisplayString();
		if (card.indexOf('10') > -1) {
			card = card.replace('10', 'T');
		}
		retval.push(card);
	};

	return (retval);
	// return( exports.convertCardFormat( deck.draw( num )));
};

// Get list of threecardpokers
exports.index = function(req, res) {
	console.log("Get list of threecardpokers");
	Threecardpoker.find(function(err, threecardpokers) {
		if (err) {
			return handleError(res, err);
		}
		var hand = exports.getCards(52);
		return res.status(200).json(hand);
	});
};

// Get a single threecardpoker
exports.show = function(req, res) {
	console.log("Get a single threecardpoker");
	Threecardpoker.findById(req.params.id, function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		if (!threecardpoker) {
			return res.status(404).send('Not Found');
		}
		return res.json(threecardpoker);
	});
};

// Creates a new threecardpoker in the DB.
exports.create = function(req, res) {
	console.log("Creates a new threecardpoker in the DB.");

	// shuffle and get a full deck
	var deck = exports.getCards(52);

	var poker = new Threecardpoker(req.body);


	poker.deck = deck;
	poker.hands = nottkiDeal(deck);
	// extract and store the bets made by player
	for (var i = poker.hands.length - 1; i >= 0; i--) {
		poker.hands[i].bets = {
			pairsPlus: poker.bets[i].pairsPlus,
			anti: poker.bets[i].anti,
			play: poker.bets[i].play,
			sixCard: poker.bets[i].sixCard
		};
	};

	poker.key = poker._id;
	poker.userId = req.user._id;
	// poker.cipher = crypto.createCipher('aes192', poker.key);
	poker.state = "initialized";

	// use tripplesec encrypt


	triplesec.encrypt({

		data: new triplesec.Buffer(poker.deck),
		key: new triplesec.Buffer(poker.key),
		progress_hook: function(obj) { /* ... */ }

	}, function(err, buff) {

		if (!err) {
			var ciphertext = buff.toString('hex');
			console.log( "cipher done " + ciphertext );
			poker.encryptedDeck = ciphertext;
		}

	});


	// poker.encryptedDeck = poker.cipher.update(JSON.stringify( deck ), 'utf8', 'hex') + poker.cipher.final('hex');
	// poker.decipher = poker.cipher.update( JSON.stringify( deck ), 'utf8', 'hex') + poker.cipher.final('hex');

	// example from SO
	// var cipher = crypto.createCipher(algorithm, key);  
	// var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
	// var decipher = crypto.createDecipher(algorithm, key);
	// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

	// console.log( poker.hands );
	poker.save(function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(201).json(threecardpoker);
	});
};


exports.resolveGame = function(req, res) {
	console.log("Resolve an open threecardpoker in the DB.");

	if (req.body._id) {
		delete req.body._id;
	}

	console.log("looking for game: ");
	console.log(req.params.id);

	Threecardpoker.findById(req.params.id, function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		if (!threecardpoker) {
			return res.status(404).send('Not Found');
		}
		var deck = threecardpoker.deck;
		// extract and store the bets made by player
		for (var i = threecardpoker.hands.length - 1; i >= 0; i--) {
			threecardpoker.hands[i].bets.play = threecardpoker.bets[i].play;
		};

		console.log("found it about to update with dealers hands and ranks");
		threecardpoker.dealer = {
			cards: [deck[11], deck[12], deck[13]],
			rank: PokerEvaluator.evalHand([deck[11], deck[12], deck[13]])
		};
		threecardpoker.dealerQualified = threecardpoker.dealer.rank.handRank > 190;
		threecardpoker.state = "resolved";

		// eval and add the highest 6 card hand.
		console.log(threecardpoker.dealer.cards);
		for (var i = threecardpoker.hands.length - 1; i >= 0; i--) {
			var highestSixCard = evalSixCard(threecardpoker.hands[i].cards, threecardpoker.dealer.cards);
			console.log(highestSixCard);
			threecardpoker.hands[i].sixCardRank = highestSixCard;
		};

		// run through the tally algo
		scoreHands(threecardpoker.hands, threecardpoker.dealer.cards);

		threecardpoker.totalMoney = tallyWinnings(threecardpoker.hands) - tallyBets(threecardpoker.hands);
		req.user.balance += threecardpoker.totalMoney;
		req.user.save();
		// var updated = _.merge(threecardpoker, req.body);

		threecardpoker.save(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(200).json(threecardpoker);
		});
	});


}

// Updates an existing threecardpoker in the DB.
// this is if you decide to play hands.
exports.update = function(req, res) {
	console.log("Updates an existing threecardpoker in the DB.");

	if (req.body._id) {
		delete req.body._id;
	}

	console.log("looking for game: ");
	console.log(req.params.id);

	Threecardpoker.findById(req.params.id, function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		if (!threecardpoker) {
			return res.status(404).send('Not Found');
		}


		var updated = _.merge(threecardpoker, req.body);
		updated.save(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(200).json(threecardpoker);
		});
	});
};

// Deletes a threecardpoker from the DB.
exports.destroy = function(req, res) {
	Threecardpoker.findById(req.params.id, function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		if (!threecardpoker) {
			return res.status(404).send('Not Found');
		}
		threecardpoker.remove(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(204).send('No Content');
		});
	});
};


function nottkiDeal(cards) {
	var hands = [];
	hands[0] = {
		cards: [cards[0], cards[4], cards[8]]
	};
	hands[1] = {
		cards: [cards[1], cards[5], cards[9]]
	};
	hands[2] = {
		cards: [cards[2], cards[6], cards[10]]
	};
	hands[3] = {
		cards: [cards[0], cards[1], cards[2]]
	};
	hands[4] = {
		cards: [cards[4], cards[5], cards[6]]
	};
	hands[5] = {
		cards: [cards[8], cards[9], cards[10]]
	};
	hands[6] = {
		cards: [cards[10], cards[5], cards[0]]
	};
	hands[7] = {
		cards: [cards[2], cards[5], cards[8]]
	};

	var ranks = evaluateHands(hands);

	for (var i = hands.length - 1; i >= 0; i--) {
		hands[i].rank = ranks[i];

		var flushHand = isFlush(hands[i].cards);
		var strHand = (hands[i].cards[0] + hands[i].cards[1] + hands[i].cards[2]).toLowerCase();

		if (flushHand) {

			if (strHand.indexOf('a') > -1 && strHand.indexOf('k') > -1 && strHand.indexOf('q') > -1) {
				hands[i].rank.handName = "straight flush";
			} else if (hands[i].rank.handName == "straight") {
				hands[i].rank.handName = "royal flush";
			} else {
				hands[i].rank.handName = "flush";

			}
		}

	};

	return hands;
}

function isFlush(hand) {

	var strHand = (hand[0] + hand[1] + hand[2]).toLowerCase();

	if (strHand.split("s").length - 1 > 2 || strHand.split("d").length - 1 > 2 || strHand.split("c").length - 1 > 2 || strHand.split("h").length - 1 > 2) {
		return true;
	}
	return false;
}


function scoreHands(hands) {
	// score hands

	var scoringTable = {
		pairsPlus: {
			"straight flush": 40, // straight flush
			"three of a kind": 30, //threeOfKind
			"straight": 5, //straight
			"flush": 4, //flush
			"one pair": 1, //pair
			"invalid hand": 0,
			"high card": 0,
			"two pairs": 1,
			"full house": 0,
			"four of a kind": 0,
		},
		anti: {
			"straight flush": 5, // straight flush
			"three of a kind": 4, //threeOfKind
			"straight": 1, //straight
			"flush": 0, //flush
			"one pair": 0, //pair
			"invalid hand": 0,
			"high card": 0,
			"two pairs": 0,
			"full house": 0,
			"four of a kind": 0,
		},
		sixCard: {
			"straight flush": 1000, // straight flush
			"four of a kind": 50, //threeOfKind
			"three of a kind": 5, //threeOfKind
			"straight": 10, //straight
			"flush": 4, //flush
			"one pair": 1, //pair
			"invalid hand": 0,
			"high card": 0,
			"two pairs": 0,
			"full house": 0,
		}

	}

	console.log("scorehands");

	for (var i = hands.length - 1; i >= 0; i--) {
		hands[i].winnings = {};
		hands[i].winnings.pairsPlusTotal = scoringTable.pairsPlus[hands[i].rank.handName] * hands[i].bets.pairsPlus;
		hands[i].winnings.antiBonus = scoringTable.anti[hands[i].rank.handName] * (hands[i].bets.anti + hands[i].bets.play);
		hands[i].winnings.sixCardBonus = scoringTable.sixCard[hands[i].sixCardRank.handName] * hands[i].bets.sixCard;
	};
}

function encryptDeck(data, password) {
	triplesec.encrypt({

		data: new triplesec.Buffer(data),
		key: new triplesec.Buffer(password),
		progress_hook: function(obj) { /* ... */ }

	}, function(err, buff) {

		if (!err) {
			var ciphertext = buff.toString('hex');
			return ciphertext;
		}

	});
}

function decryptDeck(ciphertext, password) {
	triplesec.decrypt({

		data: new triplesec.Buffer(ciphertext, "hex"),
		key: new triplesec.Buffer(password),
		progress_hook: function(obj) { /* ... */ }

	}, function(err, buff) {

		if (!err) {
			console.log(buff.toString());
		}

	});
}

function evaluateHands(hands) {
	console.log("controller - evaluateHands");
	var valuations = [];
	for (var i = hands.length - 1; i >= 0; i--) {
		var hand = [hands[i].cards[0], hands[i].cards[1], hands[i].cards[2]];
		valuations[i] = PokerEvaluator.evalHand(hand);

	}
	return valuations;
}

function handleError(res, err) {
	return res.status(500).send(err);
}

// tally winnings from hands that werent folded and anited up
function tallyWinnings(hands) {

	var retval = 0;
	for (var i = hands.length - 1; i >= 0; i--) {
		if (hands[i].bets.anti > 0) {
			retval = retval + hands[i].winnings.pairsPlusTotal + hands[i].winnings.antiBonus + hands[i].winnings.sixCardBonus;
		}
	};

	return retval;
}

function tallyBets(hands) {

	var retval = 0;
	for (var i = hands.length - 1; i >= 0; i--) {
		retval = retval + hands[i].bets.pairsPlus + hands[i].bets.anti + hands[i].bets.sixCard;
	};

	return retval;
}

function evalSixCard(hand1, hand2) {

	var mh = [hand1[0], hand1[1], hand1[2], hand2[0], hand2[1], hand2[2]];

	// eval all combonations

	// 12345
	// 12346
	// 12456
	// 12356
	// 13456
	// 23456

	var Things = [
		[ // 12345
			mh[0],
			mh[1],
			mh[2],
			mh[3],
			mh[4],
		],
		[ // 12346
			mh[0],
			mh[1],
			mh[2],
			mh[3],
			mh[5],
		],
		[ // 12456
			mh[0],
			mh[1],
			mh[3],
			mh[4],
			mh[5],
		],
		[ // 12356
			mh[0],
			mh[1],
			mh[2],
			mh[4],
			mh[5],
		],
		[ // 13456
			mh[0],
			mh[2],
			mh[3],
			mh[4],
			mh[5],
		],
		[ // 23456
			mh[1],
			mh[2],
			mh[3],
			mh[4],
			mh[5],
		],
	];

	var highestHand = {
		handRank: 0
	};
	for (var i = Things.length - 1; i >= 0; i--) {
		var rank = PokerEvaluator.evalHand(Things[i]);
		// console.log(Things[i]);
		// console.log(rank);
		if (highestHand.handRank < rank.handRank) {
			highestHand = rank;
		}
	};
	return highestHand;
}
