const mineflayer = require('mineflayer');
const http = require('http');

// 1. BOT CONFIGURATION
const botArgs = {
    host: 'primesmpseasons.aternos.me', // Replace with your Aternos IP
    port: 25565,                     // Standard Java port
    username: 'PRIME_LEGEND',             // Name you added to whitelist
    version: '1.21.1',               // Your server version
    auth: 'offline'                  // Required for Cracked servers
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
        console.log('Success: Bot has spawned in the server!');
        
        // --- AFK MOVEMENT LOOP ---
        // Jumps every 15 seconds to prevent idle kicks
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);

        // Moves forward and back every 5 minutes to bypass strict detection
        setInterval(() => {
            console.log('Running 5-minute activity check...');
            bot.setControlState('forward', true);
            setTimeout(() => {
                bot.setControlState('forward', false);
                bot.setControlState('back', true);
                setTimeout(() => bot.setControlState('back', false), 1000);
            }, 1000);
        }, 300000); 
    });

    // AUTO-RECONNECT LOGIC
    bot.on('end', () => {
        console.log('Disconnected. Attempting to reconnect in 10 seconds...');
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log('Connection Error: ' + err);
        if (err.code === 'ECONNREFUSED') {
            console.log('Server is OFFLINE. Retrying in 1 minute...');
            setTimeout(createBot, 60000);
        }
    });
}

// Start the bot
createBot();

// 2. RENDER PORT BINDING (REQUIRED)
// This tells Render the service is "Live" so you can see the logs.
const port = process.env.PORT || 10000; 
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Minecraft Bot is Online and Active.");
    res.end();
}).listen(port, '0.0.0.0', () => {
    console.log(`Web server successfully listening on port ${port}`);
});
