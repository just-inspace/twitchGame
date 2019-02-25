const tmi = require("tmi.js"); // TWITCH BOT LIBRARY
const { opts } = require("./opts"); // CONFIG OPTIONS IN SEPARATE FILE
const { store } = require("./store");
const { classes } = require("./classes");

// Create a client
const client = new tmi.client(opts);

// Register event handlers (defined below)
client.on("chat", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch
client.connect();

function getPlayer(name) {
	const state = store.getState().PLAYERS;
	return (
		state && state.length && state.filter(player => player.name === name)
	);
}

// Message Handler
function onMessageHandler(target, context, msg, self) {
	if (self) return;

	const prepareMessage = msg.trim().split(" ");
	const command = prepareMessage[0];
	const value = prepareMessage[1];

	switch (command) {
		case "!newplayer":
			if (value) {
				classes[value.toUpperCase()]
					? store.dispatch({
							type: "ADD_PLAYER",
							name: context.username,
							class: value.toUpperCase()
					  })
					: client.say(
							target,
							"AVAILABLE CLASSES: fighter, mage, cleric, knight, thief, mystic"
					  );
			} else {
				client
					.say(target, "INVALID COMMAND: !newplayer <classname>")
					.catch(err => {
						console.log(err);
					});
			}
			break;
		case "!removeplayer":
			store.dispatch({ type: "REMOVE_PLAYER", name: context.username });
			break;
		case "!player":
			const result = getPlayer(context.username);

			client
				.say(
					target,
					result
						? `${result[0].name}: LVL ${
								result[0].level
						  } ${result[0].class.toUpperCase()} ${
								result[0].hp
						  } HITPOINTS / XP to LevelUp ${result[0].xpToLevel}`
						: `${
								context.username
						  } does not exist. Type !newplayer to create a character`
				)
				.catch(err => {
					console.log(err);
				});
			break;
		case "!addxp":
			value
				? store.dispatch({
						type: "ADD_XP",
						name: context.username,
						xp: 0 + value
				  })
				: client
						.say(target, "INVALID COMMAND: !addxp <value>")
						.catch(err => console.log(err));
			break;
		case "!help" || "!commands":
			client.say(
				target,
				"AVAILABLE COMMANDS: !newplayer <class>, !player, !removeplayer, !addxp <value>"
			);
			break;
		default:
			break;
	}
}

// Connect handler
function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}
