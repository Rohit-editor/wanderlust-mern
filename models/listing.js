const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default : "https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",        
        set:(v)=>
            v === "" ?
        "https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" : v


        
    },
    price:{
       type: Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    }

})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;