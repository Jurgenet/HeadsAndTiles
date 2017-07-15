'use strict'

const fs = require('fs');
const _ = require('lodash');
const colors = require('colors');
const readlineSync = require('readline-sync');

const statsFile = 'statistics.txt';

let sides = ['Heads', 'Tails'];
let winMessages = [
    'Nice try, Dude!',
    'W-o-O-o-W! You won!!!',
    'F$$K! Are you cheater?!'
];
let loseMessages = [
    'Ha-ha-ha! You\'re a l-o-o-o-ser!!!',
    'Don\'t worry, better luck next time!',
    'It\'s a complete failure, Dude!'
];

greeting();

while (true) {
    let index = readlineSync.keyInSelect(sides, 'Which side?');

    if (index === -1) { // cancel
        goodbye();
        break;
    } else {
        let thrownCoin = Math.round(Math.random());
        let isGuessed = thrownCoin === index;
        
        showRandomMessageFromArray(
            isGuessed ? winMessages : loseMessages, 
            sides[index], 
            sides[thrownCoin]
        );
        saveResult(statsFile, isGuessed);
    }
};

function greeting() {
    let welcome = 'Welcome to Heads and Tails Game!';
    let astr = '*';
    let astrLine = astr.repeat(welcome.length + 8).inverse;

    console.log(`
    ${astrLine}
    ${astr.inverse}   ${welcome.rainbow}   ${astr.inverse}
    ${astrLine}
    `);
};

function goodbye() {
    console.log(`
    ${'  Oh, NO! Why are you leaving so soon!? '.black.bgYellow}`);

    // destruct not working =(
    // let [winCount, loseCount] = getStatistics(statsFile);
    let result = getStatistics(statsFile);
 
    console.log(`
    ----------- TOTAL STATISCICS -----------

    -> You win ${result[0].toString().bgGreen.white} times
    -> You lost ${result[1].toString().bgRed.black} times

    * * * * * * *  ${'GAME  OVER'.zebra}  * * * * * * *
    `);
};

function showRandomMessageFromArray(array, yourChoice, trownCoin) {
    console.log(`
    ${array[Math.floor(Math.random() * array.length)]}
    Your choice is ${yourChoice}, thrown coin is ${trownCoin}
    `);
};

function saveResult(file, result) {
    fs.appendFileSync(file, `${Number(result)}`);
}

function getStatistics(file) {
    let buff;

    try {
        buff = fs.readFileSync(file);
    } catch(err) {
        //
    }

    return [
        (buff && buff.toString().match(/1/g).length) || 0, 
        (buff && buff.toString().match(/0/g).length) || 0,
    ];
};