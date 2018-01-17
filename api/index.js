const request = require('request-promise-native');

const fetchData = async () => {
  try {
    const response = await request('http://www.ifanr.com/category/product');
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }
}

fetchData();