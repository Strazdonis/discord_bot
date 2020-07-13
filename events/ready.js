module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, client);

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${client.settings.get("default").prefix}help`, {type: "PLAYING"});

  const fs = require('fs');

  const reminds = require('../lol/reminds.json');
  const temp = new Date();
  const rn = new Date(temp.getFullYear(),temp.getMonth() , temp.getDate()).getTime();
  const channel = client.channels.get("693164917800304732");



  function send() {
    const embed = new client.RichEmbed()
    .setDescription(`Daily reminder to visit\n[hybe](https://www.hybe.com)\n[hellcase](https://www.hellcase.com)\n[betrefs](https://betrefs.com)`)
    .setColor("#5383e8")
    .setTimestamp();
    const at_remind = "<@&693164771591323789>";
    channel.send(at_remind, embed);
    const t1 = new Date();
    let t2 = new Date();
    t2.setDate(t1.getDate()+1);
    t2.setHours(11);
    t2.setMinutes(0);
    t2.setSeconds(0);
    const dif = t2.getTime() - t1.getTime();
    console.log(dif);
    setTimeout(send, dif);
  }

  if(rn - reminds.date >= 86400000) { //24 hrs has passed
    send();
    reminds.date = rn;
    fs.writeFileSync("./lol/reminds.json", JSON.stringify({"date": rn}));
    
  } else {
    console.log(rn - reminds.date);
  }
};
