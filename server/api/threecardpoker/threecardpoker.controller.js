'use strict';

var crypto = require('crypto');
var _ = require('lodash');
var Threecardpoker = require('./threecardpoker.model');
var Shuffle = require('shuffle');
var PokerEvaluator = require("poker-evaluator");
var encrypt = require('triplesec');
var decrypt = require('triplesec');
var triplesec = require('triplesec');
var fs = require('fs');

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

exports.downloadDeck = function(req, res) {
	Threecardpoker.findById(req.params.id, function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		if (!threecardpoker) {
			return res.status(404).send('Not Found');
		}

		//res.download(path [, filename] [, fn])
		var filename = process.env.TMPDIR + "deck." + req.params.id + ".txt";
		console.log("downloaddeck to : " + filename);
		var data = threecardpoker.encryptedDeck;
		fs.writeFile(filename, data,
			function(err) {
				if (err) throw err;
				return res.download(filename);
			}
		);
	});
}

exports.downloaddecypher = function(req, res) {
	Threecardpoker.findById(req.params.id, function(err, threecardpoker) {
		if (err) {
			return handleError(res, err);
		}
		if (!threecardpoker) {
			return res.status(404).send('Not Found');
		}

		var filename = process.env.TMPDIR + "key." + req.params.id + ".txt";
		console.log("downloaddecypher to : " + filename);
		var data = threecardpoker.key;
		// update the keysent param
		threecardpoker.keysent = true;
		threecardpoker.state = "keysent";
		threecardpoker.save();

		fs.writeFile(filename, data,
			function(err) {
				if (err) throw err;
				return res.download(filename);
			}
		);
	});
};

