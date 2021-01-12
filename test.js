var GPIO = require('onoff').Gpio;
var Coin = new GPIO(4, 'in', 'falling', { debounceTimeout : 50 });

Coin.watch((err, value) => {
    if (err) throw err;
    console.log('A');
});