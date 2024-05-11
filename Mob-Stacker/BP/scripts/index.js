import { Entity, system, world } from "@minecraft/server";

const validMobs = [
	{
		typeId: 'minecraft:cow',
		displayName: 'Cow'
	},
	{
		typeId: 'minecraft:sheep',
		displayName: 'Sheep'
	},
	{
		typeId: 'minecraft:pig',
		displayName: 'Pig'
	},
	{
		typeId: 'minecraft:chicken',
		displayName: 'Chicken'
	},
];

const maxStackSize = 100;
const nameTagConfig = '§e[ §7x# @ §e]'; //Will display as §e[ §7x42 Cow §e], for example.
//# will get replaced by the amount of the mob in the stack.
//@ will get replaced by the display name of the mob in the stack. 
//If you want to use a replace symbol without it being the amount, escape the character by putting a ! before it.

system.runInterval(() => {
	validMobs.forEach(type => {
		world.getDimension("overworld").getEntities({ type: type.typeId }).forEach(entity => {
			/** @type {{entity: Entity, stack: number}[]} */
			const nearbyStacks = [];
			const stacks = entity.dimension.getEntities({ type: entity.typeId, maxDistance: 3, location: entity.location });
			if (stacks.length <= 1) return;
			stacks.forEach(entity => {
				const stackSize = entity.getDynamicProperty('stacker:stack_size') ?? 1;
				if (stackSize < maxStackSize && stackSize > 0) nearbyStacks.push({
					entity: entity,
					stack: stackSize
				})
			})
			const maxStack = (Math.max(...nearbyStacks.map(({ stack }) => stack)));
			const mainStack = nearbyStacks.splice(nearbyStacks.findIndex(v => v.stack === maxStack), 1)?.shift()?.entity;
			const amount = nearbyStacks.reduce((a, b) => a + b.stack, 0);
			if (nearbyStacks.length <= 0) return;
			const entityValues = validMobs.find(v => v.typeId === entity.typeId);
			mainStack.setDynamicProperty('stacker:stack_size', Math.min(amount + maxStack, maxStackSize));
			mainStack.nameTag = nameTagConfig.replace(/(?<!!)#/g, Math.min(amount + maxStack, maxStackSize).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')).replace(/(?<!!)@/g, entityValues?.displayName).replace(/!(?=@|#)/g, '');
			nearbyStacks.forEach(({ entity }) => entity.remove());
		})
	})
}, 20);

world.afterEvents.entityDie.subscribe(evd => {
	const deadEntity = evd.deadEntity;
	if (!validMobs.some(v => v.typeId === deadEntity.typeId) || evd.damageSource.cause === 'selfDestruct' || evd.damageSource.cause === 'void') return;
	const amount = deadEntity.getDynamicProperty('stacker:stack_size') ?? 1;
	if (amount <= 1) return;
	const entityValues = validMobs.find(v => v.typeId === deadEntity.typeId);
	const entity = deadEntity.dimension.spawnEntity(deadEntity.typeId, { x: deadEntity.location.x, y: deadEntity.location.y - 0.25, z: deadEntity.location.z, });
	const rotation = deadEntity.getRotation();
	entity.setRotation(rotation);
	entity.setDynamicProperty('stacker:stack_size', amount - 1);
	entity.nameTag = nameTagConfig.replace(/(?<!!)#/g, (amount - 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')).replace(/(?<!!)@/g, entityValues?.displayName).replace(/!(?=@|#)/g, '');
});