// Get list of threecardpokers
exports.index = function(req, res) {

	console.log("testing poker hand eval");
	var hands = [];
	//hands.push(['5d', '4d', '3d']);
	//hands.push(['5s', '2d', '6c']);
	hands.push(['as', '4s', 'kc']);
	hands.push(['6h', 'ac', 'th']);
	hands.push(['4h', '6d', 'qc']);

	for (var i = 0; i < hands.length; i++) {
		console.log('hand : ' + hands[i]);
		console.log('Me   : ');
		console.log(evalThreeCardHand(hands[i]));
		// console.log('Lib  : ');
		// console.log(PokerEvaluator.evalHand(hands[i]));
	};

	return res.status(200).json({});

	// Threecardpoker.find(function(err, threecardpokers) {
	// 	if (err) {
	// 		return handleError(res, err);
	// 	}
	// 	var hand = exports.getCards(52);
	// 	return res.status(200).json(hand);
	// });
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

// shuffle creates a game, on the client side this is triggered by the shuffle action
exports.shuffle = function(req, res) {
	console.log("Creates and encryt the deck.");

	// shuffle and get a full deck
	var deck = exports.getCards(52);

	var poker = new Threecardpoker(req.body);

	poker.deck = deck;

	poker.keysent = false;
	poker.key = poker._id;
	poker.userId = req.user._id;

	// poker.cipher = crypto.createCipher('aes192', poker.key);
	poker.state = "initialized";
	var keyBuffer = new triplesec.Buffer(poker.key);
	// use tripplesec encrypt
	triplesec.encrypt({
		data: new triplesec.Buffer(JSON.stringify(poker.deck)),
		key: new triplesec.Buffer(poker.key),
		progress_hook: function(obj) {
			// console.log( obj );
		}
	}, function(err, buff) {
		if (!err) {
			var ciphertext = buff.toString('hex');
			console.log("cipher done " + ciphertext);
			poker.encryptedDeck = ciphertext;
			poker.save();
			return res.status(201).json(poker);
		}
	});
}

// deal cards and update the exsisting game
exports.create = function(req, res) {
	console.log("Creates a new threecardpoker in the DB.");
	if (req.body._id) {
		delete req.body._id;
	}

	console.log("looking for game: " + req.params.id);

	Threecardpoker.findById(req.params.id, function(err, poker) {
		if (err) {
			return handleError(res, err);
		}
		if (!poker) {
			return res.status(404).send('Not Found');
		}

		var updated = _.merge(poker, req.body);
		// do the deal
		var dealtHands = {};
		if ("traditional" == poker.dealMethod) {
			dealtHands = traditionalDeal(poker.deck.slice());
			console.log( dealtHands);

		} else if ("casino" == poker.dealMethod) {
			dealtHands = nottkiDeal(poker.deck);

		} else {
			dealtHands = nottkiDeal(poker.deck);

		}

		insertRanks(dealtHands.hands);

		// this function accepts array, so construct one here
		var dealerHandArray = insertRanks([dealtHands.dealer]);
		console.log(dealtHands);
		poker.hands = dealtHands.hands;
		poker.dealer = dealtHands.dealer;

		// extract and store the bets made by player
		for (var i = req.body.hands.length - 1; i >= 0; i--) {
			poker.hands[i].bets = {
				pairsPlus: req.body.bets[i].pairsPlus,
				anti: req.body.bets[i].anti,
				play: req.body.bets[i].anti,
				sixCard: req.body.bets[i].sixCard
			};
		};

		poker.save(function(err, threecardpoker) {
			if (err) {
				return handleError(res, err);
			}
			// this returns the cards to the client 
			return res.status(201).json(threecardpoker);
		});
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

		// console.log( threecardpoker );

		var deck = threecardpoker.deck;
		// extract and store the bets made by player
		for (var i = threecardpoker.hands.length - 1; i >= 0; i--) {
			threecardpoker.hands[i].handActive = req.body.hands[i].handActive;
			// threecardpoker.bets[i].play = req.body.hands[i].bets.play;
			threecardpoker.hands[i].bets.play = req.body.hands[i].bets.play;
		};

		if (threecardpoker.dealer.rank.handType > 1) {
			// qualified
			threecardpoker.dealerQualified = true;
		} else {
			threecardpoker.dealerQualified = threecardpoker.dealer.rank.value > 4097;
		}
		threecardpoker.state = "resolved";

		// eval and add the highest 6 card hand.
		for (var i = threecardpoker.hands.length - 1; i >= 0; i--) {
			var highestSixCard = evalSixCard(threecardpoker.hands[i].cards, threecardpoker.dealer.cards);
			threecardpoker.hands[i].sixCardRank = highestSixCard;
		};

		// run through the tally algo
		scoreHands(threecardpoker);

		threecardpoker.totalMoney = tallyWinnings(threecardpoker.hands);
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


// deal to one card to each player and dealer until three cards dealt (charles method of traditional)
function traditionalDeal(deck) {
	var hands = [];
	for (var i = 0; i < 8; i++) {
		hands[i] = {cards:[]};
	};

	var dealer = {
		cards: [],
		rank: {}
	};
	
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < hands.length; j++) {
			console.log("in");
			hands[j].cards.push(deck.pop());
		}
		dealer.cards.push(deck.pop());
	}

	return {
		hands: hands,
		dealer: dealer
	};
}

function nottkiDeal(cards) {
	var dealer = {
		cards: [cards[3], cards[7], cards[11]],
		rank: {}
	};
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

	return {
		hands: hands,
		dealer: dealer
	};
}

function insertRanks(hands) {
	var ranks = evaluateHands(hands);

	for (var i = hands.length - 1; i >= 0; i--) {
		hands[i].rank = ranks[i];
		hands[i].handActive = true;
		var flushHand = isFlush(hands[i].cards);
		var strHand = (hands[i].cards[0] + hands[i].cards[1] + hands[i].cards[2]).toLowerCase();

		if (flushHand) {

			if (strHand.indexOf('a') > -1 && strHand.indexOf('k') > -1 && strHand.indexOf('q') > -1) {
				hands[i].rank.handName = "straight flush";
				hands[i].rank.handType = 9;
			} else if (hands[i].rank.handName == "straight") {
				hands[i].rank.handName = "royal flush";
				hands[i].rank.handType = 10;
			} else {
				hands[i].rank.handName = "flush";
				hands[i].rank.handType = 5;

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


function scoreHands(game) {
	// score hands

	var scoringTable = {
		pairsPlus: {
			"straight flush": 40, // straight flush
			"three of a kind": 30, //threeOfKind
			"straight": 5, //straight
			"flush": 4, //flush
			"one pair": 1, //pair
			"invalid hand": 0,
			"high card": -1,
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
			"flush": 20, //flush
			"one pair": -1, //pair
			"invalid hand": 0,
			"high card": -1,
			"two pairs": -1,
			"full house": 25,
		}

	}

	console.log("scoring hands");

	/**
	Player makes an Ante and/or Pairplus bet

	The dealer gives each player three cards and himself three cards. The player may examine his own cards. 
	The dealer's cards are dealt face down.

	If the player made the Ante bet, then he has must either fold or raise.

	If the player folds, then he forfeits his Ante wager.

	If the player raises, then he must make an additional Play bet, equal exactly to his Ante bet.

	The dealer will turn over his cards.

	The dealer needs a queen high or better to qualify.

	If the dealer does not qualify then the player will win even money on the Ante bet and the Play bet will push.

	If the dealer qualifies, then the player's hand will be compared to the dealer's hand, the higher hand wins. 
	The order of poker hands is indicated below.

	If the player has the higher poker hand then the Ante and Play will both pay even money.

	If the dealer has the higher poker hand then the Ante and Play will both lose.

	If the player and dealer tie then the Ante and Play bets will push.

	If the player made the Ante bet and has a straight or higher then the player will receive an Ante Bonus, 
	regardless of the value of the dealer's hand.

	The Pairplus bet will pay entirely based on the poker value of the player's hand, as shown in the Pairplus section below.
	**/
	var hands = game.hands;

	for (var i = hands.length - 1; i >= 0; i--) {
		// init the starting values and go from there
		hands[i].winnings = {};
		hands[i].winnings.anti = hands[i].bets.anti;
		hands[i].winnings.playBonus = 0;
		// antis only pasy if had is not folded
		// did not dealer qualify
		if (false == game.dealerQualified) {
			if (hands[i].handActive) { // didnt fold
				// anti pays play bet push
				hands[i].winnings.playBonus = 0;
				hands[i].winnings.anti = (hands[i].bets.anti);
			} else {
				// folded loose anti
				hands[i].winnings.playBonus = 0;
				hands[i].winnings.anti = (hands[i].bets.anti * -1);
			}

		} else { // dealer did qualify
			// player fold?
			if (hands[i].handActive) { // didnt fold
				if (hands[i].rank.handType > game.dealer.rank.handType) {
					// player won
					hands[i].winnings.playBonus = hands[i].bets.play;
					hands[i].winnings.anti = hands[i].bets.anti;
				} else if (hands[i].rank.handType == game.dealer.rank.handType) {
					// tied
					// check the cardVal property now
					if (hands[i].rank.cardVal > game.dealer.rank.cardVal) {
						hands[i].winnings.playBonus = hands[i].bets.play;
						hands[i].winnings.anti = hands[i].bets.anti;
					} else if (hands[i].rank.cardVal == game.dealer.rank.cardVal) {
						// now rely on the hand ranking from PokerEvaluator module
						if (hands[i].rank.handRank > game.dealer.rank.handRank) {
							// player won in hand type tie
							hands[i].winnings.playBonus = hands[i].bets.play;
							hands[i].winnings.anti = hands[i].bets.anti;
						} else if (hands[i].rank.handRank == game.dealer.rank.handRank) {
							// actual draw (not likely)
							hands[i].winnings.playBonus = 0;
							hands[i].winnings.anti = 0;
						} else {
							// player lost in hand type tie
							hands[i].winnings.playBonus = hands[i].bets.play * -1;
							hands[i].winnings.anti = hands[i].bets.anti * -1;
						}
					} else {
						// player lost in hand type tie
						hands[i].winnings.playBonus = hands[i].bets.play * -1;
						hands[i].winnings.anti = hands[i].bets.anti * -1;
					}
				} else {
					// player lost
					hands[i].winnings.playBonus = hands[i].bets.play * -1;
					hands[i].winnings.anti = hands[i].bets.anti * -1;
				}

			} else {
				// folded
				hands[i].winnings.anti = hands[i].bets.anti * -1;
				hands[i].winnings.playBonus = 0;
			}

		}

		hands[i].winnings.antiBonus = scoringTable.anti[hands[i].rank.handName] * (hands[i].bets.anti);
		hands[i].winnings.pairsPlusTotal = scoringTable.pairsPlus[hands[i].rank.handName] * hands[i].bets.pairsPlus;
		hands[i].winnings.sixCardBonus = scoringTable.sixCard[hands[i].sixCardRank.handName] * hands[i].bets.sixCard;

		hands[i].payout = 0
		hands[i].payout += hands[i].winnings.anti;
		hands[i].payout += hands[i].winnings.playBonus;
		hands[i].payout += hands[i].winnings.pairsPlusTotal;
		hands[i].payout += hands[i].winnings.antiBonus;
		hands[i].payout += hands[i].winnings.sixCardBonus;

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
		valuations[i] = evalThreeCardHand(hand);
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
		retval += hands[i].winnings.anti;
		retval += hands[i].winnings.playBonus;
		retval += hands[i].winnings.pairsPlusTotal;
		retval += hands[i].winnings.antiBonus;
		retval += hands[i].winnings.sixCardBonus;
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

function evalThreeCardHand(cards) {
	var isFlush = false;
	var isStraight = false;
	var isThreeOfKind = false;
	// you have to make a copy because the PokerEvaluator will augment the array passed by ref with extra placeholder cards
	var cardsCopy = [cards[0], cards[1], cards[2]];
	var rank = PokerEvaluator.evalHand(cardsCopy);
	rank.handType = 1;
	rank.handName = 'high card';
	rank.cardVal = 0;

	// merge cards into one str
	var strCards = cards[0] + cards[1] + cards[2];
	strCards = strCards.toLowerCase();

	//convert each card to vals 0-12, strip suit to look for straights
	var cardVal = 0
	var cardsUsed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	cards.forEach(function(card) {
		var i = Math.floor(CARDS[card.toLowerCase()] / 4);
		if (i > rank.cardVal) {
			rank.cardVal = i;
		};
		cardsUsed[i] = 1;
	}, this);

	// check for flush
	if (strCards.split('s').length - 1 == 3 || strCards.split('d').length - 1 == 3 || strCards.split('c').length - 1 == 3 || strCards.split('h').length - 1 == 3) {
		// its a flush
		isFlush = true;
		var rank = {
			handType: 6,
			handName: 'flush'
		}
	}

	// check for pairs or three of a kind
	var numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 't', 'j', 'q', 'k', 'a'];
	for (var i = 0; i < numbers.length; i++) {
		if (strCards.split(numbers[i]).length - 1 > 1) {
			if (strCards.split(numbers[i]).length - 1 == 3) {
				// three of kind
				var rank = {
					handType: 4,
					handName: 'three of a kind',
					cardVal: i
				};
			} else {
				// pair
				var rank = {
					handType: 2,
					handName: 'one pair',
					cardVal: i
				};
			}
		}
	};

	//check if there is a straight
	var continuousCards = 0;
	var hasStraight = false;
	var straightEndIndex = 0;
	// console.log(cardsUsed);
	for (var i = 0; i <= 12; i++) {
		// console.log( cardsUsed[i] == 0 );
		if (cardsUsed[i] == 0) {
			continuousCards = 0;
		} else {
			continuousCards++;
			if (continuousCards == 3) {
				hasStraight = true;
				straightEndIndex = i;
			}
		}
	}

	if (hasStraight) {
		if (isFlush) {
			if (12 == straightEndIndex) {
				var rank = {
					handType: 10,
					handName: 'royal flush',
					cardVal: straightEndIndex
				};

			} else {
				var rank = {
					handType: 9,
					handName: 'straight flush',
					cardVal: straightEndIndex
				};

			}
		} else {
			var rank = {
				handType: 5,
				handName: 'straight'
			};
		}
	}

	return rank;
}
// takes two 3 card hands
function evalSixCard(hand1, hand2) {

	var mh = [hand1[0], hand1[1], hand1[2], hand2[0], hand2[1], hand2[2]];

	// eval all combonations
	var Things = [
		[
			//mh[0],
			mh[1],
			mh[2],
			mh[3],
			mh[4],
			mh[5],
		],
		[
			mh[0],
			//mh[1],
			mh[2],
			mh[3],
			mh[4],
			mh[5],
		],
		[
			mh[0],
			mh[1],
			//mh[2],
			mh[3],
			mh[4],
			mh[5],
		],
		[
			mh[0],
			mh[1],
			mh[2],
			//mh[3],
			mh[4],
			mh[5],
		],
		[
			mh[0],
			mh[1],
			mh[2],
			mh[3],
			//mh[4],
			mh[5],
		],
		[
			mh[0],
			mh[1],
			mh[2],
			mh[3],
			mh[4],
			//mh[5],
		],
	];

	var highestHand = {
		handRank: 0,
		handType: 0,
	};
	for (var i = Things.length - 1; i >= 0; i--) {
		var rank = PokerEvaluator.evalHand(Things[i]);
		// console.log(Things[i]);
		// console.log(rank);
		if (highestHand.handType < rank.handType) {
			highestHand = rank;
		} else if (highestHand.handType == rank.handType) {
			if (highestHand.handRank < rank.handRank) {
				highestHand = rank;
			}
		}
	};
	return highestHand;
}

var CARDVALS = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'];
var CARDS = {
	"2c": 0,
	"2d": 1,
	"2h": 2,
	"2s": 3,
	"3c": 4,
	"3d": 5,
	"3h": 6,
	"3s": 7,
	"4c": 8,
	"4d": 9,
	"4h": 10,
	"4s": 11,
	"5c": 12,
	"5d": 13,
	"5h": 14,
	"5s": 15,
	"6c": 16,
	"6d": 17,
	"6h": 18,
	"6s": 19,
	"7c": 20,
	"7d": 21,
	"7h": 22,
	"7s": 23,
	"8c": 24,
	"8d": 25,
	"8h": 26,
	"8s": 27,
	"9c": 28,
	"9d": 29,
	"9h": 30,
	"9s": 31,
	"tc": 32,
	"td": 33,
	"th": 34,
	"ts": 35,
	"jc": 36,
	"jd": 37,
	"jh": 38,
	"js": 39,
	"qc": 40,
	"qd": 41,
	"qh": 42,
	"qs": 43,
	"kc": 44,
	"kd": 45,
	"kh": 46,
	"ks": 47,
	"ac": 48,
	"ad": 49,
	"ah": 50,
	"as": 51
}
