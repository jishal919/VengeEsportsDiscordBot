module.exports = {
    name: 'ping',
    description: 'Ping command',
    execute: async (message, args, client) => {
        const msg = await message.channel.send(`Pinging...`);
        msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`);
    },
};

