'use strict';

var crypto = require('crypto');
var _ = require('lodash');
var Threecardpoker = require('./threecardpoker.model');
var Shuffle = require('shuffle');
var PokerEvaluator = require("poker-evaluator");

// reformat the card style to work with all libs
exports.convertCardFormat = function( cards ) {
  var newCards = [];
  for (var i = cards.length - 1; i >= 0; i--) {
      var newCard = {suit:"spade", value: "2", card: "2s"};

      // get suit
      switch( cards[i].suit ) {
        case "Spade" :
          newCard.suit = 'Spades';
          break;
        case "Diamond" :
          newCard.suit = 'Diamonds';
          break;
        case "Spade" :
          newCard.suit = 'Spades';
          break;
        default :
          newCard.suit = 'Clubs';
          break;
        }

      // get value
      switch( cards[i].description ) {
        case "Two" :
          newCard.value = '2';
          break;
        case "Three" :
          newCard.value = '3';
          break;
        case "Four" :
          newCard.value = '4';
          break;
        case "Five" :
          newCard.value = '5';
          break;
        case "Six" :
          newCard.value = '6';
          break;
        case "Seven" :
          newCard.value = '7';
          break;
        case "Eight" :
          newCard.value = '8';
          break;
        case "Nine" :
          newCard.value = '9';
          break;
        case "Ten" :
          newCard.value = '10';
          break;
        case "Jack" :
          newCard.value = 'J';
          break;
        case "Queen" :
          newCard.value = 'Q';
          break;
        case "King" :
          newCard.value = 'K';
          break;
        case "Ace" :
          newCard.value = 'A';
          break;
        default:
          newCard.value = 'A';
          break;
      }

      //only return the shorthand value
      newCard.card = newCard.value + newCard.suit.toLowerCase().charAt(0);
      newCards.push( newCard.card );
    }

  return newCards;

// [{"suit":"Heart","description":"Jack","sort":11},{"suit":"Diamond","description":"Jack","sort":11},{"suit":"Spade","description":"Seven","sort":7},{"suit":"Club","description":"Four","sort":4},{"suit":"Spade","description":"Jack","sort":11},{"suit":"Heart","description":"Ten","sort":10},{"suit":"Heart","description":"Queen","sort":12},{"suit":"Club","description":"Ace","sort":14},{"suit":"Diamond","description":"Six","sort":6},{"suit":"Diamond","description":"Five","sort":5},{"suit":"Heart","description":"King","sort":13},{"suit":"Heart","description":"Seven","sort":7}]
};

exports.getCards = function( num ) {
    var deck = Shuffle.shuffle();
    return( exports.convertCardFormat( deck.draw( num )));
};

// Get list of threecardpokers
exports.index = function(req, res) {
  console.log( "Get list of threecardpokers" );
  Threecardpoker.find(function (err, threecardpokers) {
    if(err) { return handleError(res, err); }
    var hand = exports.getCards( 12 );
    return res.status(200).json( hand );
  });
};

// Get a single threecardpoker
exports.show = function(req, res) {
  console.log( "Get a single threecardpoker" );
  Threecardpoker.findById(req.params.id, function (err, threecardpoker) {
    if(err) { return handleError(res, err); }
    if(!threecardpoker) { return res.status(404).send('Not Found'); }
    return res.json(threecardpoker);
  });
};

// Creates a new threecardpoker in the DB.
exports.create = function(req, res) {
  console.log( "Creates a new threecardpoker in the DB." );
  var poker = new Threecardpoker( req.body );

  // shuffle and get a full deck
  var deck = exports.getCards( 52 );
  poker.deck = deck;
  poker.hands = nottkiDeal( deck );
  poker.state = "start";
  poker.key = poker._id;
  poker.userId = req.user._id;
  poker.cipher = crypto.createCipher('aes192', poker.key);
  poker.dealer = {cards:[deck[11], deck[12], deck[13]], rank: evalHand( [deck[11], deck[12], deck[13]])};
  // poker.encryptedDeck = poker.cipher.update(JSON.stringify( deck ), 'utf8', 'hex') + poker.cipher.final('hex');
  // poker.decipher = poker.cipher.update( JSON.stringify( deck ), 'utf8', 'hex') + poker.cipher.final('hex');

  // example from SO
  // var cipher = crypto.createCipher(algorithm, key);  
  // var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  // var decipher = crypto.createDecipher(algorithm, key);
  // var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

  // console.log( poker.hands );
  poker.save( function(err, threecardpoker) {
    if(err) { 
      return handleError(res, err); 
    }

  // console.log( threecardpoker.hands );

    return res.status(201).json(threecardpoker);
  });
};

// Updates an existing threecardpoker in the DB.
exports.update = function(req, res) {
  console.log( "Updates an existing threecardpoker in the DB." );

  if(req.body._id) { delete req.body._id; }
  
  console.log( "looking for game: " );
  console.log( req.params.id );

  Threecardpoker.findById( req.params.id, function (err, threecardpoker) {
    if (err) { return handleError(res, err); }
    if(!threecardpoker) { return res.status(404).send('Not Found'); }
    
    var updated = _.merge(threecardpoker, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(threecardpoker);
    });
  });
};

// Deletes a threecardpoker from the DB.
exports.destroy = function(req, res) {
  Threecardpoker.findById(req.params.id, function (err, threecardpoker) {
    if(err) { return handleError(res, err); }
    if(!threecardpoker) { return res.status(404).send('Not Found'); }
    threecardpoker.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};


function nottkiDeal( cards ){
  
  var hands = [];

  hands[0] = {cards:[cards[0], cards[4], cards[8]]} ;
  hands[1] = {cards:[cards[1], cards[5], cards[9]]} ;
  hands[2] = {cards:[cards[2], cards[6], cards[10]]} ;
  hands[3] = {cards:[cards[0], cards[1], cards[2]]} ;
  hands[4] = {cards:[cards[4], cards[5], cards[6]]} ;
  hands[5] = {cards:[cards[8], cards[9], cards[10]]} ;
  hands[6] = {cards:[cards[10], cards[5], cards[0]]} ;
  hands[7] = {cards:[cards[2], cards[5], cards[8]]} ;
  console.log( hands );
  var ranks = evaluateHands( hands );
  console.log( hands );

  for (var i = hands.length - 1; i >= 0; i--) {
    hands[i].rank = ranks[i];
  };
 
  return hands;
}

function evaluateHands( hands ){
  console.log( "controller - evaluateHands" );
  var valuations = [];
  for (var i = hands.length - 1; i >= 0; i--) {
    var hand = [hands[i].cards[0], hands[i].cards[1], hands[i].cards[2]];
    valuations[i] = PokerEvaluator.evalHand( hand );
  }
  return valuations;
}

function handleError(res, err) {
  return res.status(500).send(err);
}


