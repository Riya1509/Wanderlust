const express = require("express");
const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const { appendFile } = require("fs");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB");
})
.catch((err) => {
  console.log(err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
    
}

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi I am root");
});

// index route
app.get("/listings", async (req, res) => {
  const allListings= await Listing.find({});
  res.render("listings/index.ejs", {allListings});

});

// New route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  

//Show route

app.get("/listings/:id", async(req, res) => {
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// //Create route
app.post("/listings",async (req, res) =>{
 
    const newListing = new Listing(req.body.listing);

    // Save the new listing
    await newListing.save();

    // Redirect to the listings page upon successful creation
    res.redirect("/listings");


});

// edit route

app.get("/listings/:id/edit", async(req, res) =>{
  let {id} =req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", {listing});
});

// update route 

app.put("/listings/:id" , async(req, res) => {
  let {id} =req.params;
await Listing.findByIdAndUpdate(id, {...req.body.listing});
res.redirect(`/listings/${id}`);
  
});

// Delete route

app.delete("/listings/:id" , async(req, res) => {
  let {id} =req.params;
 let deletedListing = await  Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 res.redirect("/listings");  
});





// app.get("/testListing" , async(req,res) => {
//    let sampleListing = new Listing ({
//       title: "My new villa",
//       description: "By the Beach",
//       price : 1200,
//       location : "Calagunt , Goa",
//       country : "India",
//    });
   
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("Successfull testing");
   
// });
 

app.listen(8080, () => {
   console.log("Server is listening to port 8080");
});