const mongoose = require('mongoose');

const homeSchema = mongoose.Schema(
     {
          houseName: { 
               type: String, 
               required: true 
          },
          homeLocation: { 
               type: String, 
               required: true 
          },
          contactInfo: { 
               type: String, 
               required: true 
          },
          pricePerNight: { 
               type: Number, 
               required: true 
          },
          rating: { 
               type: Number, 
               required: true 
          },
          photos: [
               { 
                    type: String 
               }
          ],
          description: {
               type: String
          },
});


module.exports = mongoose.model('Home', homeSchema);
