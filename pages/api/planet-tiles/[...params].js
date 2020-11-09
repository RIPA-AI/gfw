const axios = require('axios');

export default async function userHandler(req, res) {
  const {
    query: { params },
    method,
  } = req;
  if (method === 'GET') {
    const tile = await axios.get(
      `https://tiles.planet.com/basemaps/v1/planet-tiles/${params?.join(
        '/'
      )}.png?api_key=${process.env.NEXT_PUBLIC_PLANET_API_KEY}`,
      {
        responseType: 'arraybuffer',
      }
    );
    res.setHeader('content-type', 'image/png');
    res.send(tile?.data);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
