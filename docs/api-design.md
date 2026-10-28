# API Design

## Authentication APIs

## Register

POST/api/auth/register
purpose : creates a new customer
Access : Customer

Request body {
    "fullName": "",
    "email": "",
    "phone": "",
    "password": ""
} 

Response : 201 Created

## Login

POST/api/auth/login
purpose : authentictes a registered user.
Access : Customer

request body {
    "email": "",
    "password": "",
}
Response : 200 OK

## Logout 
POST/api/auth/logout
purpose : Logs out the current user.
request body : none
Access : Customer
Response : 200 OK

## Product APIs

GET/api/products
purpose : Return all products
Access : Customer
request body - none
Response : 200 OK

GET/api/products/:id
purpose : Return one product
Access : Customer
request body - none
Response : 200 OK

POST/api/products
purpose : Create products 
Access : Admin only
request body {
    name : "",
    description : "",
    price : "",
    category : "",
    stock : "",
}
Response : 201 created

PUT/api/products/:id 
purpose : Edit a product
Access : Admin only
request body {
   
    name : "",
    description : "",
    price : "",
    category : "",
    stock : "",
}
Response : 200 OK

DELETE/api/products/:id 
purpose : Delete a product
Access : Admin only
request body : none
Response : 200 OK

## Category APIs

GET/api/categories
purpose : Return all categories
Access : Customer 
request body : none
Response : 200 OK

POST/api/categories
purpose : Create a new category
Access : Admin only
request body {
    categoryName : "",
    description : "",
    parent-category : ""
    
}
Response : 200 OK


PUT/api/categories/:id
purpose : Edit a category
Access : Admin only
request body {
    
    name : "",
    description : "",
    parent-category : ""
    
}
Response : 200 OK

DELETE/api/categories/:id
purpose : Delete a category
Access : Admin only
request body : none;
Response : 200 OK

## Cart

GET/api/cart
purpose : Return all cart items
Access : Customer
request body : none
Response : 200 OK

POST/api/cart
purpose : Add a product to cart 
Access : Customer
request body {
    productId ="",
    quantity ="",
    selectedSize =""
}
Response : 200 OK

PUT/api/cart/items/:productId
purpose : Update a cart item
Access : Customer
request body {
    cartItemId = "",
    quanity = "",
    selectedSize =""
}
Response : 200 OK

DELETE/api/cart/items/:productId
purpose : Delete a cart item
Access : Customer
request body : none
Response : 200 OK

DELETE/api/cart
purpose : Clear cart
Access : Customer
request body : none
Response : 200 OK

## Wishlist

GET/api/wishlist
purpose : Return all wishlist items
Access : Customer
request body: none
Response : 200 OK

POST/api/wishlist
purpose : Add a product to wishlist
Access : Customer
request body {
    productId : ""
}
Response : 200 OK

DELETE/api/wishlist/items/:productId
purpose : Delete a wishlist item
Access : Customer
request body : none
Response : 200 OK

## Orders

POST/api/orders
purpose : Placing an order
Access : Customer
request body {
    orderId : "",
    cartId : "",
    products : [],
    address : {

    },
    payment-method : "",
    createdAt : "",
    status : ""
    
}
Response : 200 OK

GET/api/orders
purpose : viewing the orders
Access : Customer
Response : 200 OK

GET/api/orders/:id
purpose : viewing an order
Access : Customer
Response : 200 OK

PUT/api/orders/:id
purpose : Updating an order
Access : Customer
request body {
    
    address: {""}

}
Response : 200 OK

## Reviews
POST/api/products/:id/reviews
pupose: writes a review
Access : Customer
request body {
    
    productId : "",
    rating : "",
    title: "",
    comment: "",
    

}
Response : 200 OK

GET/api/products/:id/reviews
purpose : return all reviews
Access : Customer
Response : 200 OK

DELETE/api/reviews/:id
purpose : deleting a review
Access : Customer
Response : 200 OK




















