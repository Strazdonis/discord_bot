exports.run = async (client, message) => { // eslint-disable-line no-unused-vars
    const rp = require('request-promise');
    const fs = require('fs');
    const url = 'http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json';
    const json = JSON.parse(await rp(url));
    
    let newJSON = [];
    let newarr = [];

    json.forEach(item => {
        newJSON.push({id: item.id, name: item.name});
        newarr[item.id] = item.name;
    });

    client.itemsJSON = newJSON;
    client.items = newarr;
    
    console.log(process.cwd(), __dirname);
    fs.writeFileSync(process.cwd() + '/lol/items.json', JSON.stringify(newJSON));
    client.logger.log('updated items', client);
    return message.reply("done");
};
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "updateitems",
    category: "League Of Legends",
    description: "Updates item list (helps if !build is broken)",
    usage: "updateitems"
};
