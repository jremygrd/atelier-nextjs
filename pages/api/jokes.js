import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://icanhazdadjoke.com/', {
      headers: { 'Accept': 'application/json' }
    });

    const joke = response.data.joke;

    res.status(200).json({ joke });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch joke' });
  }
}
