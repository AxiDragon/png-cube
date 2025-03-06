import { useEffect, useState } from "react";
import generatePNG, { randomizePixel } from "./PNGGenerator";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import RandomizedBox from "./RandomizedBox";

function App() {
  const [width, height] = [50, 50];
  const [randomizedPng, setRandomizedPng] = useState<string>(null!);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const generateImages = async () => {
      const generatedPng = generatePNG(width, height);
      setRandomizedPng(generatedPng);
      setInitialized(true);
    };

    generateImages();
  }, []);

  useEffect(() => {
    const randomizeImage = async (e: Event) => {
      if (initialized) {
        const customEvent = e as CustomEvent;
        const { uv } = customEvent.detail;
        const generatedPng = await randomizePixel(Math.floor(width * uv.x), Math.floor(height * uv.y), 5, randomizedPng);
        setRandomizedPng(generatedPng);
      }
    };

    window.addEventListener("randomize", randomizeImage);

    return () => {
      window.removeEventListener("randomize", randomizeImage);
    };
  }, [initialized, randomizedPng]);


  return (
    <>
      <Canvas id="App">
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <RandomizedBox textureUrl={randomizedPng || ""} />
        <OrbitControls enablePan={false} />
      </Canvas>
      <p style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
        fontSize: "0.6em",
        fontWeight: "bold",
      }}>This was an experiment to mess around with creating images from nothing and manipulating them. Things are very much broken!</p>
    </>
  );
}

export default App;
