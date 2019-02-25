exports.gameReducer = (state = { PLAYERS: [], ENEMIES: [] }, action) => {
	// {[players], [enemies], combat(player, enemy)}
	switch (action.type) {
		case "ADD_PLAYER":
			return {
				...state,
				PLAYERS: [
					...state["PLAYERS"],
					{
						name: action.name,
						hp: 100,
						class: action.class,
						level: 1,
						xpToLevel: 10
					}
				]
			};
		case "REMOVE_PLAYER":
			return {
				...state,
				PLAYERS: state["PLAYERS"].filter(
					player => !player.name === action.name
				)
			};
		case "ADD_XP":
			return state.map(item => {
				if (item.name !== action.name) {
					return item;
				}
				item.xpToLevel -= action.xp;
				if (item.xpToLevel <= 0) {
					item.level++;
					item.hp = 100 * item.level;
					item.xpToLevel = 10 * item.level;
				}
				return { ...item };
			});
	}
	return state;
};
