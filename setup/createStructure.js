const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = async (guild, roles) => {
  const exists = guild.channels.cache.find(c => c.name === "SALON D’ACCUEIL");
  if (exists) return;

  const accueil = await guild.channels.create({
    name: "SALON D’ACCUEIL",
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: roles.certified, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: roles.qualified, allow: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  await guild.channels.create({ name: "bienvenue", type: ChannelType.GuildText, parent: accueil });
  await guild.channels.create({ name: "recherche-de-groupe", type: ChannelType.GuildText, parent: accueil });
  await guild.channels.create({ name: "Général", type: ChannelType.GuildVoice, parent: accueil });

  const guilde = await guild.channels.create({
    name: "GUILDE",
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: roles.qualified, allow: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const text = ["terminal", "hall-of-fail", "agenda", "annonces"];
  for (const name of text)
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: guilde });

  const voice = ["Radio libre", "Raid 4", "Raid 8"];
  for (const name of voice)
    await guild.channels.create({ name, type: ChannelType.GuildVoice, parent: guilde });
};
