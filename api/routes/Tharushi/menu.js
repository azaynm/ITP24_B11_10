import { Router } from "express";
import mongoose from "mongoose";
import Menu from "../../models/Tharushi/Menu.js";
import multer from "multer";
import cloudinary from "cloudinary";
import Inventory from "../../models/Charuka/Inventory.js";


const router = Router();

router.get('/menu', async (req, res) => {
  const menu = await Menu.find();
  res.json(menu);
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const menuItem = await Menu.findById(id);

  res.json(menuItem)
})

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });


cloudinary.config({
  cloud_name: "dg7kcjtlu",
  api_key: "189726296272932",
  api_secret: "dMrT32-k3AGZV_6ruShFRIhGdNM"
});



router.post("/upload", upload.single("image"), async(req, res) => {
  
  const result = await cloudinary.v2.uploader.upload(req.file.path);

  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
    const sellingPrice = req.body.sellingPrice;
    const inventoryItems = req.body.inventoryItems;
    const image = result.secure_url;
   

    const inventoryItemsArray = inventoryItems.split('\n');

    const newItemData = {
        name,
        description,
        category,
        sellingPrice,
        inventoryItems: Array.isArray(inventoryItems) ? inventoryItems : inventoryItems.split('\n'),
        image
       
    }
    
    const newItem = new Menu(newItemData);

    newItem.save()
        .then(()=> res.json('Menu Item Added'))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.get('/get-food', async (req, res) => {
  const id = req.body.id;
  const food = await Menu.findById(id);
  res.json(food);
})

router.put("/:itemId", upload.single("image"), async (req, res) => {
  const { itemId } = req.params;
  console.log(req.body)
  try {
      // Find the food item by its ID
      const food = await Menu.findById(itemId);

      // Check if there's a new image uploaded
      if (req.file && req.file.path) {
          // Upload the image to Cloudinary
          const result = await cloudinary.v2.uploader.upload(req.file.path);
          food.image = result.secure_url;
          console.log("Image url ", food.image)
      }

      // Update food details with the data from the request body
      food.name = req.body.name;
      food.description = req.body.description;
      food.category = req.body.category;
      food.sellingPrice = req.body.sellingPrice;
      const inventoryItems = req.body.inventoryItems;
      
      const inventoryItemsArray = inventoryItems.split('\n');
      food.inventoryItems = inventoryItemsArray;

      // Save the updated food item
      const updatedFood = await food.save();

      // Send a response indicating success
      res.status(200).json({ message: 'Food updated successfully', data: updatedFood });
  } catch (error) {
      // Handle any errors and send an error response
      console.error('Error updating food:', error);
      res.status(500).json({ error: 'An error occurred while updating food' });
  }
});


router.get('/view-item/:category', async (req, res) => {
  let category = req.params.category;
  // Capitalize the first character of the category
  category = category.charAt(0).toUpperCase() + category.slice(1);
  try {
    const categoryItems = await Menu.find({ category: category });
    res.json(categoryItems);
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const food = await Menu.findById(id);

  res.json(food)
})

router.get('/getImage/:id', async (req, res) => {
  const id = req.params.id;
  const food = await Menu.findById(id);
  res.json(food.image);

})

router.delete('/delete-item/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deletedMenu = await Menu.findByIdAndDelete(id);
      res.json(deletedMenu);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

router.post('/check-inventory-quantity', async (req, res) => {
  try {
      
      const { inventory } = req.body;

      const inventoryItems = await Inventory.find({ _id: { $in: inventory } });

      // Check if the quantity of each inventory item is greater than 0
      const allQuantitiesGreaterThanZero = inventoryItems.every(item => item.quantity > 0);


      res.json({ allQuantitiesGreaterThanZero });
  } catch (error) {
      console.error('Error checking inventory quantity:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;