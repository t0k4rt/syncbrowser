# SyncBrowser

Syncbrowser is a quick and dirty piece of code that enables to browse simultaneously the same website on different browser (mobile, tablet, desktop).

## compatibility ...

Recent browsers only, for the time being it has been tested with last versions of chrome, firefox, safari ios 7, android 4.3
It requires websocket.



## Quick start

Three quick start options are available:

- [Download the latest release](https://github.com/twbs/bootstrap/archive/v3.0.3.zip).
- Clone the repo: `git clone https://github.com/twbs/bootstrap.git`.

start server :
- npm install
- node app.js


on your frontend :

    <script src="http://your-node-server-adress/socket.io/socket.io.js"></script>
    <script src="http://your-node-server-adress/syncbrowser.min.js"></script>
    <script>
        Syncbrowser.sync('http://your-node-server-adress', 'namespace');
    </script>

Use a namespace if you sync multiple website on the same server.

## Versioning
rency into our release cycle and in striving to maintain backward compatibility, SyncBrowser is maintained under the Semantic Versioning guidelines. Sometimes we screw up, but we'll adhere to these rules whenever possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

- Breaking backward compatibility **bumps the major** while resetting minor and patch
- New additions without breaking backward compatibility **bumps the minor** while resetting the patch
- Bug fixes and misc changes **bumps only the patch**

For more information on SemVer, please visit <http://semver.org/>.



## Authors

**Alexandre Assouad**

- <http://twitter.com/aassouad>
- <http://github.com/t0k4rt>

## Copyright and license

Copyright 2013 Alexandre Assouad, Inc under [the MIT license](LICENSE).
