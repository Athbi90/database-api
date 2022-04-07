# database-api

### Simple database and API to manage an E-commerce shop.

#### This App have the below features:

- Sign up/in as a user.
- Add Products and Stock where each Product have one or more stocks.
- Stocks provide the ability to control different options for the same product.
- Create/Update/Cancel order.

---

### This app is created using the following:

- ExpressJS
- Sequelize
- PostgreSQL

---

### To run the app:

- Clone the repository.
- Get into the repository directory and run the command `npm install`.
- Get into the "./db" directory and run the the command `npx sequelize-cli init`.
- Create a .env file which contains:

  - DB_USERNAME (username of the database)
  - DB_PASSWORD (if needed)
  - DB_NAME (database's name)
  - DB_HOST (127.0.0.1 for localhost)
  - PORT (default value is 8000)
  - JWT_SECRET (secret key for encyption and authentication)
  - JWT_EXPIRATION_MS (the user's session in milliseconds)

- Run the command `yarn/npm start` to start the app.

---

### The app used the following libraries/packages:

- [Umzug](https://github.com/sequelize/umzug) to run and manage migrations.
- [Sequlize](https://sequelize.org/) to manage the database.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) to hash password.
- [Passport](http://www.passportjs.org/) to authenticate the users.
- [Multer](https://github.com/expressjs/multer#readme) to upload files.

---

### author(s):

- [Athbi Hameidawi](https://github.com/Athbi90)
