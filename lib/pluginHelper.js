/**
* Plugin Helper Class
*
* @author      Markus M. May
* @website     http://www.javafreedom.org
* @copyright   Markus M. May 2013
*/

PluginHelper = exports.PluginHelper = function(irc, name) {
    this.irc = irc;
    this.name = name;
};

PluginHelper.prototype.getPluginProperty = function(propertyName) {
    this.irc.logger.verbose("fetching propertyName: " + propertyName + " for plugin: " + this.name);

    if (this.irc.config.pluginConfigs !== 'undefined') {
        var pluginConfigs = this.irc.config.pluginConfigs;
        if (pluginConfigs[this.name] !== 'undefined') {
            var pluginConfig = pluginConfigs[this.name];
            if (pluginConfig[propertyName] !== 'undefined') {
                return pluginConfig[propertyName];
            }
        } 
    } 

    return 'undefined';
};

PluginHelper.prototype.parseTriggerMessage = function(msg) {
    var m = msg.arguments[1], // message 
        params = m.split(' '),
        result = {};

    // first parameter is always the trigger (e.g. !admin)
    params.shift();    

    if (typeof params[0] == 'undefined') {
        throw new PluginException("No command given");
    } else {
        var command = params[0].toLowerCase();
        var options = params.slice(1);

        result = {
            'command': command,
            'options': options
        }
    }

    return result;
};