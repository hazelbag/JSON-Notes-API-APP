const express = require("express");
const fileHandler = require("fs");
const app = express();
const helmet = require("helmet");
const router = express.Router();

app.use(helmet());

// Middleware
app.use(express.json());

let items = JSON.parse(fileHandler.readFileSync(`WebProject.json`));

// When the user navigates to the localhost once running the below will display
app.get("/api", (req, res) => {
  fileHandler.readFile(`WebProject.json`, "utf8", (err, data) => {
    if (err) {
      res.send(`File not found. Please post to create the file.`);
    } else {
      const parsedData = JSON.parse(data);
      res.json({ items: parsedData });
    }
  });
  // res.json({ items })
});

// Post request to post new Items to the json array
app.post("/api/add", (req, res) => {
  let newId = items[items.length - 1].id + 1;
  // Create a new object
  let newItem = Object.assign({
    id: newId,
    title: req.body.title,
    description: req.body.description,
    url: req.body.url
  });
  // Push the object into the array
  items.push(newItem);
  // The write the array to the json file
  fileHandler.writeFile(`WebProject.json`, JSON.stringify(items), err => {
    if (err) throw err;
    res.json(items);
    console.log(items);
  });
  // If there is no error resolve and send
  // res.send(`The item has been added to the json array list`);
});

// Delete request to delete an item by ID
app.delete("/api/:id", (req, res) => {
  // Get the ID the user inputs
  const id = req.params.id;
  // Filter the list
  const updatedItems = items.filter(item => item.id != id);
  // Find the selected item by ID
  let item = items.find(el => el.id == id);
  console.log(item);
  // If the user enter an unknow ID tell the the ID does not exist
  if (item === undefined) {
    console.log({
      msg: `Item with the ID of ${id} is not found`
    });
    // If the ID matches, console log the updated list and tell them which ID item is about to be deleted
  } else {
    console.log(updatedItems + `is the updatedList`);
    // Do not include the item to be deleted
    items = updatedItems;
    console.log(`The item with the ID of ${id} is about to be deleted!!!`);
  }
  // Write the updated file to the json file
  fileHandler.writeFile(`WebProject.json`, JSON.stringify(items), err => {
    if (err) throw err;
  });
  res.send(`The chosen item is now gone!!!!`);
});

app.put("/api/:id", (req, res) => {
  // If the item being amended is not the title or description send the message
  console.log("id", req.params.id);

  if (!(req.body.title || !req.body.description)) {
    return res.send("Missing data...");
  }
  fileHandler.readFile(`WebProject.json`, "utf8", (err, data) => {
    if (err) throw err;
    // Here the item is converted from a string to an object
    const parsedData = JSON.parse(data);
    // Here the itemIndex is being found using the findIndex finding the id of the item in the url in Postman
    const itemIndex = parsedData.findIndex(
      item => item.id === Number(req.params.id)
    );
    // If the title is being amended change it else if the description is being changed amend the description
    // Only one of the two can be amended
    if (req.body.title) {
      parsedData[itemIndex].title = req.body.title;
    } else if (req.body.description) {
      parsedData[itemIndex].description = req.body.description;
    }
    // Write the data to the json file
    fileHandler.writeFile(
      `WebProject.json`,
      JSON.stringify(parsedData),
      err => {
        if (err) throw err;
        res.json(items);
      }
    );
  });
});

// If the user navigates to a url not found, display the error
app.get("*", (req, res, next) => {
  let err = new Error(
    `Sorry! Can’t find that resource. Please check your URL\n`
  );
  err.statusCode = 404;
  next(err);
});

// If the user navigates to a url not found, display the error
app.get("*", (req, res, next) => {
  let err = new Error(
    `Sorry! Can’t find that resource. Please check your URL\n`
  );
  err.statusCode = 404;
  next(err);
});

// Specify the desired port ot the port assigned
const PORT = process.env.PORT || 3001;
// Listen on port set by either the device or port 8080 on localhost
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

module.exports = app;
