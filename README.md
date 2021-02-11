# Introduction

This is a code challenge project based on the [specifications below](#code-challenge-specifications).

In order to run the project, first install the depenencies
```
yarn install
```

After that, create a .env file in the root of the project with the following keys
```
JWT_SECRET_KEY=
MONGO_CONNECTION_STRING=
```

That's it. After that you can run the program according to the scripts contained in the package.json file.

The final API documentation is [here](https://documenter.getpostman.com/view/8084147/TW77hjCp).


# Code challenge specifications
# 🏗 What to do?

- You must fork this repository and, at the end, send your repository link to our team. Remember, it is NOT necessary to create a Pull Request for this, we will evaluate and return the result of your test by email.
- The deadline is 3 days

# 🚨 Requirements

- The API must be built in ** NodeJS ** or ** Rails **
- It must implement authentication and must follow the ** JWT ** standard, remembering that the token to be received must be in ** Bearer ** format
- If developed in NodeJS, your project will have to be implemented in ** ExpressJS ** or ** SailsJS **
- To communicate with the database, use some ** ORM ** / ** ODM **
- Relational banks allowed:
  - MySQL
  - MariaDB
  - Postgre
- Non-relational banks allowed:
  - MongoDB
- Your API should follow Rest standards in the construction of routes and returns
- Your API should contain the collection / variables of the postman or some openapi documentation endpoint to perform the test
- It is desirable that the test is in the language ** JavaScript ** seeking to evaluate the complete understanding of the language and not of structures or dependencies that abstract certain definitions not alien to ECMAScript. However, tests performed on ** TypeScript ** will also be accepted.

# 🕵🏻‍♂️ Items to be evaluated

- Project Structure
- API security, such as authentication, passwords saved in the database, SQL Injection and others
- Good Language/Framework practices
- Your project should follow everything that was required in the [What to develop?](#-what-to-develop) section
- Migrations for creating relational database tables

# 🎁 Extra

These items are not mandatory, but desired.

- Unity tests
- Linter
- Code Formater

** Note: Remember that the use of any linter or code formater will depend on the language that your API is created **

# 🖥 What to develop?

You must create an API that the website [IMDb](https://www.imdb.com/) will refer to to display its content, your API must contain the following features:

- Admin

  - Creation
  - Edition
  - Logical exclusion (Deactivation)

- User

  - Creation
  - Edition
  - Logical exclusion (Deactivation)

- Movies

  - Registration (Only an administrator user can perform this registration)
  - Vote (The vote will be counted per user from 0-4 indicating how much the user liked the movie)
  - Listing (must have filter by director, name, genre and / or actors)
  - Detail of the film bringing all information about the film, including the average vote

** Note: Only regular users will be able to vote on the movies and the API must validate the user's permission, that is, whether it is admin or not **

# 🔗 Links

- JWT Documentation https://jwt.io/
- NodeJS Frameworks:

  1. https://expressjs.com/pt-br/
  2. https://sailsjs.com/

- Guideline rails http://guides.rubyonrails.org/index.html
