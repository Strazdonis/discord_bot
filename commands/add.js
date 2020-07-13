exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 2) return message.reply("Must provide 2 arguments [name] [url]. retard.");
  const name = args[0];
  const url = args[1];
  //download somehow
  const { DownloaderHelper } = require('node-downloader-helper');
  const options = {
    fileName: {name: name, ext: false}, // Custom filename when saved
    retry: true, // { maxRetries: number, delay: number in ms } or false to disable (default)
    maxRetries: 5,
    delay: 500,
    removeOnStop: true, // remove the file when is stopped (default:true)
    removeOnFail: true, // remove the file when fail (default:true)
    override: false, // if true it will override the file, otherwise will append '(number)' to the end of file
    httpRequestOptions: {}, // Override the http request options  
    httpsRequestOptions: {}, // Override the https request options, ex: to add SSL Certs
}
  const dl = new DownloaderHelper(url, './img/', options);
  dl.on('end', (t) => {
    client.wordList.push(name);
    client.emotes[name] = './img/'+t.fileName;
    client.logger.log(`Added emote ${t.fileName}`, client);
    message.reply('Download Completed. You can now do - ' + t.fileName.slice(0, t.fileName.lastIndexOf(".")));
  });
  dl.start();
  
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
  
exports.help = {
  name: "add",
  category: "Miscelaneous",
  description: "Adds an emote to the list.",
  usage: "add [name] [url]"
};
  