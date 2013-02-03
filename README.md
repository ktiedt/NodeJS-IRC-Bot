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

*** Originally written by [Michael Owens](http://www.michaelowens.nl).
