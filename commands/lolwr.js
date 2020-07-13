exports.run = (client, message, args) => {
  const opggScrape = require('opgg-scrape');
  let region;
  let name;
  const REGIONS = ['BR', 'EUNE', 'EUW', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR', 'JP', 'PH', 'SG', 'TH', 'KR', 'PBE', 'CN'];
  let refresh = false;
  console.log(refresh);
  function scrape(name, region, msg) {
    opggScrape.getStats(name, {region: region, refresh: refresh}).then(stats => {
      console.log(stats);
      const embed = new client.RichEmbed()
      .addField('Winrate', `${stats.WinRate} (${stats.Wins} ${stats.Losses})`)
      .addField('KDA ratio', `${stats.KDARatio}`)
      .addField('KDA', `K: ${stats.KDA.kills}, D: ${stats.KDA.deaths}, A: ${stats.KDA.assists}`)
      .addField('OP.GG', `[${region}.op.gg/${name}](https://${region}.op.gg/summoner/userName=${name})`)
      .setColor("#5383e8")
      .setDescription(`${stats.rank} (${stats.rankedLP})`)
      .setAuthor(stats.name, stats.avatarURL)
      .setTimestamp();
      if(msg != null) {
        msg.edit(embed);
      } else {
        message.channel.send(embed);
      }

    });
  }

  if(args.length == 0 || (args.length == 1 && args[0] == "true")) { //if no args or first arg is 'refresh'
      // get user default region and name;
      const json = client.lolUsers;
      if(json[message.author.id]) {  //if the user has his lol username/region saved
          region = json[message.author.id].region;
          name = json[message.author.id].summoner;
          message.channel.send(`found defaults: ${region} - ${name}`).then(msg => {
            scrape(name, region, msg);
          });
      } else {
          if(args.length == 0) return message.reply("expected at least 1 argument");
          if(args.length == 1) {
            console.log('len 1');
            name = args[0];
            region = 'eune';
          } else if(args.length == 2) {
            console.log('len 2');
            name = '';
            region = 'eune';
            args.forEach(arg => {
              if(REGIONS.includes(arg.toUpperCase())) {
                region = arg;
                console.log(arg, 'is region!');
              } else if(arg === true) {
                refresh = true;
              } else {
                name = arg;
              }
            });
          }
          message.reply(`no defaults found.\nSet defaults with !loldefault or pass arguments: !lol [summoner] [region]`);
          scrape(name, region, null);
      }
  } else {
    var names = [];
    region = 'eune';
    args.forEach(arg => {
      if(REGIONS.includes(arg.toUpperCase())) {
        region = arg;
        console.log(arg, 'is region!');
      } else if(arg === true) {
        refresh = true;
      } else {
        names.push(arg);
      }
      
    });
    console.log(name);
      message.channel.send(`using arguments: ${names.toString()} - ${region}`).then(msg => {
        names.forEach((name,i) =>  {
          scrape(name, region, (i == 0 ? msg : null));
        });
      });
  }
};
  
      
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};
        
exports.help = {
    name: "lolwr",
    category: "League Of Legends",
    description: "Shows players winrate",
    usage: "lolwr [name] [region] [refresh (default false)]"
};
        