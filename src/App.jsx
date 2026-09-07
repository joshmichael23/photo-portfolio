import { useState, useEffect } from 'react'
import {v2 as cloudinary} from 'cloudinary'
import './App.css'

function App() {
  const [images, setImages] = useState([]);

  cloudinary.config({
    cloud_name: "adtdg5qk",
    api_key: "596778814319916",
    api_secret: "KiKY0z1NxQko4JbDPBuS0zI9FnM",
  });

  const getAssets = async function GET() {
    const result = await cloudinary.search
      .expression("folder:portfolio")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

      return result;
  };

  useEffect(() => {
    getAssets().then((result) => {
      console.log(result);
      setImages(result.resources);
    });
  }, []);

  return (
    <>
      <div>
        {images? images.map((image) => (
          <img key={image.asset_id} src={image.secure_url} alt={image.public_id} />
        )) : <p>Loading...</p>}
      </div>
    </>
  )
}

export default App
