exports.run = (client, message, args) => { // eslint-disable-line no-unused-vars
    if(message.mentions) {
      var user = message.mentions.users.first();
    }
    console.log(args);
    // Parse Amount
    const amount = parseInt(args[0]);
    if (!amount || isNaN(args[0])) return message.reply('Must specify an amount to delete!');
    if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
    // Fetch 100 messages (will be filtered and lowered up to max amount requested)
    message.channel.fetchMessages({
     limit: 100,
    }).then((messages) => {
     if (user) {
      const filterBy = user ? user.id : client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
     }
        client.logger.log(`purging ${amount+1} messages`, client);
        message.channel.bulkDelete(amount+1).catch(error => console.log(error.stack));
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['remove', 'delete', 'prune'],
  permLevel: "User"
};

exports.help = {
  name: "purge",
  category: "Moderation",
  description: "removes last x amount of messages",
  usage: "purge"
};
