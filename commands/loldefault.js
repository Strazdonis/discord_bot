exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    if(!args || args.length < 2) return message.reply("give 2 arguments [summoner name] [region]. retard.");
    const VALID_REGIONS = ["eune", "euw", "na", "las", "brazil"]; //idk if u use something else wtf are you doing
    const summ = args[0];
    const region = args[1].toLowerCase();
    if(!VALID_REGIONS.includes(region)) return message.reply("invalid region - " + region);
    const fs = require('fs');
    const json = client.lolUsers;

    json[message.author.id] = {
        "region": region,
        "summoner": summ,
    };

    client.lolUsers = json;
    fs.writeFileSync('./lol/users.json', JSON.stringify(json));
    message.reply('done, hopefully worked');
};
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "loldefault",
    category: "League Of Legends",
    description: "Set default command arguments for !lol.",
    usage: "loldefault [summoner name] [region]"
};
