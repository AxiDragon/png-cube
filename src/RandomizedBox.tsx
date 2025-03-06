import { useLoader, useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { TextureLoader, NearestFilter } from "three";

interface BoxProps {
	textureUrl: string;
}
function RandomizedBox({ textureUrl }: BoxProps) {
	const texture = useLoader(TextureLoader, textureUrl);

	useEffect(() => {
		texture.minFilter = NearestFilter;
		texture.magFilter = NearestFilter;
	}, []);

	useEffect(() => {
		console.log(textureUrl);
	}, [textureUrl]);

	useFrame(() => {
		if (textureUrl) {
			console.log("I am updating the texture");
			texture.needsUpdate = true;
		}
	});

	const onClick = () => {
		console.log('clicked on the box');
		// window.dispatchEvent(new Event("randomize"));
	};

	return (
		<mesh onClick={onClick}>
			<boxGeometry args={[3, 3, 3]} />
			<meshBasicMaterial map={texture} />
		</mesh>
	);
}

export default RandomizedBox;
