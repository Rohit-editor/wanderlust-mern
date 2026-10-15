const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(res => console.log("connected to databases"))
.catch(err => console.log(err));


async function main(){
    await mongoose.connect(URL);
}

async function initDb (){
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data); //initdata is {data:sampleListings} but initdata.data is sampleListings
    console.log("successfull");
}

initDb();