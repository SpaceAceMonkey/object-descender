/**
 * A simple solution for descending into an object to retrieve
 * a value from a given location.
 * 
 * @example
 * const Od = require('object-descender');
 * // Create descender with an existing object
 * const od = new Od({"a": "A's value", "b": {"b2": "B2's value", "child": {"key": "B2's child's key's value"}}});
 * // Retrieve the value of "a"
 * od.get('a'); // "A's value"
 * // Retrieve the value of "b2". Periods are used to indicate
 * // descent into the object, so b2 is at b.b2
 * od.get('b.b2'); // "B2's value"
 * // "d" doesn't exist, but we tell the object_descender to give
 * // us the default value of 2 when the key does not exist.
 * od.get("d", 2); // 2
 * // It doesn't matter what the value of a key is. Here, we return
 * // the entire object stored inside "b"
 * od.get('b'); // {"b2": "B2's value", "child": {"key": "B2's child's key's value"}}
 * // Go several levels deep
 * od.get('b.child.key'); // "B2's child's key's value"
 * // Attempt to retrieve a non-existent key without specifying a
 * // default return value
 * od.get('no_such_key'); // Throws Error()
 * 
 * @example
 * // Load a .yaml file, rather than providing an object
 * const od = new Od('my_file.yaml');
 * 
 * @namespace object_descender
 * @constructor
 * @param {string|object} object_or_filename 
 */
module.exports = function object_descender(object_or_filename) {
    /**
     * @type {object}
     * @description Holds the object which we will search for keys
     *  using the get() method.
     * @memberof object_descender
     */
    this.data_object = {};

    if (
        Object.prototype.toString.call(
            object_or_filename
        ) === '[object Object]'
    ) {
        this.data_object = object_or_filename;
    } else if (typeof object_or_filename === 'string') {
        const yaml = require('js-yaml');
        const fs = require('fs');
        this.data_object = yaml.safeLoad(
            fs.readFileSync(object_or_filename),
            'utf8'
        );
    } else {
        throw new Error(
            "Object descender expects a filename or a Javascript object as its only argument."
        );
    }

    /**
     * Returns the value of the given key, if found. Otherwise, returns
     * the value specified by default_value, or an instance of Error
     * if no default value is specified.
     * 
     * @param {string} key A string consisting of a dot-separated path to
     *  the desired value.
     * @example
     * const od = new(require('object_descender'));
     * od.get('first_key.second_key.third_key.desired_key');
     * 
     * @param {*} default_value The value to return if the specified
     *  key is not found.
     * @memberof object_descender
     */
    this.get = function (key, default_value) {
        let key_value = (
            default_value === undefined ?
            new Error('Key \'' + key + '\' not found.') :
            default_value
        );

        if (key && this.data_object) {
            let path = key.split('.');
            let config_position = this.data_object;
            let found;
            while ((path_piece = path.shift(path))) {
                found = false;
                if (!config_position.hasOwnProperty(path_piece)) {
                    break;
                }

                config_position = config_position[path_piece];
                found = true;
            }
            if (path.length === 0 && found === true) {
                key_value = config_position;
            }
        }

        return key_value;
    };
};