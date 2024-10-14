const express = require("express")
const app = express()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const {initializeDatabse}= require('./db/db.connect')
const Hotel = require("./models/hotels.models")

app.use(express.json())

initializeDatabse();

async function createHotel(newHotel) {
  try{
    const hotel = new Hotel(newHotel)
    const saveHotel =await hotel.save()
    return saveHotel
  }catch(error){
    throw error
  }
}

app.post("/hotels", async (req,res)=>{
  try{
    const savedHotel = await createHotel(req.body)
    res.status(201).json({message: "Hotel added successfully.", hotel: savedHotel})
  }catch(error){
    res.status(500).json({error: "Failed to add hotel."})
  }
})

//q1 read all hotels

async function findAllHotels(){
  try{
    const hotel = await Hotel.find()
    return hotel
  }catch(error){
    throw error
  }
}

app.get("/hotels", async(req,res)=>{
  try{
    const hotels = await findAllHotels()
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to feach hotel data."})
    }
})

//q2 read hotel with name

async function findByName(hotelName){
  try{
    const hotel = await Hotel.findOne({name: hotelName})
    return hotel
  }catch(error){
    throw error
  }
}

app.get("/hotels/:hotelName", async(req,res)=>{
  try{
    const hotels = await findByName(req.params.hotelName)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch{
    res.status(500).json({error: "Failed to feach hotel data."})
  }
})

//q3 find hotel by phoneNumber 
 
async function findHotelByPhoneNumber(phoneNumber){
  try{
    const hotel = await Hotel.findOne({phoneNumber: phoneNumber})
    return hotel
  }catch(error){
    throw error
  }
}

app.get("/hotels/directory/:phoneNumber", async (req,res)=>{
  try{
    const hotels = await findHotelByPhoneNumber(req.params.phoneNumber)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch{
    res.status(500).json({error: "Failed to feach hotel data."})  
  }
})

//q4 find hotel by rating

async function findHotelByRating(rating){
  try{
    const hotel = await Hotel.findOne({rating : rating})
    return hotel
  }catch(error){
    throw error
  }
}

app.get("/hotels/rating/:hotelRating", async (req,res)=>{
  try{
    const hotels = await findHotelByRating(req.params.hotelRating)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch{
    res.status(500).json({error: "Failed to feach hotel data."})  
  }
})

//q5 find hotel by category 

async function findHotelWithCategory(category){
  try{
    const hotel = await Hotel.findOne({category : category})
    return hotel
  }catch(error){
    throw error
  }
}

app.get("/hotels/category/:hotelCategory", async (req,res)=>{
  try{
    const hotels = await findHotelWithCategory(req.params.hotelCategory)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch{
    res.status(500).json({error: "Failed to feach hotel data."})  
  }
})

async function deleteHotel(hotelId){
  try{
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel
  }catch(error){
    throw error
  }
}

app.delete("/hotels/:hotelId", async (req,res)=>{
  try{
    const deletedHotel = await deleteHotel(req.params.hotelId)
    if(deletedHotel){
      res.status(200).json({message: "Hotel deleted successfully."})
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to delete hotel."})
  }
})

async function updateHotel(hotelId, hotelToUpdate) {
  try{
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, hotelToUpdate, {new : true})
    return updatedHotel
  }catch(error){
    console.log(error)
  }
}

app.post("/hotels/:hotelId", async (req,res)=>{
  try{
    const updatedHotel = await updateHotel(req.params.hotelId, req.body)
    if(updatedHotel){
      res.status(200).json({message: "Hotel updated successfully.", updatedHotel: updatedHotel})
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to update hotel."})
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
