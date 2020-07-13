exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const fs = require("fs");
  if (!args || args.length < 2) return message.reply("Must provide 2 arguments [old name] [new name]. retard.");
  const oldName = args[0].toLowerCase();
  const newName = args[1].toLowerCase();
  
  fs.readdir("./img/", (err, files) => {
    files.forEach(file => {
      const name = file.slice(0, file.lastIndexOf(".")).toLowerCase();
      if (name == oldName) {
        const renameTo = `${newName}${file.slice(file.lastIndexOf("."))}`;
        fs.rename(`./img/${file}`, `./img/${renameTo}`, err => {
          if ( err ) message.reply("ERROR: " + err);
          return message.reply("Done! You should do !reloademotes now");
        });
      }
      client.emotes[name] = "./img/"+file;
    });
    return message.reply("Didn't find anything");
  });

    
};
    
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
    
exports.help = {
  name: "rename",
  category: "Miscelaneous",
  description: "Renames an emote.",
  usage: "rename [old name] [new name]"
};
    