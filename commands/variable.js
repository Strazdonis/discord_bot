exports.run = (client, message, args) => {
    if(args.length < 3) return message.reply("command expected at least 3 arguments [set/get] [@user(s)] [variable] [value (if set)]");
    if(args[0].toLowerCase() != "set" && args[0].toLowerCase() != "get") return message.reply("first argument should be `set` or `get`");
    const mentions = message.mentions.users;
    const len = [...mentions].length;
    if(!mentions) return message.reply("must mentions at least one user");
    const key = args[1+len];
    const val = args[2+len];
    let variables = client.variables;
    console.log(key);
    console.log(val);
    let affectedusrs = [];
    if(args[0] == "set") {
        mentions.forEach(user => {
            if(!variables[user.id]) {
                
                variables[user.id] = {};
            }
            console.log(user.username);
            affectedusrs.push(user.username);
            variables[user.id][key] = val;
        });

        console.log(affectedusrs);
        client.logger.log(`set variable "${key}" to "${val}" for "${affectedusrs.toString()}"`, client);
        client.variables = variables;
        const fs = require('fs');
        fs.writeFileSync(__dirname+'\\..\\lol\\variables.json', JSON.stringify(variables));
    } else {
        const embed = new client.RichEmbed()
        .setColor("#5383e8")
        .setTimestamp();
        mentions.forEach(user => {
            console.log(user);
            if(key.toLowerCase() == "all") {
                if(variables[user.id]) {
                    let message = '';
                    Object.entries(variables[user.id]).forEach(arr => {
                        message += `${arr[0]} = ${arr[1]}\n`;
                    });
                    embed.addField(`**${user.username}**`, `\`${message}\``);
                } else {
                    embed.addField(`**${user.username}**`, `\`HAS NO VARIABLES SET\``)
                }
            } else if(variables[user.id] && variables[user.id][key] !== undefined) {
                embed.addField(`**${user.username}**`, `\`${key} = ${variables[user.id][key]}\``);
            } else {
                embed.addField(`**${user.username}**`, `\`VARIABLE ${key} NOT SET\``);
            }
            
        });
        message.channel.send(embed);
    }

};
      
        
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};
        
exports.help = {
    name: "variable",
    category: "Miscelaneous",
    description: "sets a variable for a member",
    usage: "variable [set/get] [@user(s)] [variable] [value]"
};
        