import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Particles
    const particles: {x: number, y: number, size: number, speed: number, alpha: number, color: string}[] = [];
    const particleCount = Math.floor((w * h) / 6000); 
    
    for(let i=0; i<particleCount; i++) {
        const isAccent = Math.random() > 0.8;
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() > 0.9 ? 3 : 1.5,
            speed: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.6 + 0.3,
            color: isAccent ? '#ff3131' : '#dc2626' // RED MIX
        });
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.01;
      
      // 1. Draw The "Market Grid"
      ctx.strokeStyle = 'rgba(255, 49, 49, 0.15)'; // Red Grid
      ctx.lineWidth = 1;
      const gridSize = 120;
      
      const offsetY = (time * 30) % gridSize;

      // Vertical lines
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = -gridSize; y <= h; y += gridSize) {
        const drawY = y + offsetY;
        ctx.beginPath();
        ctx.moveTo(0, drawY);
        ctx.lineTo(w, drawY);
        ctx.stroke();
      }

      // 2. Draw Particles
      particles.forEach(p => {
          p.y -= p.speed; 
          if (p.y < 0) {
              p.y = h;
              p.x = Math.random() * w;
          }
          
          const twinkle = Math.sin(time * 5 + p.x) * 0.4 + 0.6;
          
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * twinkle;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          
          // Data trails
          if (p.size > 2) {
             ctx.fillStyle = p.color;
             ctx.globalAlpha = 0.1;
             ctx.fillRect(p.x, p.y + p.size, p.size, 30); 
          }
          
          ctx.globalAlpha = 1;
      });

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-black">
      {/* 1. Base Gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 50% 0%, #2b0b0b 0%, #000000 80%)',
          opacity: 0.8
        }}
      />
      
      {/* 2. Canvas Elements */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen opacity-80" />
      
      {/* 3. Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(transparent 50%, black 100%)'
        }}
      />
    </div>
  );
};

export default Background;