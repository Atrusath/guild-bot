const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config.json");

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
