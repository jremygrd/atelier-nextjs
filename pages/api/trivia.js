// Importing the 'axios' module for making HTTP requests
// Make sure you have installed it with : npm install axios
import axios from 'axios';

// The handler function for the API route
export default async function handler(req, res) {
  try {

    const types = req.query.types || 'text_choice'; // Get the types parameter from the request, default to 'text_choice' if not present

    const response = await axios.get(`https://the-trivia-api.com/v2/questions?types=${types}`);

    // If the GET request is successful, the status is 200 and we send back the data
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: "An error occurred" });
    }
  } catch (err) {
    // If an error occurred, we send back a 500 status with the error message
    res.status(500).json({ message: err.message });
  }
}
