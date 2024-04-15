# tic-tac-toe

## https://tic-tac-toe-theta-plum.vercel.app/

### Technologies Used

* React (FE framework)
* Node.js (BE)
* Postgresql (DB)
* MUI (FE UI framework)
* GetStream.io (API using WebSockets)
* Vercel (FE hosting)
* Render (BE and PGSQL DB hosting)

### Areas for improvement

There were plenty of areas where I would improve if I had more time.

* Better error handling
* Writing comprehensive test suites (I tested by hand, but I'm sure there are bugs that I missed)
* Fixing root cause of bug that is causing win counts to increment in DB in increments of 2 instead of 1
  (currently fixed with a very minor hack on the UI layer)
* More abstraction (I think there's definitely improvements to be made relating to breaking out some components into smaller chunks and I'm sure there are areas that could be more DRY)

### Feature ideas
* A way of searching for an opponent by username or first/last name (perhaps a debounced dropdown on the Join Game search displaying suggested names as the user types)
* A button to quickly start a rematch with the same opponent
* Better design around "log out" functionality (currently you have to click on the username in the upper right hand corner and I don't think that's as intuitive as it could be)
* A turn indicator informing the user when they should play
* A running chat with your opponent (this is actually a feature of the GetStream library that I wish I had the time to implement)
