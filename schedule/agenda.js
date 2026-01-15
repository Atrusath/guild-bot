const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client, config) => {
  console.log("⏰ Cron agenda initialisé");

  async function clearAgendaChannel(channel, client) 
  {
    console.log("🧹 Nettoyage du salon agenda...");

    let fetched;
    do {
        fetched = await channel.messages.fetch({ limit: 100 });

        const botMessages = fetched.filter(
        msg => msg.author.id === client.user.id
        );

        for (const msg of botMessages.values()) {
        await msg.delete().catch(() => {});
        }
    } while (fetched.size >= 2);

    console.log("🧹 Agenda nettoyé");
  }

  cron.schedule(
    "0 8 * * 3", // mercredi 10:00
    //"* * * * *", // 🔧 TEST
    async () => {
      try {
        console.log("📅 Génération planning raids...");

        const dataPath = path.join(__dirname, "../data/agenda.json");
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(path.dirname(dataPath), { recursive: true });
            fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));
        }
        const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

        const guild = await client.guilds.fetch(config.guildId);
        const agenda = await guild.channels.fetch(config.channels.agenda);
        const annonces = await guild.channels.fetch(config.channels.annonces);
        // 🧹 suppression des anciens messages agenda
        await clearAgendaChannel(agenda, client);
        if (!agenda || !annonces) {
          console.error("❌ Channel agenda ou annonces introuvable");
          return;
        }

        // 🔹 Trouver le mercredi de référence
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const day = start.getDay(); // 0=dimanche
        const diffToWednesday = (3 - day + 7) % 7;
        start.setDate(start.getDate() + diffToWednesday);

        const weekKey = start.toISOString().split("T")[0];
        if (data.lastWeekStart === weekKey) {
          console.log("⏭️ Planning déjà créé");
          return;
        }

        // 📢 Message annonces
        await annonces.send(
          `📢 <@&${config.roles.qualified}> **Les inscriptions aux raids de la semaine sont ouvertes !**`
        );

        // 📅 Création des 7 jours (mercredi → mardi)
        for (let i = 0; i < 7; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);

          const label = date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long"
          });

          const embed = new EmbedBuilder()
            .setTitle(`📅 Raid – ${label}`)
            .setDescription("✅ Présent\n❌ Absent")
            .setColor("Green");

          const msg = await agenda.send({
            content: `Raid & Chill`,
            embeds: [embed]
          });

          await msg.react("✅");
          await msg.react("❌");
        }

        data.lastWeekStart = weekKey;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        console.log("✅ Planning raids créé (7 jours)");
      } catch (err) {
        console.error("❌ Erreur cron agenda :", err);
      }
    },
    { timezone: "Europe/Paris" }
  );
};
