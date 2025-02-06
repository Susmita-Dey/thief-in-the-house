"use client";
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { load as cocoSSDLoad } from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { renderPredictions } from '@/utils/renderPredictions';

let detectInterval;

const ObjectDetection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    async function runObjectDetection(net) {
        if (canvasRef.current && webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
            canvasRef.current.width = webcamRef.current.video.videoWidth;
            canvasRef.current.height = webcamRef.current.video.videoHeight;

            // find detected objects 
            // 0.6 means it will detect objects with probability of 60% or more
            const detectedObjects = await net.detect(webcamRef.current.video, undefined, 0.6)

            // console.log('Detected Objects:', detectedObjects);

            const context = canvasRef.current.getContext('2d');
            renderPredictions(detectedObjects, context);
        }
    }

    const runCoco = async () => {
        setIsLoading(true);
        const net = await cocoSSDLoad();
        setIsLoading(false);

        detectInterval = setInterval(() => {
            console.log('running object detection');
            runObjectDetection(net);
        }, 10);
    }

    const captureVideo = () => {
        if (webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
            const myVideoWidth = webcamRef.current.video.videoWidth;
            const myVideoHeight = webcamRef.current.video.videoHeight;

            webcamRef.current.video.width = myVideoWidth;
            webcamRef.current.video.height = myVideoHeight;
        }
    }

    useEffect(() => {
        runCoco();
        captureVideo();
    })

    return (
        <div className='mt-8'>
            {isLoading ? (
                <p className='gradient-text'>Loading AI Model...</p>
            ) : (
                <div className='relative flex justify-center items-center gradient p-1.5 rounded-md'>
                    {/* webcam */}
                    <Webcam ref={webcamRef} className='rounded-md w-full lg:h-[720px]' muted />

                    {/* canvas */}
                    <canvas ref={canvasRef} className='absolute top-0 left-0 z-99999 w-full lg:h-[720px]' />
                </div>
            )
            }
        </div>
    )
}

export default ObjectDetection