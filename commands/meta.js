exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    const role = args[0];
    (async () => {
        // /pg-ranking
        const rp = require('request-promise');
        const cheerio = require('cheerio');
        var url = `https://www.proguides.com/leagueoflegends/meta/`;
        const embed = new client.RichEmbed();
        embed.setColor("#5383e8").setTimestamp();
        try {
            const html = await rp(url);
            var $ = cheerio.load(html);
        } catch(err) {
            message.reply(err.text());
        }

        var metaObj = {};

        try{
            const RANKING_SELECTOR = `#pg-role-rankings > .pg-ranking`;

            metaObj.patch   = $('#patch-review-patch-id').text().trim();
            metaObj.impact  = $(`#patch-review-patch-impact`).text().trim();
            metaObj.top     = [];
            metaObj.jungle  = [];
            metaObj.mid     = [];
            metaObj.bottom  = [];
            metaObj.support = [];
            embed.setAuthor(`Patch ${metaObj.patch}, ${metaObj.impact} meta impact`);
            const ROLES = ['top', 'jungle', 'mid', 'bottom', 'support'];
            const CIRCLES = {
                "High": client.emojis.find(emoji => emoji.name === 'high_availability'), 
                "Neutral": client.emojis.find(emoji => emoji.name === 'neutral_availability'),
                "Low": client.emojis.find(emoji => emoji.name === 'low_availability')
            };

            ROLES.forEach(role => {
                let payload = "";
                $(`${RANKING_SELECTOR}[data-role="${role}"] > .champion-cards > .champion-card`).each((i, el) => {
                    if(i>=5) {
                        return false; //break
                    } 
                    let obj = {};
                    obj.name = $(`.text > .champion-name`, el).text().trim();
                    obj.wr   = $(`.text > .champion-stats .champion-win-rate > td:not(.label)`, el).text().trim();
                    obj.availability = $(`.text > .champion-stats .champion-availability .availability-text`, el).text().trim();
                    payload += `${CIRCLES[obj.availability]} ${obj.name} (${obj.wr})\n`;
                    metaObj[role].push(obj);
                });

                embed.addField(role.toUpperCase(), payload, true);
                
            });
            message.channel.send(embed);
            return metaObj;
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
    aliases: [],
    permLevel: "User"
  };
    
  exports.help = {
    name: "meta",
    category: "League Of Legends",
    description: "Shows you lane metas.",
    usage: "meta"
  };
    