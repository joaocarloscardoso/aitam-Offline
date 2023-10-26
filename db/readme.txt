Create a folder inside of aitam called ‘db’, initialize npm, install json-server, and create a new db.json file:
mkdir db
cd db
npm init -y
npm install json-server --save
type nul >> db.json

Add a new “json:server” script to package.json:
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"json:server": "json-server --watch ./db.json --port 5000"
},

json-server is a package that automatically sets up RESTful routes for data in the db.json file

Call on git "npm run json:server" from the /db folder
Test:http://localhost:5000/users?email=test@test.com