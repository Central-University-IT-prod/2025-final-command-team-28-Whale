import { useState, useCallback } from "react";

export const useRating = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [animatingStars, setAnimatingStars] = useState<boolean>(false);

  const handleRatingClick = useCallback(
    (newRating: number) => {
      setAnimatingStars(true);

      if (newRating === rating) {
        setTimeout(() => {
          setRating(0);
          setAnimatingStars(false);
        }, 300);
      } else {
        setTimeout(() => {
          setRating(newRating);
          setAnimatingStars(false);
        }, 300);
      }
    },
    [rating]
  );

  return {
    rating,
    hoverRating,
    animatingStars,
    handleRatingClick,
    setHoverRating
  };
};