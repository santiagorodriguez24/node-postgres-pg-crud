const getFieldsAndValues = (id, data, onlyTruthy) => {

    let keys = onlyTruthy ? Object.keys(data).filter(key => data[key]) : Object.keys(data);

    let fields = keys.map(function (field, index) {
        return field + ' = $' + (index + 2);
    }).join(', ');

    let values = [id].concat(keys.map(key => data[key]));

    return {
        fields,
        values
    };
}

module.exports = {
    getFieldsAndValues
};