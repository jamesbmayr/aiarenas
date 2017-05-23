# ai_arenas
a battleground for javascript functions: https://www.aiarenas.com
<pre style='line-height: 1;'>
       _H_                     _!_                    _[+]_                    !!!      
 (--) /o o\              {--} (^ ^) {--}              (V V)              {!!} !x x!     
  ()  \ - /               {}  | = |  {}               |[-]|               ~~  ! O !     
   \--HELLO--\             \==/---\==/             /==/|||\==\             \~~CRASH~~\  
      HELLO  ()               LEARN               []  BUILD  []               CRASH  ~~ 
      HELLO (--)              \___/              [++] ]===[ [++]              CRASH {!!}
      [] []                   || ||                   [| |]                   !   !     
     /_] [_\                 /_) (_\                 {_] [_}                 [!] [!]    
</pre>

# overview
ai_arenas is a board game played by robots.
Each round, new colored "cubes" are generated, and robots must collect certain combinations, like 6 of 1 color, or 1 of all 6 colors, to win.
Robots can choose to "power" up or use that power to try to "take" cubes - and the robot with the most power will take them all. Robots can later unlock more advanced actions, like "shock"ing opponents or "sap"ing their power.

But how do robots decide what to do? Code!
Humans write javascript code that uses various inputs - the cube colors, opponent power levels, the active victory conditions, etc. - to output actions.
Every few rounds, the gameplay stops so humans can workshop their robots and refine the code based on opponent strategies.

The site comes with a number of tutorials that guide coding novices and Javascript experts alike through the most important features of the language - and the mechanics of the game - so they can build smart robots to take down the competition.
Robots, arenas, and tutorials are all available without even making an account - but sign up to get challenging arena modes, advanced tutorials, customizable robot avatars, and more.

# code
This project uses node.js and mongoDB on the back-end and jQuery on the front-end, with as few modules as possible (and no pre-built framework whatsoever).

For example, html is rendered using a custom EJS-like functionality that evaluates Javascript code between <% %> tags before sending it to the client. Similarly, routing is performed using a switch(true) and regex testing, rather than through Express or another framework.

User-provided code is evaluated server-side (in a node.js VM sandbox for security purposes) within arenas. For robot workshops and tutorials, the code is evaluated client-side and displayed as it runs to expose the logic; it's simpler to see it for yourself in this demo: http://rawgit.com/jamesbmayr/codemo/master/codeRunner/.

# file structure
<pre>
|- package.json
|- index.js
|- /node-modules/
|   |- mongo
|   |- nodemailer
|
|- /data/
|   |- db
|
|- processes.js (environment, render, assets, sendEmail, random, hash, isEmail, isNumLet, isReserved, colors, fonts, navbar, ascii_robot, ascii_character, session, store, retrieve, tour)
|
|- /assets/
|   |- stylesheet.css
|   |- script.js (animateText, navBar, sectionToggle, colorText, resizeTop, animateRobot, tour, splashScreen, eval_code)
|   |- images/
|   |   |- logo.html
|   |   |- black_logo.html
|   |   
|   |- tutorials/
|   |   |- takeBot.json
|   |   |- checkBot.json
|   |   |- primaryBot.json
|   |   |- secondaryBot.json
|   |   |- responsiveBot.json
|   |   |- deriveBot.json
|   |   |- randomBot.json
|   |   |- consoleBot.json
|   |   |- collectorBot.json
|   |   |- copyBot.json
|   |   |- focusBot.json
|   |   |- switchBot.json
|   |   |- predictorBot.json
|   |   |- scrapsBot.json
|   |   |- victoryBot.json
|   |
|   |- asciiBots/
|       |- buildBot.html
|       |- crashBot.html
|       |- emailBot.html
|       |- errorBot.html
|       |- helloBot.html
|       |- learnBot.html
|       |- noscriptBot.html
|       |- opponentBot.html
|
|- / (home)
|   |- logic.js (signin, signup, signout, verify, sendReset, verifyReset)
|   |- main.html
|   |- individual.html
|   |- stylesheet.css
|   |- script.js
|
|- /humans/
|   |- logic.js (create, update, destroy)
|   |- individual.html
|   |- stylesheet.css
|   |- script.js
|
|- /robots/
|   |- logic.js (create, update, destroy, load, upload)
|   |- main.html
|   |- individual.html
|   |- stylesheet.css
|   |- script.js
|
|- /arenas/
|   |- logic.js (create, joinin, random, leave, launch, selectRobot, adjustRobot, read, update, destroy)
|   |- main.html
|   |- individual.html
|   |- stylesheet.css
|   |- script.js
|
|- /settings/
|   |- logic.js (update, updateName, updatePassword, sendVerification, destroy)
|   |- main.html
|   |- stylesheet.css
|   |- script.js
|
|- /tutorials/
    |- logic.js (complete, tour)
    |- main.html
    |- individual.html
    |- stylesheet.css
    |- script.js
</pre>
