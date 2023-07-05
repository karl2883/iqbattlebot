const { Collection } = require("discord.js");

class Party {

    constructor(hostID) {
        this.hostID = hostID;
        this.participants = new Collection([[hostID, 100]]);
        this.gameHasStarted = false;
        this.currentPlayer = hostID;
        this.currentChallenged = undefined;
        this.currentCorrectAnswer = undefined;
        this.timeouts = new Collection();
        this.turns = [];
    }

    getHost() {
        return this.hostID;
    }

    end() {
        this.gameHasStarted = false;
        this.currentPlayer = hostID;
        this.currentChallenged = undefined;
        this.currentCorrectAnswer = undefined;
        this.timeouts = new Collection();
        this.turns = [];
    }

    setTimeout(p) {
        this.timeouts.set(p, Date.now());
    }

    hasOngoingTimeout(p) {
        let tout = this.timeouts.get(p);
        if (tout) {
            if (Date.now() - tout < 10000) {
                return true;
            } 
        }
        return false;
    }

    clearTimeouts() {
        this.timeouts.clear();
    }

    selectNewHost() {
        for (var [p, _] of this.participants) {
            if (p == this.hostID) continue;
            else {
                this.hostID = p;
                return true;
            }
        }
        return false;
    }

    startGame() {
        this.gameHasStarted = true;
    }

    isRunning() {
        return this.gameHasStarted;
    }

    getCurrentTurnPlayer() {
        return this.currentPlayer;
    }

    getCurrentChallenged() {
        return this.currentChallenged;
    }

    getCurrentCorrectAnswer() {
        return this.currentCorrectAnswer;
    }

    getNewTurnPlayer() {
        if (this.turns.length == this.participants.size) {
            this.turns = [];
        }
        for (var [p, _] of this.participants) {
            if (this.turns.includes(p)) continue;
            else {
                this.currentPlayer = p;
                this.turns.push(p);
                return p;
            }
        }
    }


    async announceNewTurn(interaction, isMessage) {
        let p = this.getNewTurnPlayer();
        if (isMessage) {
            await interaction.channel.send(`It\'s <@${p}>\'s turn! Choose between /trivia and /punch.`);
            return;
        }
        await interaction.followUp(`It\'s <@${p}>\'s turn! Choose between /trivia and /punch.`);
    }

    getIQ(participant) {
        return this.participants.get(participant);
    }

    addIQ(participant, amount) {
        this.participants.set(participant, this.getIQ(participant)+amount);
    }
    
    addParticipant(participant) {
        this.participants.set(participant, 100);
    }

    removeParticipant(participant) {
        this.participants.delete(participant);
    }

    hasParticipant(participant) {
        return this.participants.has(participant);
    }

    setChallenged(participant) {
        this.currentChallenged = participant;
    }

    setCorrectAnswer(letter) {
        this.currentCorrectAnswer = letter;
    }

    showLeaderboard(interaction, followUp) {
        let leaderboardText = "";
        for (var [p, iq] of this.participants) {
            leaderboardText += `<@${p}> - ${iq}IQ\n`;
        }
        if (followUp) {
            interaction.followUp(leaderboardText);
        } else {
            interaction.channel.send(leaderboardText);
        }
    }

    isInTriviaQuestion() {
        return !!this.currentChallenged;
    }
    
    gameEnded() {
        for (var [p, iq] of this.participants) {
            if (iq < 0) {
                return p;
            }
        }
        return false;
    }
}

module.exports = { Party };
