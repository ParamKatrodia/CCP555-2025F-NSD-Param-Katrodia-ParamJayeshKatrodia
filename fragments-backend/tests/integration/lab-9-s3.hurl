# Simple authenticated GET test for lab 9
GET http://localhost:8080/health
Authorization: Basic {{auth}}

HTTP/1.1 200
