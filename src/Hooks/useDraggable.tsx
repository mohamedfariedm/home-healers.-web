import { useState } from "react";

const useDraggable = (ref: React.RefObject<HTMLElement>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - ref.current!.offsetLeft);
    setScrollLeft(ref.current!.scrollLeft);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current!.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current!.scrollLeft = scrollLeft - walk;
  };

  return { onMouseDown, onMouseUp, onMouseMove };
};

export default useDraggable;
