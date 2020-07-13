module.exports = async (client, reaction, user) => {  
    // console.log("=======================GUILD================================");
    //   console.log(guild);
    //   console.log("=======================USER================================");
    //   console.log(user);
    //   console.log("=======================REACTION================================");
    //   console.log(user);
      const message = reaction.message;
      if (reaction.emoji.name !== '⭐') return;
      if (message.author.id === user.id) return message.channel.send(`${user}, you cannot star your own messages.`);
      if (message.author.bot) return message.channel.send(`${user}, you cannot star bot messages.`);
      const { starboardChannel } = client.settings.get(message.guild.id);
      const starChannel = client.guilds.get(message.guild.id).channels.get('680555651126132755');
      if (!starChannel) return message.channel.send(`It appears that you do not have a \`${starboardChannel}\` channel.`); 
      const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
      const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
      if (stars) {
        const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
        const foundStar = stars.embeds[0];
        const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : '';
        const embed = new client.RichEmbed()
          .addField('Original', `[Jump!](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(foundStar.color)
          .setDescription(foundStar.description)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setTimestamp()
          .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
          .setImage(image);
        const starMsg = await starChannel.fetchMessage(stars.id);
        await starMsg.edit({ embed });
      }
      if (!stars) {
        const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : '';
        if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
        const embed = new client.RichEmbed()
          .addField('Original', `[Jump!](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(15844367)
          .setDescription(message.cleanContent)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setTimestamp(new Date())
          .setFooter(`⭐ 1 | ${message.id}`)
          .setImage(image);
        await starChannel.send({ embed });
      }
    }
  

    function extension(reaction, attachment) {
      const imageLink = attachment.split('.');
      const typeOfImage = imageLink[imageLink.length - 1];
      const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
      if (!image) return '';
      return attachment;
    }
