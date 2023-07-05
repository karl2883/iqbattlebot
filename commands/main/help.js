const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Explains how the bot works"),
    async execute(interaction) {
        await interaction.reply("To get started, create a party with /start_party. Now other people can join with /join. Once everyone has joined, you can start the actual game with /begin.\nThis is a turn-based game. At the start, everyone has an IQ of 100. The goal is to avoid getting a negative IQ. At every turn, a player can either battle someone via a trivia question or punch someone. If they choose to /trivia, the person who answers with the correct answer letter first wins IQ, the other one loses. Be aware to not violate the timeout the bot gives you if you answer wrong. If you /punch someone (which you can only do if your IQ is lower - it's a primitive method), then they'll lose a set amount of IQ through brain damage - if the command doesn't backfire (small chance).\nMembers can check their IQ at any point with /iq. If you want to end the current party, do so with /end_party. Members can also leave with /leave.");
    
}


