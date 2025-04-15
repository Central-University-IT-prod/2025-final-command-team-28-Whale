import { useState, useCallback } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  initialRating?: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

export const RatingStars = ({ 
  initialRating = 0, 
  onChange,
  readOnly = false
}: RatingStarsProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [animatingStars, setAnimatingStars] = useState<boolean>(false);

  const handleRatingClick = useCallback(
    (newRating: number) => {
      if (readOnly) return;
      
      setAnimatingStars(true);

      if (newRating === rating) {
        setTimeout(() => {
          setRating(0);
          onChange(0);
          setAnimatingStars(false);
        }, 300);
      } else {
        setTimeout(() => {
          setRating(newRating);
          onChange(newRating);
          setAnimatingStars(false);
        }, 300);
      }
    },
    [rating, onChange, readOnly]
  );

  const handleHover = (value: number) => {
    if (readOnly) return;
    setHoverRating(value);
  };

  const handleLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-3">
        {new Array(5).fill(0).map((_k, i) => (
          <Rating
            key={i}
            index={i}
            rating={rating}
            hoverRating={hoverRating}
            isAnimating={animatingStars}
            onRate={handleRatingClick}
            onHover={handleHover}
            onLeave={handleLeave}
            readOnly={readOnly}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-2 transition-all duration-300 min-w-[60px]">
        {hoverRating > 0
          ? `${hoverRating} из 5`
          : rating > 0
          ? `${rating} из 5`
          : "0 из 5"}
      </span>
    </div>
  );
};

interface RatingProps {
  index: number;
  rating: number;
  hoverRating: number;
  isAnimating: boolean;
  onRate: (rating: number) => void;
  onHover: (rating: number) => void;
  onLeave: () => void;
  readOnly?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  index,
  rating,
  hoverRating,
  isAnimating,
  onRate,
  onHover,
  onLeave,
  readOnly = false
}) => {
  const isActive =
    hoverRating > 0 ? index + 1 <= hoverRating : index + 1 <= rating;

  return (
    <div
      className={`relative inline-block ${readOnly ? "" : "cursor-pointer"}`}
      onMouseEnter={() => !readOnly && onHover(index + 1)}
      onMouseLeave={() => !readOnly && onLeave()}
      onClick={() => !readOnly && onRate(index + 1)}
    >
      <Star
        size={24}
        className={`
          transition-all duration-300 ease-out
          ${isAnimating && index + 1 <= rating ? "animate-pop" : ""}
          transform ${isActive ? "scale-110" : "scale-100"}
          ${isActive ? "text-amber-500" : "text-muted-foreground"}
        `}
        fill={isActive ? "currentColor" : "none"}
        strokeWidth={isActive ? 1.5 : 2}
      />
      {isActive && !readOnly && (
        <span
          className="absolute inset-0 animate-pulse-subtle rounded-full bg-amber-400/20"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      )}
    </div>
  );
};
