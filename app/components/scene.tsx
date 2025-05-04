'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/Addons.js";


export default function Scene(){

    const mountRef = useRef<HTMLDivElement|null>(null)

    useEffect(() => {
        const scene=new THREE.Scene()
        if (!mountRef.current) return;
        const camera = new THREE.PerspectiveCamera(90, mountRef.current.offsetWidth / mountRef.current.offsetHeight, 0.1, 1000);
        const renderer =new THREE.WebGLRenderer({antialias:true})

        camera.position.set(0,4,4);
        camera.lookAt(0,0,0)
        
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);

        const control =new OrbitControls(camera,renderer.domElement)
        control.enableDamping = true

        renderer.setSize(window.innerWidth, window.innerHeight)
        mountRef.current.appendChild(renderer.domElement)

        const gridhelper =new THREE.GridHelper(10,10)
        scene.add(gridhelper)

        const loader =new GLTFLoader()

        loader.load('/baseballhat.glb',(gltf)=>{
            const root =gltf.scene;
            root.position.y=1
            scene.add(root)
        })
        
        control.update()
        const animate =function(){
            requestAnimationFrame(animate)
            control.update()
            renderer.render(scene,camera)
        }

        animate()

        const handlesize=()=>{
            if (!mountRef.current) return;
            camera.aspect=mountRef.current.offsetWidth/mountRef.current.offsetHeight
            camera.updateProjectionMatrix()
            renderer.setSize(mountRef.current.offsetWidth,mountRef.current.offsetHeight)
        }
        window.addEventListener('resize',handlesize)

        return(()=>{
            if (!mountRef.current) return;
            window.removeEventListener('resize',handlesize)
            mountRef.current.removeChild(renderer.domElement)
            
        })
    }, [])
    
    return <div ref={mountRef} className="w-full h-screen"></div>

}