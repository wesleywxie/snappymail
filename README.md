<div align="center">
  <a href="https://github.com/the-djmaze/snappymail">
    <img src="https://snappymail.eu/static/img/logo-256x256-white.png">
  </a>
  <br>
  <h1>SnappyMail</h1>
  <br>
  <p>
    Simple, modern, lightweight &amp; fast web-based email client.
  </p>
  <p>
    The drastically upgraded &amp; secured fork of <a href="https://github.com/RainLoop/rainloop-webmail">RainLoop Webmail Community edition</a>.
  </p>
  <p>
    We thank the RainLoop Team for making a great PHP 5 product that was good in the past.
  </p>
  <p>
    Up to date system requirements, snappy performance, simple installation and upgrade, no database required
    - all these make SnappyMail a good choice.
  </p>
  <h2></h2>
  <br>
</div>

For more information about the product, check [snappymail.eu](https://snappymail.eu/).

Information about installing the product, check the [wiki page](https://github.com/the-djmaze/snappymail/wiki/Installation-instructions).

And don't forget to read the [RainLoop documentation](https://www.rainloop.net/docs/).

## License

**SnappyMail** is released under
**GNU AFFERO GENERAL PUBLIC LICENSE Version 3 (AGPL)**.
http://www.gnu.org/licenses/agpl-3.0.html

Copyright (c) 2020 - 2022 SnappyMail
Copyright (c) 2013 - 2021 RainLoop

## Modifications

This fork of RainLoop has the following changes:

* Privacy/GDPR friendly (no: Social, Gravatar, Facebook, Google, Twitter, DropBox, OwnCloud, X-Mailer)
* Admin uses password_hash/password_verify
* Auth failed attempts written to syslog
* Added Fail2ban instructions
* ES2018
* PHP 7.3+ required
* PHP mbstring extension required
* PHP replaced pclZip with PharData and ZipArchive
* Dark mode
* Added option to remove background/font colors from messages for real "dark mode"
* Removed BackwardCapability (class \RainLoop\Account)
* Removed ChangePassword (re-implemented as plugin)
* Removed POP3 support
* Removed background video support
* Removed Sentry (Application Monitoring and Error Tracking Software)
* Removed Spyc yaml
* Replaced gulp-uglify with gulp-terser
* CRLF => LF line endings
* Embed boot.js and boot.css into index.html
* Ongoing removal of old JavaScript code (things are native these days)
* Added modified [Squire](https://github.com/neilj/Squire) HTML editor as replacement for CKEditor
* Updated [Sabre/VObject](https://github.com/sabre-io/vobject)
* Split Admin specific JavaScript code from User code
* Split Sieve specific JavaScript code from User code
* JSON reviver
* Better memory garbage collection management
* Added serviceworker for Notifications
* Added advanced Sieve scripts editor
* Slimmed down language files
* Replaced webpack with rollup
* No user-agent detection (use device width)
* Added support to load plugins as .phar
* Replaced old Sabre library
* AddressBook Contacts support MySQL/MariaDB utf8mb4
* Added [Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/) checks
* Reduced excessive DOM size
* Support [Kolab groupware](https://kolab.org/)
* Support IMAP RFC 2971 ID extension
* Support IMAP RFC 5258 LIST-EXTENDED
* Support IMAP RFC 5464 METADATA
* Support IMAP RFC 5819 LIST-STATUS
* Support IMAP RFC 7628 SASL OAUTHBEARER aka XOAUTH2
* Support IMAP4rev2 RFC 9051
* Support Sodium and OpenSSL for encryption
* Much better PGP support


### Supported browsers

This fork uses downsized/simplified versions of scripts and has no support for Internet Explorer nor Edge Legacy.
Supported are:

* Chrome 69+
* Edge 79+
* Firefox 78+
* Opera 56+
* Safari 12+


### Removal of old JavaScript

The result is faster and smaller download code (good for mobile networks).

* Added dev/prototype.js for some additional features
* boot.js without webpack overhead
* Modified Jua.js to be without jQuery
* Replaced Autolinker with simple https/email detection
* Replaced ifvisible.js with simple drop-in replacement
* Replaced momentToNode with proper HTML5 `<time>`
* Replaced resize listeners with ResizeObserver
* Replaced bootstrap.js with native drop-in replacement
* Replaced dev/Common/ClientStorageDriver/* with Web Storage Objects polyfill
* Replaced *Ajax with *Fetch classes because we use the Fetch API, not jQuery.ajax
* Replaced [knockoutjs](https://github.com/knockout/knockout) 3.4 with a modified 3.5.1
* Replaced knockout-sortable with native HTML5 drag&drop
* Replaced simplestatemanager with CSS @media
* Replaced inputosaurus with own code
* Replaced keymaster with own shortcuts handler
* Removed pikaday
* Removed underscore
* Removed polyfills
* Removed Modernizr
* Removed nanoscroll
* Removed lightgallery
* Removed jQuery
* Removed jquery-ui
* Removed jquery-scrollstop
* Removed jquery-mousewheel
* Removed matchmedia-polyfill
* Removed momentjs (use Intl)
* Removed opentip (use CSS)
* Removed non-community (aka Prem/Premium/License) code
* Removed ProgressJS


RainLoop 1.15 vs SnappyMail

|js/*           	|RainLoop 	|Snappy   	|
|---------------	|--------:	|--------:	|
|admin.js        	|2.158.025	|   81.557	|
|app.js          	|4.215.733	|  404.535	|
|boot.js         	|  672.433	|    2.050	|
|libs.js         	|  647.679	|  197.160	|
|sieve.js         	|        0	|   86.148	|
|polyfills.js    	|  325.908	|        0	|
|serviceworker.js	|        0	|      285	|
|TOTAL           	|8.019.778	|  771.735	|

|js/min/*       	|RainLoop 	|Snappy   	|RL gzip	|SM gzip	|RL brotli	|SM brotli	|
|---------------	|--------:	|--------:	|------:	|------:	|--------:	|--------:	|
|admin.min.js    	|  255.514	|   40.796	| 73.899	| 13.531	| 60.674  	| 12.098	|
|app.min.js      	|  516.000	|  191.313	|140.430	| 62.085	|110.657  	| 53.347	|
|boot.min.js     	|   66.456	|    1.252	| 22.553	|    778	| 20.043  	|    628	|
|libs.min.js     	|  574.626	|   95.110	|177.280	| 35.149	|151.855  	| 31.461	|
|sieve.min.js     	|        0	|   42.037	|      0	| 10.516	|      0  	|  9.501	|
|polyfills.min.js	|   32.608	|        0	| 11.315	|      0	| 10.072  	|      0	|
|TOTAL user      	|1.189.690	|  287.675	|351.061	| 98.012	|292.627  	| 85.436	|
|TOTAL user+sieve	|1.189.690	|  329.712	|351.061	|108.528	|292.627  	| 94.937	|
|TOTAL admin     	|  929.204	|  137.158	|285.047	| 49.458	|242.644  	| 44.187	|

For a user its around 70% smaller and faster than traditional RainLoop.

### CSS changes

* Solve jQuery removed "features" with native css code
* Themes work in mobile mode
* Bugfix invalid/conflicting css rules
* Use flexbox
* Split app.css to have separate admin.css
* Remove oldschool 'float'
* Remove unused css
* Removed html.no-css
* Removed dev/Styles/Cmd.less
* Removed dev/Styles/Scroll.less
* Removed Internet Explorer from normalize.css
* Removed node_modules/opentip/css/opentip.css
* Removed node_modules/pikaday/css/pikaday.css
* Removed unused vendors/bootstrap/less/*
* Removed vendors/jquery-nanoscroller/nanoscroller.css
* Removed vendors/jquery-letterfx/jquery-letterfx.min.css
* Removed vendors/Progress.js/minified/progressjs.min.css
* Removed gulp-autoprefixer


|css/*       	|RainLoop	|Snappy   	|RL gzip	|SM gzip	|SM brotli	|
|------------	|-------:	|------:	|------:	|------:	|--------:	|
|app.css     	| 340.334	| 81.866	| 46.959	| 16.907	| 14.544	|
|app.min.css 	| 274.791	| 65.792	| 39.618	| 14.966	| 13.160	|
|boot.css    	|       	|  1.326	|       	|    664	|    545	|
|boot.min.css	|       	|  1.071	|       	|    590	|    474	|
|admin.css    	|       	| 29.863	|       	|  6.795	|  5.897	|
|admin.min.css	|       	| 24.001	|       	|  6.159	|  5.413	|

### PGP
RainLoop uses the old OpenPGP.js v2
SnappyMail v2.12 uses OpenPGP.js v5, GnuPG and Mailvelope.
SnappyMail is able to use and generate ECDSA and EDDSA keys, where RainLoop does not.

Since SnappyMail tries to achieve the best mobile experience, it forked OpenPGP.js to strip it down.
* remove all unused Node.js
* remove all old browsers support
See https://github.com/the-djmaze/openpgpjs for development

|OpenPGP        	|RainLoop 	|Snappy   	|RL gzip	|SM gzip	|RL brotli	|SM brotli	|
|---------------	|--------:	|--------:	|------:	|-------:	|--------:	|--------:	|
|openpgp.min.js 	|  330.742	|  539.244	|102.388	| 166.997	| 84.241  	|  137.184	|
|openpgp.worker 	|    1.499	|         	|    824	|        	|    695 	|        	|


### Squire vs CKEditor
The [Squire](https://github.com/neilj/Squire) implementation is not 100% compatible yet, but it shows the massive overhead of CKEditor.

Still TODO:

* support for tables (really needed?!?)
* support BIDI (really needed?!?)

|       	| normal	| min    	| gzip  	| min gzip	|
|--------	|-------:	|-------:	|------:	|--------:	|
|squire  	| 122.321	|  41.906	| 31.867	|   14.330	|
|ckeditor	|       ?	| 520.035	|      ?	|  155.916	|

CKEditor including the 7 asset requests (css,language,plugins,icons) is 633.46 KB / 180.47 KB (gzip).

To use the old CKEditor, you must install the plugin.
