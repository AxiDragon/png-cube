import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { TextureLoader, NearestFilter, Raycaster, Vector2 } from "three";
import * as THREE from "three";

interface BoxProps {
	textureUrl: string;
}
function RandomizedBox({ textureUrl }: BoxProps) {
	const texture = useLoader(TextureLoader, textureUrl);
	const meshRef = useRef<THREE.Mesh>(null);
	const { camera } = useThree();
	const raycaster = new Raycaster();
	const mouse = new Vector2();

	useEffect(() => {
		texture.minFilter = NearestFilter;
		texture.magFilter = NearestFilter;
	}, []);

	useEffect(() => {
		if (textureUrl) {
			const img = new Image();
			img.src = textureUrl;
			img.onload = () => {
				texture.image = img;
				texture.needsUpdate = true;
				texture.minFilter = NearestFilter;
				texture.magFilter = NearestFilter;
			};
		}
	}, [textureUrl, texture]);

	const onClick = (event: MouseEvent) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		if (meshRef.current) {
			const intersects = raycaster.intersectObject(meshRef.current!);

			if (intersects.length > 0) {
				const intersection = intersects[0];
				window.dispatchEvent(new CustomEvent("randomize", { detail: { uv: intersection.uv } }));
			}
		}
	};

	useEffect(() => {
		window.addEventListener("click", onClick);

		return () => {
			window.removeEventListener("click", onClick);
		};
	}, []);

	return (
		<mesh ref={meshRef} rotation={[0.2, 1, 0]}>
			<boxGeometry args={[3, 3, 3]} />
			<meshBasicMaterial map={texture} side={THREE.DoubleSide} />
		</mesh>
	);
}

export default RandomizedBox;
