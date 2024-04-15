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
