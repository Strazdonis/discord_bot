module.exports = async (client, reaction, user) => {
    const message = reaction.message;
    if (reaction.emoji.name !== '⭐') return;
    const { starboardChannel } = client.settings.get(message.guild.id);
    const starChannel = client.guilds.get(message.guild.id).channels.get('680555651126132755');
    if (!starChannel) return message.channel.send(`It appears that you do not have a \`${starboardChannel}\` channel.`); 
    const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
    const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(reaction.message.id));
    if (stars) {
        
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : '';
      const embed = new client.RichEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])-1} | ${message.id}`)
        .setImage(image);
      const starMsg = await starChannel.fetchMessage(stars.id);
      await starMsg.edit({ embed });
      if(parseInt(star[1]) - 1 == 0) {
          console.log('delet');
          return starMsg.delete(1000);
      }
    }
}

// Now, it may seem weird that we use this in the messageReactionRemove event, but we still need to check if there's an image so that we can set it, if necessary.
function extension(reaction, attachment) {
    const imageLink = attachment.split('.');
    const typeOfImage = imageLink[imageLink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}