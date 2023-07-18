# Floating Text

This pack allows the user to create floating text around their realm.
The only experimental toggle needed for this pack is Beta APIs.
The default prefix for all commands is `!`, which can be changed in `scripts/index.js` as the `cmdPrefix` constant.
All examples in this file assume a default prefix of `!` being used.

The Resource Pack file IS REQUIRED, as it allows the text entity to be rendered correctly.

# Configuration
The constant `adminTag` is the staff tag that will allow any player with this tag to edit floating text names.

# Commands
- `!rename`: Renames the text entity the player is currently looking at. 
	Use \n in your command to set a new line on the entity's name.
	This command is only useable for players who have the adminTag config tag (this is `stafftag` by default)

# Setup
To use this pack:
1. Run `/summon floating:text` (and where you want it spawned, normal summon command stuff)
2. Run `!rename` to rename the text entity.


# Notes
To despawn a text entity, trigger the event `text:despawn` through the /event command (or other means)

If you have questions, please ask me!

Created by Herobrine643928

[GitHub](https://github.com/Herobrine643928)

[Discord](https://discord.com/users/330740982117302283)
