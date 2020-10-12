const { v4: uuidv4 } = require('uuid');


let postings = [
    {
        postingId : uuidv4(),
        title : "Bicycle",
        description : "A mountain bike, no issues.",
        category : "bicycles",
        location : "Helsinki",
        images : "string",
        price : 275,
        date : "14.9.2020",
        delivery : "pickup",
        userId : "1"
    }
]

module.exports = {
  createPosting: (title, description, category, location, images, price, date, delivery, userId) => {
    postings.push({
      id: uuidv4(),
      title,
      description,
      category,
      location,
      images,
      price,
      date,
      delivery,
      userId
    });
  },
  getAllPostings: () => postings,
  getAllUserPostings: (userId) => postings.filter(t => t.userId == userId),
  getPosting: (postingId) => postings.find(t => t.id == postingId)
}