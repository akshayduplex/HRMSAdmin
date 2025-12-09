import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const CircularProgressWithLabel = ({ percentage = 0, size = 50, thickness = 4 }) => {
    const [progress, setProgress] = useState(0);

    // Change color based on the percentage value
    const getColor = (percentage) => {
        if (percentage >= 80) return "green"; // High chance
        if (percentage >= 60) return "blue"; // Neutral to positive (calming color)
        if (percentage >= 40) return "#FCA92E"; // Yellow/Orange (warning)
        return "red"; // Low chance (below 40%)
    };

    // Animate the progress bar from 0 to the given percentage
    useEffect(() => {
        if (progress < percentage) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= percentage) {
                        clearInterval(interval);
                        return percentage;
                    }
                    return prev + 1; // Increment by 1 each time
                });
            }, 10); // Adjust this for faster/slower animation speed
        }
    }, [percentage, progress]);

    return (
        <Box
            sx={{
                position: 'absolute',
                right: 0,
                top: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                // background: 'transparent', // Set background to transparent
                textAlign: 'center',
            }}
        >
            <CircularProgress
                variant="determinate"
                value={progress}
                color="inherit" // We will customize the color manually
                size={size} // Dynamically set the size of the circular progress bar
                thickness={thickness} // Dynamically set the thickness of the circular progress bar
                sx={{
                    position: 'absolute',
                    zIndex: 1, // To ensure it renders behind the text
                    color: getColor(progress), // Change color based on progress
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    zIndex: 2, // Ensure the text is on top of the progress circle
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    color="text.secondary"
                    sx={{
                        fontSize: '13px',
                        fontWeight: '550',
                    }}
                >
                    {`${Math.round(progress)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

export default CircularProgressWithLabel;
