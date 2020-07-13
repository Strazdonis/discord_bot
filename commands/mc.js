


exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    const names = Object.keys(client.uuids).map(k => k.toLowerCase());
    if(args.length < 1) return message.reply(`please specify a name [${names.toString().replace(/,/g, ", ")}]`);
    if(!names.includes(args[0].toLowerCase())) return message.reply(`specified name is invalid\nvalid options are: [${names.toString().replace(/,/g, ", ")}]`)
    const uuid = client.uuids[args[0].toLowerCase()];
    const fs = require('fs');
    const nbt = require('prismarine-nbt');
    const http = require('http');
    const file = fs.createWriteStream(uuid+".nbt");

    const request = http.get("http://64.225.96.222:8080/data?uuid="+uuid, function(response) {
      response.pipe(file);
    });
    
    file.on('close', () => {
      go();
    });
    
    function go() {
      fs.readFile(uuid+'.nbt', function(error, data) {
        if (error) throw error;
     
        nbt.parse(data, function(error, data) {
            let user = nbt.simplify(data);
            const inventory = user.Inventory;
    
            delete user.Brain;
            delete user.Attributes;
            delete user.SpawnForced;
            delete user.SleepTimer;
            delete user.Spawns;
            delete user.abilities;
            delete user.Invulnerable;
            delete user.FallFlying;
            delete user.PortalCooldown;
            delete user.DeathTime;
            delete user.CanUpdate;
            delete user.XpSeed;
            delete user.Mition;
            delete user.SpawnZ;
            delete user.SpawnX;
            delete user.SpawnY;
            delete user.Air;
            delete user.Rotation;
            delete user.recipeBook;
            delete user.UUIDLeast;
            delete user.foodExhaustionLevel;
            delete user.UUIDMost;
            delete user.DataVersion;
            delete user.HurtTime;
            delete user.FallDistance;
            delete user.seenCredits;
            delete user.Score;
            delete user.foodTickTimer;
            delete user.foodSaturationLevel;
            delete user.Inventory;
            delete user.XpP;
            console.log(user);

            var inv = new client.RichEmbed();
            
            const stats = new client.RichEmbed();
            stats
            .setColor("#5383e8")
            .setAuthor(args[0])
            .setDescription("stats")
            .setTimestamp();
            Object.keys(user).forEach(k => {
                if(user[k] != "" && k != "") {
                    let val = user[k];
                    if(k == "Motion" || k == "Pos") {
                        val = `X: ${user[k][0].toFixed(1)} Y: ${user[k][1].toFixed(1)} Z: ${user[k][2].toFixed(1)}`;
                    }
                    stats.addField(k, val, true);
                }
                
            });

            message.channel.send(stats);

            if(args.length > 1 && args[1] == "true") {
                console.log("OK");
                let counter = 0;
            
                inventory.forEach(item => {
                    if(counter++ > 24) {
                        inv
                        .setColor("#5383e8")
                        .setAuthor(args[0])
                        .setDescription("inventory");
                        message.channel.send(inv);
    
                        counter = 0;
                        
                        inv = new client.RichEmbed();
                    }
                    inv.addField(`${item.id.replace("minecraft:", "")} ${item.Count > 1 ? '(' +item.Count+ ')' : ''}`, `slot: ${item.Slot}`, true);
                });
                if(counter != 0) {
                    inv
                    .setColor("#5383e8")
                    .setAuthor(args[0])
                    .setDescription("inventory");
                    message.channel.send(inv);
                }
            }

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
    name: "mc",
    category: "Minecraft",
    description: "Shows information about player",
    usage: "mc [name] (optional true for inventory info)"
};
  