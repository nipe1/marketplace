const { v4: uuidv4 } = require('uuid');


let postings = [
    {
        postingId : "1",
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
      postingId: uuidv4(),
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
  getPosting: (postingId) => postings.filter(t => t.postingId == postingId),
  byCategory: (category) => postings.filter(t => t.category == category),
  byLocation: (location) => postings.filter(t => t.location == location),
  byDate: (date) => postings.filter(t => t.date == date),
  editPosting: (postingId, title, description, category, location, images, price, date, delivery) => {
    const result = postings.find(t =>t.postingId == postingId)

    if(result !== undefined)
    {
      result.title = title
      result.description = description
      result.category = category
      result.location = location
      result.images = images
      result.price = price
      result.date = date
      result.delivery = delivery
    }
  },
  removePosting: (postingId) => {
    const result = postings.findIndex(t => t.postingId == postingId)
    if(result !== -1) {
      postings.splice(result, 1)
    }
  }
}