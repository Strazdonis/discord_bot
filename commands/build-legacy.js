exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    if (!args || args.length < 1) return message.reply("Must provide at least 1 argument [champion] (optional role or opponent) (optional role or opponent). retard.");
    let champion = args[0];
    let role = '';
    const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];
    let opponent = '';

    let msg = `using arguments:\nchampion: ${champion}`;
    console.log(args);
    if(args.length == 2) {
        console.log('ilgis 2');
        if(ROLES.includes(args[1].toLowerCase())) {
            role = args[1].toLowerCase();
            msg += `\nrole: ${role}`;
        } else {
            opponent = args[1].toLowerCase();
            msg += `\nopponent: ${opponent}`;
        }
    }
    else if(args.length == 3) {
        if(ROLES.includes(args[1].toLowerCase())) {
            role = args[1].toLowerCase();
            msg += `\nrole: ${role}\nopponent: ${opponent}`;
            opponent = args[2];
        } else {
            opponent = args[1].toLowerCase();
            role = args[2].toLowerCase();
            msg += `\nopponent: ${opponent}\nrole: ${role}`;

        }
    }
    console.log('ok bro');
    message.channel.send(msg);

    const captureWebsite = require('capture-website');
    (async () => {
        await captureWebsite.buffer(`https://u.gg/lol/champions/${champion}/build?role=${role}&opp=${opponent}`, { 
            launchOptions: {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process', // <- this one doesn't works in Windows
                    '--disable-gpu'
                ],
            },
            styles: [
                `
                    .qc-cmp-ui-showing {
                        overflow: auto !important;
                    }
                    .qc-cmp-showing.qc-cmp-ui-container {
                        background: none !important;
                    }
                `
            ],
            removeElements: [  
                '#qcCmpUi',
                '.qc-cmp-showing.qc-cmp-ui-container',
                '.ad-box-wrapper'
            ],
            type: 'png',
            defaultBackground: false,
            scaleFactor: 1,
            height: 1920,
            width: 1080,
            element: '.champion-recommended-build',
            debug: false,
        }).then(image => {
            const attachment = new client.Attachment(image);
            message.channel.send(attachment);
        });
    })();

  };
    
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
    
  exports.help = {
    name: "build-legacy",
    category: "League Of Legends",
    description: "Shows you what to build on a champ.",
    usage: "build-legacy [champion] (optional role/opponent) (optional role/opponent)"
  };
    