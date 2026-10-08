const url = require("url")

const address = "https://mysite.com:8080/products/shoes?category=running&size=10#details";

// 1. new URL
const myURL = new URL(address)

console.log("Host : ", myURL.host)
console.log("Hostname : ", myURL.hostname)
console.log("Port : ", myURL.port)
console.log("Path Name : ", myURL.pathname)
console.log("Search Query  : ", myURL.search)
console.log("Hash :", myURL.hash)

// read query parameter

console.log("Category : ", myURL.searchParams.get("category"))
console.log("Size : ", myURL.searchParams.get("size"))


myURL.searchParams.append("color","blue")
console.log("Updated URL :", myURL.toString())