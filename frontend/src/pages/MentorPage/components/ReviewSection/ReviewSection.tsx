import { gql, useMutation } from "@apollo/client";
import { MentorProfileType } from "../../types";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { useNavigate } from '@tanstack/react-router';

interface ReviewSectionProps {
  mentor: MentorProfileType;
}

const CREATE_REVIEW = gql`
  mutation CreateReview($mentorId: UUID!, $stars: Int!, $text: String!) {
    createReview(input: { mentorId: $mentorId, stars: $stars, text: $text }) {
      mentorId
      stars
      studentId
      text
    }
  }
`;

export const ReviewSection = ({ mentor }: ReviewSectionProps) => {
  const navigate = useNavigate();
  const handleSubmitReview = (rating: number, reviewText: string) => {
    console.log("Submitting review:", { rating, reviewText });
    createReview({
      variables: {
        mentorId: mentor.id,
        stars: rating,
        text: reviewText,
      },
    })
    .then(() => {
      navigate({
        to: ".",
      });
    })
  };

  const [createReview] = useMutation(CREATE_REVIEW);

  return (
    <>
      <ReviewForm onSubmit={handleSubmitReview} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          Отзывы ({mentor.reviews.length || []})
        </h2>

        {mentor.reviews.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Пока нет отзывов. Будьте первым, кто оставит отзыв!
          </p>
        ) : (
          mentor.reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))
        )}
      </div>
    </>
  );
};
