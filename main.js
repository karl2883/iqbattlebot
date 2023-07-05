const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

client.parties = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


client.once(Events.ClientReady, c => {
    console.log("The IQ Battle bot is now officially ready to objectively and accurately measure your IQ.");
});


client.on(Events.MessageCreate, async message => {
    let party = client.parties.get(message.channelId);
    if (message.author.bot) return;
    if (party) {
        if (party.isInTriviaQuestion()) {
            let messager = message.author.id;
            if ([party.getCurrentTurnPlayer(), party.getCurrentChallenged()].includes(message.author.id)) {
                console.log(message.content.toUpperCase());
                if (["A", "B", "C", "D"].includes(message.content.toUpperCase())) {
                    if (party.hasOngoingTimeout(message.author.id)) {
                        await message.reply("Your timeout is not over yet! Because of your impatience, it has been reset to 10 seconds.");
                        party.setTimeout(message.author.id);
                        return;
                    }
                    if (message.content.toUpperCase() == party.getCurrentCorrectAnswer()) {
                        let other = party.getCurrentTurnPlayer();
                        if (other == message.author.id) {
                            other = party.getCurrentChallenged();
                        }
                        party.addIQ(message.author.id, 13);
                        party.addIQ(other, -14);
                        await message.reply(`Correct! You gained **13IQ** (new IQ: **${party.getIQ(message.author.id)}**) while your opponent lost **14IQ** (new IQ: **${party.getIQ(other)}**). L.`);
                        party.setChallenged(undefined);
                        party.setCorrectAnswer(undefined);
                        party.clearTimeouts();
                        let p = party.gameEnded();
                        if (p) {
                            await interaction.followUp(`The trivia battle pushed <@${p}>'s IQ below 0! Disappointing. The game is over!\nFinal leaderboard:'`);
                            party.showLeaderboard(message, true);
                            party.end();
                        } else {
                            await party.announceNewTurn(message, true);
                        }
                    } else {
                        await message.reply(`Wrong! You can answer again in 10 seconds.`);
                        party.setTimeout(message.author.id);
                    }
                } 
            }
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`No command matching ${interaction.command} was found.`);
        return;
    }


    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

client.login(token);
