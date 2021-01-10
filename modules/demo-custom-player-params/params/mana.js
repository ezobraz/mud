const Base = require('../../../core/entities/params/base');

module.exports = class Mana extends Base {
    max(player) {
        // todo
        return 100;
    }

    get bgColor() {
        return 'bb';
    }

    get textColor() {
        return 'cS';
    }

    get shortName() {
        return 'MP';
    }
};
