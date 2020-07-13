exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    //if (!args || args.length < 1) return message.reply("Must provide at least 1 argument [summoner name] (optional region). retard.");
    let region;
    const REGIONS = ['eune', 'euw', 'na', 'br', 'lan', 'las', 'oce', 'kr', 'ru', 'tr', 'jp'];
    let name;
    if(args.length == 0) {
        // get user default region and name;
        const fs = require('fs');
        const data = fs.readFileSync('./lol/users.json', 'utf-8');
        const json = JSON.parse(data);
        if(json[message.author.id]) {
            console.log("FOUND!");
            region = json[message.author.id].region;
            name = json[message.author.id].summoner;
            message.channel.send(`found defaults: ${region} - ${name}`);
        } else {
            return message.reply(`no defaults found.\nSet defaults with !loldefault or pass arguments: !lol [summoner] [region]`);
        }
    } else {
        if(args.length > 1) {
            if(REGIONS.includes(args[0].toLowerCase())) {
                region = args[0].toLowerCase();
                name = args[1];
            } else {
                name = args[0];
                region = REGIONS.includes(args[1].toLowerCase()) ? args[1].toLowerCase() : 'eune';
            }
        } else {
            name = args[0];
            region = 'eune';
        }
        message.channel.send(`using arguments: ${region} - ${name}`);
    }
    (async () => {
                const rp = require('request-promise');
                const cheerio = require('cheerio');
                var url = `http://www.lolskill.net/game/${region}/${name}`;
                const embed = new client.RichEmbed();
                embed.setColor("#5383e8").setTimestamp();
                try {
                    const html = await rp(url);
                    var $ = cheerio.load(html);
                } catch(err) {
                    client.logger.error(err, client);
                    message.reply(err.text());
                }
        
                try {
                    if($('.alert.alert-info').text().includes("not ingame")) {
                        
                        return message.channel.send("player not in game");
                    }
                    const PLAYER_SELECTOR = `.gamesummoner-card`;

                    $(`${PLAYER_SELECTOR}`).each((i, player) => {
                        const embed = new client.RichEmbed();
                        const img = $(player).attr("style");
                        if(img.includes("img")) {
                            const thumb = "https://"+img.split("//")[1].replace(");", "");
                            embed.setThumbnail(thumb);
                        }
                        
                        const mastery = $(`.champion-mastery`, player);
                        const rank = $('.rank.tip', player);
                        
                        embed
                        .setColor(i <= 4 ? "#5383e8" : "#f04747")
                        .setAuthor($('.summoner-name a', player).text() + ` - ${mastery.attr('data-champion-name')}`)
                        .setDescription(mastery.attr('data-points') + ' points')
                        .addField('Rank', `${rank.attr('data-tier')} ${rank.attr('data-division')} (${rank.attr('data-leaguepoints')} LP)`, true)
                        .addField('Games', `${$('div.align-items-start.w-100 .games .wins', player).text()} - ${$('div.align-items-start.w-100 .games .losses', player).text()} (${$('div.align-items-start.w-100 .games .value', player).text()})`, true)
                        .addField('Skill', $('.skillscore .value', player).text().trim(), true); 

                        if($('.info-row3 .kda .value', player).text()) {
                            embed
                            .addField('champ KDA', `${$('.info-row3 .kda .value .kills', player).text()}/${$('.info-row3 .kda .value .deaths', player).text()}/${$('.info-row3 .kda .value .assists', player).text()}`, true)
                            .addField('champ WR', `${$('.info-row3 .games .wins', player).text()} - ${$('.info-row3 .games .losses', player).text()} (${$('.info-row3 .games .value', player).text()})`, true);
                        }

                        message.channel.send(embed);
                    });
                }
                catch(err){
                    console.log(err);
                    message.reply(err);
                    client.logger.error(err, client);
                    Promise.reject(err);
                }
                    
    })();

  };
    
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["live", "game"],
    permLevel: "User"
  };
    
  exports.help = {
    name: "lol",
    category: "League Of Legends",
    description: "Shows live game data.",
    usage: "lol [summoner name] (optional region)"
  };
    