# Health Check Test
GET http://localhost:8080

HTTP/1.1 200
Cache-Control: no-store

[Asserts]
jsonpath "$.status" == "ok"
