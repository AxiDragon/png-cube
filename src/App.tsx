import { useEffect, useState } from "react";
import generatePNG, { randomizePixel } from "./PNGGenerator";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RandomizedBox from "./RandomizedBox";

function App() {
  const [width, height] = [50, 50];
  const [randomizedPng, setRandomizedPng] = useState<string>(null!);
  const [initialized, setInitialized] = useState(false);
  const [hovering, setHovering] = useState(false);

  async function randomizeRandomArea(dataUrl: string) {
    const [randomHeight, randomWidth] = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
    const randomRadius = Math.floor(Math.random() * width);

    return randomizePixel(randomWidth, randomHeight, randomRadius, dataUrl);
  }

  useEffect(() => {
    const generateImages = async () => {
      const generatedPng = generatePNG(width, height);
      setRandomizedPng(generatedPng);
      setInitialized(true);
    };

    generateImages();
  }, []);

  useEffect(() => {
    const randomizeImage = async () => {
      if (initialized && !hovering) {
        // let newRandomizedPng = await randomizeRandomArea(randomizedPng);
        const generatedPng = generatePNG(width, height);
        setRandomizedPng(generatedPng);
      }
    };

    window.addEventListener("randomize", randomizeImage);

    return () => {
      window.removeEventListener("randomize", randomizeImage);
    };
  }, [initialized, hovering]);


  return (
    <>
      <Canvas id="App">
        <RandomizedBox textureUrl={randomizedPng || ""} />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </>
  );
}

export default App;
