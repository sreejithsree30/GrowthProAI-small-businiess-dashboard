const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

let businesses = [
  {
    id: 1,
    name: "Cake & Co",
    location: "Mumbai",
    rating: 4.3,
    reviews: 127,
    headline: "Why Cake & Co is Mumbai's Sweetest Spot in 2025",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Pizza Palace",
    location: "Delhi",
    rating: 4.7,
    reviews: 89,
    headline: "Pizza Palace Delhi: Where Every Slice Tells a Story",
    createdAt: new Date().toISOString()
  }
];

// Sample SEO headlines for random generation
const seoHeadlines = [
  "Why {name} is {location}'s Best Kept Secret in 2025",
  "{name} in {location}: Your Ultimate Guide to Excellence",
  "Discover Why {name} is {location}'s Most Trusted Choice",
  "The Complete Guide to {name} in {location}",
  "{name} {location}: Setting New Standards in Customer Experience",
  "Why Locals Choose {name} Over Any Other in {location}",
  "{name} in {location}: Where Quality Meets Perfection",
  "The Story Behind {location}'s Most Popular {name}",
  "{name} {location}: Redefining Industry Standards",
  "Why {name} is {location}'s Hidden Gem You Need to Visit"
];

const generateBusinessData = (name, location) => {
  const rating = (Math.random() * 2 + 3).toFixed(1); 
  const reviews = Math.floor(Math.random() * 200) + 50; 
  const headlineTemplate = seoHeadlines[Math.floor(Math.random() * seoHeadlines.length)];
  const headline = headlineTemplate.replace(/{name}/g, name).replace(/{location}/g, location);
  
  return { rating: parseFloat(rating), reviews, headline };
};

app.get('/api/businesses', (req, res) => {
  res.json(businesses);
});

app.post('/api/business-data', (req, res) => {
  const { name, location } = req.body;
  
  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required' });
  }


  const existingBusiness = businesses.find(b => 
    b.name.toLowerCase() === name.toLowerCase() && 
    b.location.toLowerCase() === location.toLowerCase()
  );

  if (existingBusiness) {
    return res.json(existingBusiness);
  }


  const businessData = generateBusinessData(name, location);
  const newBusiness = {
    id: businesses.length + 1,
    name,
    location,
    ...businessData,
    createdAt: new Date().toISOString()
  };

  businesses.push(newBusiness);
  res.json(newBusiness);
});


app.get('/api/regenerate-headline', (req, res) => {
  const { name, location, id } = req.query;
  
  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required' });
  }

  const headlineTemplate = seoHeadlines[Math.floor(Math.random() * seoHeadlines.length)];
  const headline = headlineTemplate.replace(/{name}/g, name).replace(/{location}/g, location);

  if (id) {
    const businessIndex = businesses.findIndex(b => b.id === parseInt(id));
    if (businessIndex !== -1) {
      businesses[businessIndex].headline = headline;
    }
  }

  res.json({ headline });
});

app.put('/api/businesses/:id', (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  
  const businessIndex = businesses.findIndex(b => b.id === parseInt(id));
  
  if (businessIndex === -1) {
    return res.status(404).json({ error: 'Business not found' });
  }

  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required' });
  }


  const businessData = generateBusinessData(name, location);
  businesses[businessIndex] = {
    ...businesses[businessIndex],
    name,
    location,
    ...businessData,
    updatedAt: new Date().toISOString()
  };

  res.json(businesses[businessIndex]);
});


app.delete('/api/businesses/:id', (req, res) => {
  const { id } = req.params;
  
  const businessIndex = businesses.findIndex(b => b.id === parseInt(id));
  
  if (businessIndex === -1) {
    return res.status(404).json({ error: 'Business not found' });
  }

  const deletedBusiness = businesses.splice(businessIndex, 1)[0];
  res.json({ message: 'Business deleted successfully', business: deletedBusiness });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});