import { system, world } from '@minecraft/server';

const refreshRate = 100; //How many ticks the leaderboards will take to refresh.
//Lower will speed it up, but cause more lag. Beware!
//Default is 100 ticks, or 5 seconds.

const topX = 10; //The max top players to display on the leaderboard. Default is 10.

const numberColour = '§a'; //Changes the colour of the position number.
const nameColour = '§b'; //Changes the colour of the player name.
const scoreColour = '§c'; //Changes the colour of the score value.

const adminTag = 'stafftag'; //The tag that allows players to rename text entities.

const cmdPrefix = '!' //Prefix for custom commands.

//Leaderboard:Objective-Header
//The above tag is added to the text entity so it knows what objective to display, as well as the header for the leaderboard.
//An example tag could be 'Leaderboard:money-§l§6TOP COINS'
//The above would track the objective 'money' with a leaderboard heading of '§l§6TOP COINS'.

//leaderboard
//This tag will let the text entity know it is supposed to be displaying a leaderboard.

//!! BOTH TAGS ARE CASE-SENSITIVE !!

system.runInterval(() => {
	for (const entity of world.getDimension("overworld").getEntities({ type: 'floating:text', tags: ['leaderboard'] })) {
		const infoTag = entity.getTags().find(v => v.startsWith('Leaderboard:'));
		if (!infoTag) continue;
		let obj = infoTag.match(/(?<=Leaderboard:).*?(?=-)/)?.shift();
		let leader = infoTag.match(/(?<=-).*/)?.shift();
		let newTop = topleaderboard(obj), current = 1;
		for (let i = 0; i < entity.nameTag.match(/\n/g)?.length; i++) {
			const plrName = entity.nameTag.match(/(?<=\d§r\. .{2}).*(?=§r: .{2})/g)[i];
			if (!newTop.some(v => v.name === plrName))
				newTop.push({
					name: plrName,
					score: Number(entity.nameTag.replace(/,/g, '').match(/(?<=§r: .{2})\d+/g)[i])
				})
		}; newTop.sort((a, b) => b.score - a.score);
		for (let i of newTop.slice(0, topX)) {
			leader += `\n${numberColour.slice(0, 2)}${current}§r. ${nameColour.slice(0, 2)}${i.name}§r: ${scoreColour.slice(0, 2)}${i.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
			current++;
		}
		entity.nameTag = leader;
	}
	function topleaderboard(obj) {
		let scores = new Array();
		[...world.getPlayers()].forEach(plr => {
			scores.push({ name: plr.name, score: getScore(plr, obj) })
		}); scores.sort((a, b) => b.score - a.score)
		return scores;
	}
}, refreshRate);

world.beforeEvents.chatSend.subscribe(chat => {
	const player = chat.sender;
	const inputs = chat.message.split(/\s+/);
	const cmd = inputs.shift();
	if (cmd.toLowerCase() === `${cmdPrefix}rename`) {
		chat.cancel = true;
		system.run(() => {
			if (player.hasTag(adminTag)) {
				const entity = player.getEntitiesFromViewDirection({ maxDistance: 5 })?.shift();
				if (entity?.entity.typeId === 'floating:text') entity.entity.nameTag = inputs.join(' ').replace(/\\n/g, '\n');
			} else player.sendMessage(`§cYou are not allowed to use this command!`);
			return;
		})
	}
});

const objDB = {};
function getScore(target, objective) {
	return (objDB[objective] ??= world.scoreboard.getObjective(objective))?.getScore(target) ?? 0;
};