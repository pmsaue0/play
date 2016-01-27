Loop
====
A Google Play Music desktop player built with [Electron](http://electron.atom.io).

![Loop](https://raw.githubusercontent.com/twostairs/loop/master/loop-screenshot.png)

## What?

Loop is [Google's Play Music](https://play.google.com/music/listen) service, electronized into a native application for Mac OS X (and probably Windows and Linux, although I haven't tested it).

## Why?

Like a lot of people on the Mac OS X platform, I'm primarily using Safari for browsing the internet. And also just like many other people, I uninstalled Adobe Flash, since it basically is one of the roots of all evil on this planet.

However, Google's Play Music service unfortunately can not run without Adobe Flash in any other browser but Chrome. Apparently, Chrome provides some built-in extension ("Widevine Content Decryption Module", maybe?) which allows playing the DRM-secured music stream – even without Flash installed (and built-in flash in [chrome://plugins](chrome://plugins) disabled). And this is, where Electron with it's built-in Chromium with [recently enabled CDM](https://github.com/atom/electron/issues/2085) seems to comes in handy.

## How?

By wrapping the Play Music service into an Electron package, it appears to be possible (at least under Mac OS X) to enjoy audio streaming without actually having Adobe Flash installed.

Loop basically loads the URL `https://play.google.com/music/listen`, which will lead to a Google login page initially. This is a one-time procedure to set up the user session, you just need to check the "Remember me" checkmark. Don't worry, your login data is safe; Loop is not reading any sensitive data - but don't take my word for it, check the code yourself. :-)

After logging in, the Google's web player will be ready for you to start streaming. Oh and by the way:

Another benefit of Loop is, that it integrates quite well into your desktop. With Loop, you can use the multimedia keys on your keyboard to play, pause, skip or re-play the previous song.

## Where?

You can either download the files from the [releases](https://github.com/twostairs/loop/releases) site and run a pre-compiled version of Loop, or you can clone this repository and build the app by yourself, simply by following the instructions in [Jakub Szwacz' electron-boilerplate](https://github.com/szwacz/electron-boilerplate) (awesome work, man!).

## Who?

[Me](https://twitter.com/mrusme) the code, [she](https://twitter.com/doriiimaus) the logo.
