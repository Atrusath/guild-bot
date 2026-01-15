const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = async (guild, config) => {
  const dataPath = path.join(__dirname, "../data/messages.json");
  // 🛡️ Création auto si absent (Fly fix)
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // ⛔ Ne pas recréer le message s'il existe déjà
  if (data.rulesMessageId) return;

  const channel = guild.channels.cache.get(config.channels.rules);
  if (!channel) return console.error("❌ Channel rules introuvable");

  const embed = new EmbedBuilder()
    .setTitle("📜 Règlement du serveur")
    .setDescription(
      "**Bienvenue sur le serveur de la guilde No Stress Progress !**\n\n" +

      "**🤝 1. Respect & comportement**\n" +
      "• Le respect entre membres est obligatoire\n" +
      "• Aucune insulte, provocation ou harcèlement\n" +
      "• Aucun propos discriminatoire ou haineux\n\n" +

      "**💬 2. Communication**\n" +
      "• Utilise les salons pour leur usage prévu\n" +
      "• Pas de spam, flood ou contenu choquant\n" +
      "• Pseudos et avatars appropriés\n\n" +

      "**🎮 3. Jeu & organisation**\n" +
      "• Respecte les horaires et engagements en raid\n" +
      "• Préviens en cas d'absence\n" +
      "• Fair-play obligatoire\n\n" +

      "**📅 4. Agenda & inscriptions**\n" +
      "• Inscris-toi uniquement si tu es disponible\n" +
      "• Réagis honnêtement aux présences\n\n" +

      "**🛡️ 5. Modération**\n" +
      "• Les décisions du staff sont finales\n" +
      "• Tout abus sera sanctionné\n\n" +

      "**⚠️ 6. Sanctions**\n" +
      "• Avertissement → Mute → Exclusion\n\n" +

      "**✅ Validation**\n" +
      "En cliquant sur **J'accepte**, tu confirmes avoir lu et accepté le règlement."
    )
    .setColor("Blue")
    .setFooter({
      text: "Le non-respect des règles entraînera des sanctions"
    });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("accept_rules")
      .setLabel("J'accepte les règles")
      .setStyle(ButtonStyle.Success)
  );

  const msg = await channel.send({
    embeds: [embed],
    components: [row]
  });

  data.rulesMessageId = msg.id;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log("✅ Message des règles envoyé");
};
