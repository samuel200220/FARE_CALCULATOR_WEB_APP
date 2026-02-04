"use client";

import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";

export default function LinearBufferButton() {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const progressRef = useRef<() => void>(() => {});

  useEffect(() => {
    progressRef.current = () => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setIsLoading(false);
          setBuffer(10);
          return 0;
        }

        if (prevProgress % 5 === 0) {
          setBuffer((prevBuffer) => {
            const newBuffer = prevBuffer + 1 + Math.random() * 10;
            return newBuffer > 100 ? 100 : newBuffer;
          });
        }

        return prevProgress + 1;
      });
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

  const handleClick = () => {
    setIsLoading(true);
    setProgress(0);
    setBuffer(10);
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Button onClick={handleClick} disabled={isLoading} variant="contained">
        {isLoading ? "Chargement..." : "Démarrer"}
      </Button>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
        </Box>
      )}
    </Box>
  );
}
