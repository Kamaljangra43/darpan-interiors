require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/projectModel');
const { formatProjectWithImages } = require('./utils/imageUtils');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    const projects = await Project.find({}).limit(1);
    console.log('\n=== RAW PROJECT FROM DB ===');
    console.log(JSON.stringify(projects[0], null, 2));
    
    const formatted = formatProjectWithImages(projects[0]);
    console.log('\n=== FORMATTED PROJECT ===');
    console.log(JSON.stringify(formatted, null, 2));
    
    if (formatted.images && formatted.images.length > 0) {
      console.log('\n=== FIRST IMAGE URL ===');
      console.log(formatted.images[0].url || formatted.images[0]);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
