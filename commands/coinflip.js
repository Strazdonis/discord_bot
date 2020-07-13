exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    const embed = new client.RichEmbed();
    var outcome = [];
    outcome.Face = 0;
    outcome.Coin = 0;
    const roll = Math.random();
    let result = roll > 0.5 ? "Face" : "Coin";
    outcome[result]++;
    embed
    .addField('Roll', `${roll}`, true)
    .addField('Result', result, true)
    .setColor("#5383e8")
    .setTimestamp();  



    if(args.length > 0) {
        const amount = parseInt(args[0]);
        if(amount > 1 && amount <= 7) {
            for(let i=2; i<=amount; i++) {
                let rand = Math.random();
                let result = rand > 0.5 ? "Face" : "Coin";
                outcome[result]++;
                embed.addField("Flip #" + i, "-");
                embed.addField("Roll", `${rand}`, true)
                embed.addField("Result", result, true);
            }
            const winner = outcome.Face > outcome.Coin ? "face wins" : outcome.Face != outcome.Coin ? "coin wins" : "tie";
            embed.setDescription(`**Outcome: ${winner}**\nFaces: ${outcome.Face} Coins: ${outcome.Coin}`);
        } else {
            return message.reply("amount has to be > 1 and < 8")
        }

    }
    message.channel.send(embed);
    
};
    
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
    
  exports.help = {
    name: "coinflip",
    category: "Miscelaneous",
    description: "Flips a coin.",
    usage: "coinflip (optional roll count)"
  };
    