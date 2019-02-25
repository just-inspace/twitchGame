// const { combineReducers, createStore } = require("redux");
// const { enemiesReducer } = require("./enemiesReducer");
// const { playersReducer } = require("./playersReducer");

// const rootReducer = combineReducers({
// 	enemiesReducer,
// 	playersReducer
// });
const { createStore } = require("redux");
const { gameReducer } = require("./gameReducer");

const store = createStore(gameReducer);
exports.store = store;
