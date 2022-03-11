# vindly - REST API for movie rental

---
## Stack
    - Node.js
    - Express.js
    - Mongodb
    
### Tests

    - Jest
    - Supertest

---

## Run 

### locally 

To run this API locally on your machine you will need 
- docker
- docker-compose >= 3.3
- npm
- node >= 16.13

To start API use `docker-compose up`, use `curl` to connect with api for example : `curl -X GET http://127.0.0.1:3000/api/genres`

To run tests `docker-compose run api npm test`

### deployment

API can be find also on heroku servers: https://vidapily.herokuapp.com 

---

## Future updates
    Add limit for not authenticated( without admin role) users for creating  max 10 sucess POST request per month

---

## How to use?

### Authorization
 set header 'x-auth-token' to generated token

### Genres

#### GET /api/genres
     Input: -
     Output: list of genres
#### POST /api/genres
    Input: { name: "Genre }
    Output: New created genre

    Autorization required!
#### GET /api/genres/:id
    Input: - 
    Output: genre with given id
#### PUT /api/genres/:id
    Input: { name: "Genre" }
    Output: updated genre

    Autorization required!
#### DELETE /api/genres/:id
    Input: -
    Output: deleted genre
    
    Authorization and authentication required!

### Movies

#### GET /api/movies
     Input: -
     Output: list of movies
#### POST /api/movies
    Input: { 
        title: "Movie",
        numberInStock: 2,
        dailyRentalRate: 1,
        genreId: 
    }
    Output: New created movie

    Autorization required!
#### GET /api/movies/:id
    Input: - 
    Output: movie with given id
#### PUT /api/movies/:id
    Input: {
        title: "Movie",
        numberInStock: 2,
        dailyRentalRate: 1,
        genreId:
    }
    Output: updated movie

    Autorization required!
#### DELETE /api/movies/:id
    Input: -
    Output: deleted movie
    
    Authorization and authentication required!

### Customers

#### GET /api/customers
     Input: -
     Output: list of customers
#### POST /api/customers
    Input: { 
       name: "John",
       phone: "123456789"
    }
    Output: New created customer

    Autorization required!
#### GET /api/customers/:id
    Input: - 
    Output: customer with given id
#### PUT /api/customers/:id
    Input: { 
       name: "John",
       phone: "123456789"
       isGold: true
    }
    Output: updated customer

    Autorization required!
#### DELETE /api/customers/:id
    Input: -
    Output: deleted customer
    
    Authorization and authentication required!
### Rentals

#### GET /api/rentals
     Input: -
     Output: list of rentals
#### POST /api/rentals
    Input: { 
        movieId
        customerId
    }
    Output: New created rental

    Authorization required!
#### GET /api/rental/:id
    Input: - 
    Output: rental with given id

###  Returns

#### POST /api/rentals
    Input: { 
        movieId
        customerId
    }
    Output: Returned rental

    Authorization required!

### Auth

#### POST /api/auth
    Input: {
        email: "test@test.com",
        password: "Test123!"
    }
    Output: Auth token

### Users

#### GET /api/users
    Input: -
    Output: list of registrated users
    
    Authorization and authentication required!
#### POST /api/users
    Input: {
        name: "Test",
        email: "test@test.com"
        password: "Test123!"
    }
    Output: name and email 
    
### GET /api/users/me
    Input: -
    Output: name and email
    
    Authorization required!
