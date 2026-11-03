import express from 'express'

import { calculateTotal } from './cart.js'

const app = express()

app.use(express.json()) // data toh get hogya


app.post("/get-post", (req,res)=>{
    console.log(req.body)  // post kr rha hu woh get hi nhi kr rha 
    const total = calculateTotal(req.body)

    res.json({total})
})


app.listen(3000, ()=>{
    console.log(`Listening on Port :3000`)
})