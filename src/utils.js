module.exports = {
    makeSortCriteria(sortBy, order) {
        if (sortBy.length) {
            return sortBy
                .split(',')
                .map((key) => key.trim())
                .reduce((result, key) => {
                    result[key] = order;
                    return result;
                }, {});
        }
    },
    mapPayloadToUpdateObject(payload, relationKey) {
        return Object.keys(payload)
            .reduce((result, payloadKey) => {
                result[`${relationKey}.$.${payloadKey}`] = payload[payloadKey];
                return result;
            }, {});
    }
};
