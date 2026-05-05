const mineflayer = require('mineflayer');

const botArgs = {
    host: 'primesmpseasons.aternos.me', // Your Aternos IP
    port: 25565,                     // Standard Java port
    username: 'PRIME_LEGEND',       // The name you whitelisted
    version: '1.21.1',               // Your server version
    auth: 'offline'                  // Required for Cracked servers
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
        console.log('Bot has spawned in the server!');
        
        // --- AFK MOVEMENT LOOP ---
        // Jumps every 15 seconds to prevent idle kicks
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 15000);

        // Moves forward and back every 5 minutes
        setInterval(() => {
            console.log('Performing 5-minute movement check...');
            bot.setControlState('forward', true);
            setTimeout(() => {
                bot.setControlState('forward', false);
                bot.setControlState('back', true);
                setTimeout(() => bot.setControlState('back', false), 1000);
            }, 1000);
        }, 300000); 
    });

    // Auto-Reconnect Logic
    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting in 10 seconds...');
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log('Error encountered: ' + err);
        if (err.code === 'ECONNREFUSED') {
            console.log('Server is offline. Retrying in 1 minute...');
            setTimeout(createBot, 60000);
        }
    });
}

createBot();

// Basic web server to keep Render/Replit from sleeping
const http = require('http');
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(8080);
