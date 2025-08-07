import axios from 'axios';

export const getRandomDogImage = async () => {
  const res = await axios.get('https://dog.ceo/api/breeds/image/random');
  return res.data.message;
};