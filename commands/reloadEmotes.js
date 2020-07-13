exports.run = (client, message) => {
    console.log(message);
    const fs = require("fs");
    client.wordList = [];
    client.emotes = {};
    fs.readdir("./img/", (err, files) => {
        console.log(files);
        files.forEach(file => {
        const name = file.slice(0, file.lastIndexOf(".")).toLowerCase();
        client.wordList.push(name);
        client.emotes[name] = "./img/"+file;
        });
        message.reply("Done! Now there are " + client.wordList.length + " emotes");
    });

};

      
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
        
exports.help = {
  name: "reloademotes",
  category: "Miscelaneous",
  description: "Reloads all emotes from folder.",
  usage: "reloademotes"
};
        