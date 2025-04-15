import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RatingStars } from "../Rating/Rating";

interface ReviewFormProps {
  onSubmit: (rating: number, review: string) => void;
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmit = () => {
    if (rating === 0 || !review.trim()) return;
    onSubmit(rating, review);
    setRating(0);
    setReview("");
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm mb-8 border">
      <h2 className="text-xl font-semibold mb-4">Оставить отзыв</h2>
      <div className="mb-4">
        <RatingStars initialRating={rating} onChange={setRating} />
      </div>
      <Textarea
        placeholder="Расскажите о вашем опыте работы с ментором..."
        className="mb-4 min-h-[120px]"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <Button
        className="w-full sm:w-auto text-white transition-all duration-300 ease-in-out hover:shadow-md"
        disabled={rating === 0 || !review.trim()}
        onClick={handleSubmit}
      >
        Опубликовать отзыв
      </Button>
    </div>
  );
};