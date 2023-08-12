import { DynamicPropertiesDefinition, EntityTypes, system, world } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';

const refreshRate = 100; //How many ticks the leaderboards will take to refresh.
//Lower will speed it up, but cause more lag. Beware!
//Default is 100 ticks, or 5 seconds.

const configItem = 'minecraft:nether_star'; //The item that will open the config menu.

const adminTag = 'stafftag'; //The tag that allows players to rename text entities.

const cmdPrefix = '!' //Prefix for custom commands.

const prefixMulti = new Map([['null', 1], ['k', 1e3], ['m', 1e6], ['b', 1e9], ['t', 1e12], ['qd', 1e15], ['qt', 1e18]]);
const formatting = [
	{ divider: 1e3, suffix: 'k' },
	{ divider: 1e6, suffix: 'm' },
	{ divider: 1e9, suffix: 'b' },
	{ divider: 1e12, suffix: 't' },
	{ divider: 1e15, suffix: 'qd' },
	{ divider: 1e18, suffix: 'qt' }
];
const lbProps = new DynamicPropertiesDefinition()
	.defineString('lbName', 64)
	.defineString('objName', 15)
	.defineNumber('topX')
	.defineString('numCo', 5, '§a')
	.defineString('namCo', 5, '§b')
	.defineString('scoCo', 5, '§c')
world.afterEvents.worldInitialize.subscribe(evd => {
	evd.propertyRegistry.registerEntityTypeDynamicProperties(lbProps, EntityTypes.get('floating:text'))
});
world.afterEvents.itemUse.subscribe(evd => {
	const player = evd.source;
	if (evd.itemStack.typeId !== configItem) return;
	if (!player.hasTag(adminTag)) return;
	const blockLook = player.getBlockFromViewDirection({ maxDistance: 10 })?.block;
	if (!blockLook) return;
	const aboveLoc = { x: blockLook.x + 0.5, y: blockLook.y + 1, z: blockLook.z + 0.5 };
	if (!player.dimension.getBlock(aboveLoc)?.isAir()) return;
	let [nearestLB] = player.dimension.getEntities({ type: 'floating:text', location: aboveLoc, closest: 1 });
	new ModalFormData()
		.title('§l§5Leaderboard Settings')
		.textField('§6Enter the objective name\n§7This is the objective that will be tracked on the leaderboard', 'money, coins, time', nearestLB?.getDynamicProperty('objName'))
		.textField('§6Enter the display name\n§7This is the text that will display above the top players', '§l§6Top Coins§r, §bTime Played', nearestLB?.getDynamicProperty('lbName'))
		.textField('§6Enter the colour for the LB number', '', nearestLB?.getDynamicProperty('numCo') ?? '§a')
		.textField('§6Enter the colour for the player name', '', nearestLB?.getDynamicProperty('namCo') ?? '§b')
		.textField('§6Enter the colour for the score', '', nearestLB?.getDynamicProperty('scoCo') ?? '§c')
		.slider('§6Select the top X players to display on the scoreboard', 1, 25, 1, nearestLB?.getDynamicProperty('topX'))
		.toggle('§6Delete this leaderboard?\n§cNo §f| §aYes', false)
		.show(player).then(response => {
			if (response.canceled) return;
			const [obj, disp, numCo, namCo, scoCo, top, del] = response.formValues;
			if (!nearestLB) nearestLB = player.dimension.spawnEntity('floating:text', aboveLoc);
			if (del) return nearestLB.triggerEvent('text:despawn');
			if (numCo.length !== 2 || namCo.length !== 2 || scoCo.length !== 2)
				return player.sendMessage('§cColour inputs must be two characters long!')
			world.getDimension('overworld').runCommandAsync(`scoreboard objectives add ${obj} dummy`);
			nearestLB.setDynamicProperty('objName', obj);
			nearestLB.setDynamicProperty('lbName', disp);
			nearestLB.setDynamicProperty('topX', top);
			nearestLB.setDynamicProperty('numCo', numCo);
			nearestLB.setDynamicProperty('namCo', namCo);
			nearestLB.setDynamicProperty('scoCo', scoCo);
			nearestLB.addTag('leaderboard');
		})
});
system.runInterval(() => {
	for (const entity of world.getDimension('overworld').getEntities({ type: 'floating:text', tags: ['leaderboard'] })) {
		let obj = entity.getDynamicProperty('objName');
		let leader = entity.getDynamicProperty('lbName');
		let newTop = topleaderboard(obj), current = 1;
		const plrNames = entity.nameTag.match(/(?<=\d§r\. .{2}).*(?=§r: .{2})/g);
		const plrScores = entity.nameTag.replace(/,/g, '').match(/(?<=§r: .{2})[0-9.]+/g);
		const plrMultis = entity.nameTag.match(/(?<=\d)\D(?=\n|$)/g);
		for (let i = 0; i < entity.nameTag.match(/\n/g)?.length; i++) {
			const plrName = plrNames[i];
			if (newTop.some(v => v.name === plrName)) continue;
			const multiplier = prefixMulti.get(plrMultis[i]) ?? 1;
			const plrScore = Math.floor(parseFloat(plrScores[i] ?? 0) * multiplier * 100) / 100;
			newTop.push({
				name: plrName,
				score: plrScore
			})
		}; newTop.sort((a, b) => b.score - a.score);
		for (let i of newTop.slice(0, entity.getDynamicProperty('topX'))) {
			const money = i.score;
			let moneyFormatted = money.toString();
			if (money >= 1000) {
				for (let i = 0; i < formatting.length; i++)
					if (money >= formatting[i].divider)
						moneyFormatted = (Math.floor((money / formatting[i].divider) * 100) / 100) + formatting[i].suffix;
			}
			leader += `\n${entity.getDynamicProperty('numCo')}${current}§r. ${entity.getDynamicProperty('namCo')}${i.name}§r: ${entity.getDynamicProperty('scoCo')}${moneyFormatted}`;
			current++;
		}
		entity.nameTag = leader;
	}
	function topleaderboard(obj) {
		/** @type {{name:string,score:number}[]} */
		const scores = [];
		world.getPlayers().forEach(plr => {
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
	try {
		return (objDB[objective] ??= world.scoreboard.getObjective(objective))?.getScore(target) ?? 0;
	} catch { return 0; }
};