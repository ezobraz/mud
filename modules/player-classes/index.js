const { Color, Broadcaster } = __require('core/tools');
const Dictionary = __require('core/dictionary');
const Config = __require('core/config');
const Event = __require('core/event');
const classes = require('./classes');

const askToSelectClass = player => {
    let res = [];

    for (let i in classes) {
        res.push(...[
            Color.parse(`[b][cR]${i}[/]`),
            `${classes[i].desc}`,
            '',
        ]);
    }

    Broadcaster.sendTo({
        to: player,
        text: res.join('\n\r'),
    });

    Broadcaster.promt({
        to: player,
        text: `Your choice: `,
    });
};

module.exports = {
    init() {
        Event.on('PLAYER_SIGNED_UP', player => {
            player.canUseCommands = false;
            askToSelectClass(player);
        });

        Event.on('PLAYER_SIGNED_IN', player => {
            if (player.meta.class) {
                return;
            }

            player.canUseCommands = false;
            askToSelectClass(player);
        });

        Event.on('PLAYER_MESSAGE', async ({ player, message }) => {
            if (player.meta.class) {
                return;
            }

            const playerClass = classes[message];

            if (!playerClass) {
                return;
            }

            player.meta.class = message;

            for (let collection in playerClass.stats) {
                const pack = playerClass.stats[collection];

                for (let type in pack) {
                    const params = pack[type];
                    const cls = Dictionary.get(collection, type);

                    if (typeof cls != 'undefined') {
                        player[collection].push(new cls(params));
                    }
                }
            }

            if (!player.locationId) {
                player.locationId = await Config.getRuntime('startLocationId');
            }

            player.save();
            player.canUseCommands = true;

            Broadcaster.promt({
                to: player,
                text: `Great choice!`,
            });
        });
    },
};
