NodeJS IRC Bot
==============
This is a plugin-based IRC Bot written in NodeJS and maintained by [Karl Tiedt](http://twitter.com/ktiedt).

Prerequisites
=============
* NodeJS (tested under v0.8.17)

How to run
==========
Install all dependencies of the bot using 

    npm install

Modify your configuration in config/config.json and start your bot with the following command:

    node bot.js

Or create a new config file (e.g. test.json) in the config directory and start your bot with the 
following command:

    node bot.js --config=test    

The bot will now attempt to connect. Raise the logLevel (see config/config.json) to see incoming/outgoing packets.
We are using [winston](https://npmjs.org/package/winston) as a log framework, the log levels used right now are
error, info and verbose (following the npm log levels).  

How to create a new plugin
==========================

The bot has a base class (plugins/basePlugin.js) which defines some useful methods for plugins. It is not a requirement
to use this class as a base. If you are not using it, you should follow at least the method signature of the constructor
of all other plugins (basically: irc and name are the required parameters).

For a good example on how to develop your own plugin, please go ahead and take a look into the textfilter plugin.

We do like to get pull requests for additional plugins, and we prefer plugins with at least a basic mocha test (see 
folder tests for examples). This is really easy and allows us to make sure that your plugin is still working, even
if we change anything in the central irc module.

*** Originally written by [Michael Owens](http://www.michaelowens.nl).
