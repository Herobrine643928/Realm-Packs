# Mob Stacker

This pack allows mobs to stack with other mobs of the same type using script API.
The only experimental toggle needed for this pack is Beta APIs.

# Configuration

To add mobs to the stacker: 
Add in 
```js
	{
		typeId: 'namespace:mob',
		displayName: 'Name'
	},
```
to the end of the `validMobs` constant.

You also need to edit the mobs to add a despawn event to them.
In the `"events"` section of the mob .json (usually found near the bottom), and add in 
```json
"minecraft:despawn": {
	"add": {
		"component_groups": [
			"minecraft:despawn"
		]
	}
},
```
making sure it is valid json. Next, go to the `"component_groups"` section of the mob .json (usually found near the top), and add in
```json
"minecraft:despawn": {
	"minecraft:instant_despawn": {}
},
```
all while making sure the editor doesn't yell at you.

`displayName` is what will show up in the mob's stack.
`typeId` is the ID of the mob you wish to stack. You can find these from /summon, but remember to add `minecraft:` where `namespace:` is, if using a vanilla mob.
The four base mobs are given as examples in the pack. 
This supports custom mobs, too!

`maxStackSize`: This number is the max stack size mobs will stack to before making a new stack.

`nameTagConfig`: This is the nametag of the entity when they form a stack.
Some things to note:

- The symbol `#` will display the number of mobs in the stack whenever it is put into the name.
- The symbol `@` will display the corresponding displayName of the mob whenever it is put into the name.
If you want to use either of these two symbols without displaying the number or name, simply put a `!` before the symbol.

If you have questions, please ask me!

Created by Herobrine643928

[GitHub](https://github.com/Herobrine643928)

[Discord](https://discord.com/users/330740982117302283)
