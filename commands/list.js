exports.run = (client, message) => {
  message.channel.send("https://ibb.co/album/cWDdAa\nthere are " + client.wordList.length + " emotes");
};

    
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
      
exports.help = {
  name: "list",
  category: "Miscelaneous",
  description: "Lists all emotes.",
  usage: "list"
};
      