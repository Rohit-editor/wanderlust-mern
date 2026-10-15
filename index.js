const express = require("express");//require the express package 
const app = express(); // make the app so use to make different routes
const mongoose = require("mongoose"); // 
const Listing = require("./models/listing.js")// this is model for making new instances so require from other file
const path = require("path");//path requiring bcoz path require is important 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const listingSchema = require("./schema.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(res => console.log("connected to databases"))
    .catch(err => console.log(err));


async function main() {
    await mongoose.connect(URL);
}

app.listen(8080, () => {
    console.log("server is listening on this port 8080");
})

//ROOT ROUTE
app.get("/", (req, res) => {
    res.send("this is root page ");
})

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);   // check the data
    if (error) {                                         // something is wrong
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);             // stop, go to error page
    } else {                                             // data is fine
        next();                                          // go to the next function
    }
};
//INDEX ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

//CREATE NEW LISTING (FORM)
app.get("/listings/new", (req, res) => {
    res.render("listings/newListForm.ejs")  //always which route is not dynamic should up of dynamic route like (/listings/:id)
})

//SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const singleListing = await Listing.findById(id);
    res.render("listings/show.ejs", { singleListing });
}));

//CREATE NEW LISTING(SAVE)
app.post("/listings" ,validateListing, wrapAsync(async (req, res, next) => {
        

        const newListing = new Listing(req.body.listing);
        await newListing.save()
        res.redirect("/listings") //this is url path thats why slash comes but when render the form dont need to use slash
    })
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",validateListing,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}))
app.use((req,res,next) => {
    next(new ExpressError(404,"page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    
})

// app.get("/user",async (req,res)=>{
//     let user1 = new Listing({
//         title: "My new planet",
//         description: "new home for humans",
//         price:100000,
//         location: "neppune",
//         country: "no defined"
//     });
//     await user1.save();
//     console.log("saved successfully");
//     res.send("check console window");
// })