#Clover Status Monitor Server

To run, create `config.js` in the root directory based on `config.test.js`. Then, simply `node index.js`.

Assumes mongodb is running on localhost.

`config/{production, development}.env` contains the necessary environment variables to perform a password reset, though password reset routes/actions aren't set up yet.
   
