'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var hand = {
	cards: [String],
	bets: {
		anti: Number,
		play: Number,
		pairsPlus: Number,
		sixCard: Number
	},
	winnings: {
		anti: Number,
		antiBonus: Number,
		playBonus: Number,
		pairsPlusTotal: Number,
		sixCardBonus: Number,
	},
	rank: {
		handName: String,
		value: Number,
		handRank: Number,
		handType: Number
	},
	sixCardRank: {
		handName: String,
		value: Number,
		handRank: Number,
		handType: Number
	},
	handActive: Boolean
};

var ThreecardpokerSchema = new Schema({
	playerName: String,
	info: String,
	deck: [String],
	key: String,
	encryptedDeck: String,
	hands: [hand],
	dealer: hand,
	dealerQualified: Boolean,
	options: {
		numberOfHands: Number,
	},
	bets: [{
		pairsPlus: Number,
		anti: Number,
		play: Number,
		sixCard: Number
	}],
	userId: String,
	state: String,
	totalMoney: Number
});

module.exports = mongoose.model('Threecardpoker', ThreecardpokerSchema);
