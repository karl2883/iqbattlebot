const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test if the bot is online and functional."),
    async execute(interaction) {
        await interaction.reply("The bot is online and functional.");
    },
};
