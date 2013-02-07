Version 0.0.9 (02/07/2013)
==========================
* ADDED:
  * add cradle dependency for couchdb plugins
  * added several new testcases for plugins
  * added inheritance for plugins (using basePlugin as the superclass)
* UPDATED:
  * trac plugin - remove dependency on couchdb_log plugin
  * all plugins to use inherited basePlugin

Version 0.0.8 (02/03/2013)
==========================
* ADDED:
  * add admin plugin (be cautious, this can change some of your settings)
  * added testcases for plugins
  * added .travis.yml file to the package
* UPDATED:
  * freenode plugin (be cautious, this can change some of your settings)
  * added pluginHelper to the plugins, instead of handing over the irc class directl

Version 0.0.7 (01/28/2013)
==========================
* ADDED:
  * add logging (winston)
* UPDATED:
  * moved classes to lib directory
  * minor bugfix in config 
  * remove freenode option (nickPass) in irc.js, please use already existing freenode plugin for this
  * added pluginConfigs option to config, to allow for individual settings for each plugin (see freenode
    plugin)

Version 0.0.6 (01/24/2013)
==========================
* ADDED:
  * configuration via json
  * delete specific bot.js files
     * you can now use node bot.js --conf=dojo to load dojoBot.js
     * default (config/config.json) now connects to channel #nodejsNodeBot to 
       not disturb normal #nodejs channel operations
  * add dependency to optimist
  * add dependency to pkgconfig
* UPDATED:
  * minor bugfix in textfilter
  * translate lastseen plugin
  * translation in the reload plugin
  * package.json for latest version
  * adopt README.md to reflect latest changes

01/22/2013 - Version 0.0.5
==========================
* ADDED:
  * package.json
* UPDATED:
  * translated textfilter plugin to english 

12/23/2011
==========
* ADDED:
*   couchdb_log plugin -- logs all events (except privmsg to the bot) to a couchdb instance
*   coucbdb_seen plugin -- utilizes the logs from couchdb_log to generate intelligent last seen reports
*        -- Also supports formatted responses
*   freenode plugin -- identifies the bot to nickserv once connected to the network
*   trac plugin -- interfaces with trac instance over RPC for #ticket data and via scraping for [changeset] data
*
* UPDATED:
*   irc.js/user.js/channel.js Fixed problem with user tracking in memory

12/20/2011
==========
* ADDED:
*   User/Channel tracking via global hashes irc.users and irc.channels
*   User object via user.js
*   Added irc.send(target, msg) command to elimiate .raw() calls to send messages to users and channels
*   onNumeric event for plugins - triggers on any numeric response such as /WHOIS response
*
* UPDATED:
*   Channel object to support tracking users
*   Existing modules for new User/Channel objects
*
* DEPRECATED:
*   onReply - replaced by onNumeric hook -- will remove sometime after the new year
*
*
* Reformatted all the files to match my typical coding style

05/03/2011
==========
* Created a temporary onReply listener
* Added a global plugin and moved joining the main channel to the plugin

04/03/2011
==========
* Added debug to configuration