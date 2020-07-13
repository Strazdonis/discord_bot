/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    if (!args || args.length < 1) return message.reply("Must provide at least 1 argument [champion] (optional role). retard.");
    let champion = args[0].toLowerCase().replace(/[-_\s]/g, "");
    console.log(champion);
    let role = '';
    const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];

    let msg = `using arguments:\nchampion: ${champion}`;
    if(args.length == 2 && ROLES.includes(args[1].toLowerCase())) {
        role = args[1].toLowerCase();
        msg += `\nrole: ${role}`;
    }

    message.channel.send(msg);

    function strToEmote(str) {
        const name = str.replace(/ /g, "_").replace(":", "").replace(/'/g, "").replace(/-/g, "_").replace("Enchantment: ", "");
        console.log(name);
        return client.emojis.find(emoji => emoji.name === name);
    }

    const embed = new client.RichEmbed();
    //const SEPARATOR = ":black_small_square:";
    const SEPARATOR = "\n";
    const EMBEDS = {
        BASIC: new client.RichEmbed(),
        SKILLS: new client.RichEmbed(),
        RUNES: new client.RichEmbed(),
        ITEMS: new client.RichEmbed(),
        
    };
    const EMOTES = {
        SEPARATOR,
        q: client.emojis.find(emoji => emoji.name === 'Q_'),
        w: client.emojis.find(emoji => emoji.name === 'W_'),
        e: client.emojis.find(emoji => emoji.name === 'E_'),
        r: client.emojis.find(emoji => emoji.name === 'R_'),
        1: client.emojis.find(emoji => emoji.name === '1B'),
        2: client.emojis.find(emoji => emoji.name === '2B'),
        3: client.emojis.find(emoji => emoji.name === '3B'),
        4: client.emojis.find(emoji => emoji.name === '4B'),
        5: client.emojis.find(emoji => emoji.name === '5B'),
        6: client.emojis.find(emoji => emoji.name === '6B'),
        7: client.emojis.find(emoji => emoji.name === '7B'),
        8: client.emojis.find(emoji => emoji.name === '8B'),
        9: client.emojis.find(emoji => emoji.name === '9B'),
        10: client.emojis.find(emoji => emoji.name === '10B'),
        11: client.emojis.find(emoji => emoji.name === '11B'),
        12: client.emojis.find(emoji => emoji.name === '12B'),
        13: client.emojis.find(emoji => emoji.name === '13B'),
        14: client.emojis.find(emoji => emoji.name === '14B'),
        15: client.emojis.find(emoji => emoji.name === '15B'),
        blank: client.emojis.find(emoji => emoji.name === 'Empty'),
    };


async function get() {
    const rp = require('request-promise');
    const cheerio = require('cheerio');

    if (typeof champion !== "string") {
        client.logger.log(`dumb bitch ${message.author.name} sent ${champion} as champion in !build`, client);
        throw new TypeError("Champion must be a string.");
        
    }
    
    var url = `https://eune.op.gg/champion/${champion}/statistics/${role}`;
    
try {
    const html = await rp(url);
    var $ = cheerio.load(html);
} catch(err) {
    client.logger.error(err, client);
    message.reply(err.text());
}
    if($(`title`).text() == "Champions - League of Legends - League of Legends") {
        return message.reply('incorrect champion name or opgg broke');
    }

    else {
        var champObj = {};

        try{
            const COUNTER_ROW = `table.champion-stats-header-matchup__table--strong > tbody:nth-child(1) > tr`;
            const STRONG_AGAINST_ROW = `table.champion-stats-header-matchup__table--weak > tbody:nth-child(1) > tr`;
            const SUMMS_TABLE = '.champion-overview__table--summonerspell tbody:nth-child(3)';
            const MAIN_RUNE_TABLE = 'tbody.tabItem:nth-child(4) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1)';
            const RUNE_PAGE_NAME_SELECTOR = 'div.champion-stats-summary-rune__item:nth-child(1) > a:nth-child(1) > div:nth-child(2)';
            const FRAGMENTS = {
                5008: "Adaptive Force",
                5005: "Attack Speed",
                5007: "Cooldown Reduction",
                5002: "Armor",
                5003: "Magic Resist",
                5001: "Health",
            };
            const ROW_SELECTOR = `tr.champion-overview__row`;
            const TEXT_SELECTOR = `${ROW_SELECTOR} > th`;
            const ITEM_IMG_SELECTOR = `${ROW_SELECTOR} > td > ul > .champion-stats__list__item > img`;
            const WINRATE_SELECTOR = `${ROW_SELECTOR} > td.champion-overview__stats--win > strong`;
            const PICKRATE_SELECTOR = `${ROW_SELECTOR} > td.champion-overview__stats--pick > span`;

            champObj.img        = $('.champion-stats-header-info__image > img').attr('src');
            champObj.patch      = $('.champion-stats-header-version').text();
            champObj.tier       = $(`.champion-stats-header-info__tier b`).text();
            champObj.counters   = "";
            champObj.strongvs   = "";
            champObj.summs      = "";
            champObj.skills     = "";
            champObj.skillOrder = "";
            champObj.runes      = [];
            champObj.runes[0]   = {};
            champObj.runes[1]   = {};
            champObj.runes[2]   = {};
            champObj.itemList   = {};

            /* COUNTERS */

            $(`${COUNTER_ROW} > td:nth-child(1), ${COUNTER_ROW} > td:nth-child(2) b`).each((i, el) => {
                const txt = $(el).text().trim();
                if(i%2 == 0) {
                    champObj.counters += txt;
                } else {
                    champObj.counters += ` (${txt})\n`;
                }
                
            });

            /* STRONG AGAINST */

            $(`${STRONG_AGAINST_ROW} > td:nth-child(1), ${STRONG_AGAINST_ROW} > td:nth-child(2) b`).each((i, el) => {
                const txt = $(el).text().trim();
                if(i%2 == 0) {
                    champObj.strongvs += txt;
                } else {
                    champObj.strongvs += ` (${txt})\n`;
                }
            });

            /* SUMMONERS */

            let cntr=1;
            $(`${SUMMS_TABLE} .champion-stats__list__item img, ${SUMMS_TABLE} .champion-overview__stats--win strong`).each((i, el) => {
                if(cntr%3==0) { //looking at wr
                    champObj.summs += ($(el).text().trim()) + "\n";
                } else { //loking at image
                    const summ = $(el).attr('src').slice(53).split('.')[0]; //get name from image url (//opgg-static.akamaized.net/images/lol/spell/SummonerBarrier.png?image=q_auto,w_42&v=1583298869)
                    const emote = client.emojis.find(emoji => emoji.name === summ);
                    champObj.summs += (emote == null ? summ : emote) + " ";
                }
                cntr++;
            });

            /* SKILL ORDER */

            $(`.champion-overview__table--summonerspell > tbody:nth-child(5) > tr:nth-child(1) > td:nth-child(1) > ul:nth-child(1) > .champion-stats__list__item > span`).each((i, el) => {
                const skill = $(el).text().toLowerCase();
                champObj.skillOrder += EMOTES[skill];
                if(i!=2) {
                    champObj.skillOrder += " > ";
                }
            });
            const SKILLS = [];
            const LETTERS = ['q','w','e','r'];
            $('.champion-skill-build__table > tbody:nth-child(1) > tr:nth-child(2) > td').each((i, el) => {
                const skill = $(el).text().trim().toLowerCase();
                SKILLS.push(skill);
                
            });
            LETTERS.forEach((l) => {
                champObj.skills += EMOTES[l];
                SKILLS.forEach((skill,i) => {
                    if(skill == l) {
                        champObj.skills += EMOTES[i+1];
                    } else {
                        champObj.skills += EMOTES.blank;
                    }
                });

                champObj.skills += "\n";
            });

            /* RUNES */


            const RUNE_RESULTS = $(`${RUNE_PAGE_NAME_SELECTOR}, ${MAIN_RUNE_TABLE} .perk-page__item--active img, ${MAIN_RUNE_TABLE} .fragment img.active`);
            let rune_pages = $(Array.from(RUNE_RESULTS)[0]).text();
            let split = rune_pages.split("+");
            champObj.runes[0].page = split[0].trim();
            champObj.runes[1].page = split[1].trim();
            champObj.runes[2].page = "Fragments";
            cntr=0;
            let payload="";
            RUNE_RESULTS.each((i, el) => {
                if(i!=0) {
                    if(i<7) {
                        const rune = $(el).attr('alt').trim();
                        payload += `${strToEmote(rune)} ${rune}`;
                    } else {
                        const fragment = FRAGMENTS[$(el).attr('src').slice(49).split(".")[0]];
                        payload += `${strToEmote(fragment)} ${fragment}`;
                    }
                    
                    if(i == 4 || i == 6 || i == 9) {
                        champObj.runes[cntr++].runes = payload;
                        payload="";
                    } else {
                        payload+="\n";
                    }
                }

            });


            /* ITEMS */

            let key;
            let pr = 0;
            $(`${ITEM_IMG_SELECTOR}, ${TEXT_SELECTOR}, ${WINRATE_SELECTOR}, ${PICKRATE_SELECTOR}`).each((i, el) => {
                
                const is_item = $(el).is('img');
                const is_wr = $(el).is('strong');
                const is_pr = $(el).is('span');
                const is_text = $(el).is('th');
                

                if(is_item) {
                    champObj.itemList[key].items.push($(el).attr('src').slice(44).split(".")[0]);
                } else if(is_pr) {
                    pr = $(el).text().trim();
                } else if(is_wr) {
                    const len = champObj.itemList[key].items.length;
                    champObj.itemList[key].items[len] = $(el).text().trim() + " - " + pr;
                } else if(is_text) {
                    key = $(el).text().trim();
                    champObj.itemList[key] = {};
                    champObj.itemList[key].items = [];
                } else {
                    console.log("UNDEFINED: ", $(el));
                }
            });


            return champObj;
        }
        catch(err){
            console.log(err);
            message.reply(err);
            client.logger.error(err, client);
            Promise.reject(err);
        }
    }
}



const ok = get().then(data => {

    EMBEDS.BASIC
    .addField('**Summoner Spells**', `${data.summs}`)
    .addField('**Countered By**', `${data.counters}`, true)
    .addField('**Strong against**', `${data.strongvs}`, true)
    .setThumbnail("https:"+data.img)
    .setColor("#5383e8")
    .setAuthor(`${champion.charAt(0).toUpperCase() + champion.slice(1)} - ${data.tier.toLowerCase()}`)
    .setTimestamp();

    EMBEDS.SKILLS
    .setDescription(`${data.skills}`)
    .addField(`**skill priority**`, data.skillOrder)
    .setColor("#5383e8");


    EMBEDS.ITEMS
    .setColor("#5383e8");

    EMBEDS.RUNES
    .setColor("#5383e8")
    .addField(`${strToEmote(data.runes[0].page)} (${data.runes[0].page})`, data.runes[0].runes, true)
    .addField(`${strToEmote(data.runes[1].page)} (${data.runes[1].page})`, data.runes[1].runes, true)
    .addField(`${data.runes[2].page}`, data.runes[2].runes, true);

    const items = data.itemList;
    let recom_build_cntr =0;
    Object.keys(items).forEach(key => {
        let payload = "";
        items[key]['items'].forEach(val => {
            
            if(!val.includes("%")) { //item
                if(client.items[val] != undefined) {
                    let name = client.items[val].replace("Enchantment: ", "");
                    const emote = strToEmote(name);
                    const toAdd = emote != null ? emote : client.items[val];
                    payload += `${toAdd}`;
                } else {
                    payload += val + SEPARATOR;
                }
                
                
            } else { //winrate
                if(key == "Recommended Builds") {
                    if(recom_build_cntr++ > 2) {
                        return;
                    }
                }
                EMBEDS.ITEMS.addField(`**${key}** (${val})`, payload, (key == "Boots" || key == "Starter Items" ? true : false));
                payload = "";
            }
        });


    });

    Object.values(EMBEDS).forEach(embed => {
        message.channel.send(embed);
    });

    
});
    
};
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
    
  exports.help = {
    name: "build",
    category: "League Of Legends",
    description: "Shows you what to build on a champ.",
    usage: "build [champion] (optional role)"
  };
    