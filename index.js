const { Client, GatewayIntentBits } = require("discord.js");
const config = {
  token: process.env.DISCORD_TOKEN,
  guildId: process.env.GUILD_ID,
  channels: {
    rules: process.env.CHANNEL_RULES,
    classes: process.env.CHANNEL_CLASSES,
    agenda: process.env.CHANNEL_AGENDA,
    annonces: process.env.CHANNEL_ANNONCES
  },
  roles: {
    certified: process.env.ROLE_CERTIFIED,
    qualified: process.env.ROLE_QUALIFIED,
    classes: {
      berserker: process.env.CLASS_BERSERKER,
      paladin: process.env.CLASS_PALADIN,
      destroyer: process.env.CLASS_DESTROYER,
      gunlancer: process.env.CLASS_GUNLANCER,
      slayer: process.env.CLASS_SLAYER,
      valkyrie: process.env.CLASS_VALKYRIE,

      sorceress: process.env.CLASS_SORCERESS,
      arcanist: process.env.CLASS_ARCANIST,
      bard: process.env.CLASS_BARD,
      summoner: process.env.CLASS_SUMMONER,

      glaivier: process.env.CLASS_GLAIVIER,
      scrapper: process.env.CLASS_SCRAPPER,
      soulfist: process.env.CLASS_SOULFIST,
      wardancer: process.env.CLASS_WARDANCER,
      striker: process.env.CLASS_STRIKER,
      breaker: process.env.CLASS_BREAKER,

      artillerist: process.env.CLASS_ARTILLERIST,
      deadeye: process.env.CLASS_DEADEYE,
      gunslinger: process.env.CLASS_GUNSLINGER,
      machinist: process.env.CLASS_MACHINIST,
      sharpshooter: process.env.CLASS_SHARPSHOOTER,

      deathblade: process.env.CLASS_DEATHBLADE,
      reaper: process.env.CLASS_REAPER,
      shadowhunter: process.env.CLASS_SHADOWHUNTER,
      souleater: process.env.CLASS_SOULEATER,

      aeromancer: process.env.CLASS_AEROMANCER,
      artist: process.env.CLASS_ARTIST,
      wildsoul: process.env.CLASS_WILDSOUL
    }
  }
};
// 🔐 Token depuis variable d'environnement (Railway / VPS)
const TOKEN = process.env.DISCORD_TOKEN || config.token;

if (!TOKEN) {
  console.error("❌ Aucun token Discord trouvé !");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// 🔥 Gestion des erreurs globales
process.on("unhandledRejection", err => {
  console.error("🚨 Unhandled Rejection:", err);
});

process.on("uncaughtException", err => {
  console.error("🚨 Uncaught Exception:", err);
});

client.once("ready", async () => {
  console.log(`🤖 Connecté : ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(config.guildId);

    await require("./setup/createStructure")(guild, config.roles);
    await require("./setup/rulesMessage")(guild, config);
    await require("./setup/classesMessage")(guild, config);

    require("./events/interactionCreate")(client, config);
    require("./schedule/agenda")(client, config);

    console.log("✅ Bot initialisé avec succès");
  } catch (err) {
    console.error("❌ Erreur lors de l'initialisation :", err);
  }
});

client.login(TOKEN);
