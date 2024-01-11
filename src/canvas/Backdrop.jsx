import React, { useRef } from 'react'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'

const Backdrop = () => {
    const shadows = useRef();


    return (
        <AccumulativeShadows
            ref={shadows}
            temporal
            frames={60}
            alphaTest={0.85}
            scale={10}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.14]}>
            <RandomizedLight
                amount={2}
                radius={9}
                intensity={0.75}
                ambient={0.25}
                position={[5, 5, -10]}
            />
            <RandomizedLight
                amount={2}
                radius={5}
                intensity={0.85}
                ambient={0.55}
                position={[-5, 5, -9]}
            />
            <RandomizedLight
                amount={2}
                radius={9}
                intensity={0.75}
                ambient={0.25}
                position={[5, 5, -10]}
            />
        </AccumulativeShadows>
    )
}

export default Backdrop