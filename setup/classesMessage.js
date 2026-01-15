const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const fs = require("fs");

module.exports = async (guild, config) => {
  const data = require("../data/messages.json");
  if (data.classesMessageIds?.length) return;

  const channel = guild.channels.cache.get(config.channels.classes);
  if (!channel) return console.error("❌ Channel classes introuvable");

  const embed = new EmbedBuilder()
    .setTitle("⚔️ Classes Lost Ark")
    .setDescription("Clique sur les boutons pour ajouter ou retirer tes classes")
    .setColor("Orange");

  const classEntries = Object.entries(config.roles.classes);

  const rows = [];
  let currentRow = new ActionRowBuilder();

  for (const [classKey] of classEntries) {
    const button = new ButtonBuilder()
      .setCustomId(`class_${classKey}`)
      .setLabel(formatLabel(classKey))
      .setStyle(ButtonStyle.Secondary);

    currentRow.addComponents(button);

    if (currentRow.components.length === 5) {
      rows.push(currentRow);
      currentRow = new ActionRowBuilder();
    }
  }

  if (currentRow.components.length > 0) {
    rows.push(currentRow);
  }

  // 🔹 Envoi en plusieurs messages (5 rows max par message)
  data.classesMessageIds = [];

  for (let i = 0; i < rows.length; i += 5) {
    const chunk = rows.slice(i, i + 5);

    const msg = await channel.send({
      embeds: i === 0 ? [embed] : [],
      components: chunk
    });

    data.classesMessageIds.push(msg.id);
  }

  fs.writeFileSync("./data/messages.json", JSON.stringify(data, null, 2));

  console.log("✅ Messages classes envoyés");
};

function formatLabel(text) {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}
