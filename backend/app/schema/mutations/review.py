# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import Info, input, mutation, type

from app.errors.auth import SessionWasExpire
from app.schema.types.review import ReviewType, StarType
from app.services.mentor_service import MentorService
from app.services.review_service import ReviewService
from app.services.star_service import StarService
from app.services.student_service import StudentService


@input
class Reviewinput:
    mentor_id: UUID
    stars: int
    text: str


@input
class StarInput:
    student_id: UUID
    stars: int


@type
class ReviewMutation:
    @mutation
    async def create_review(self, info: Info, input: Reviewinput) -> ReviewType:
        try:
            student = await StudentService().get_student_by_session(
                request=info.context["request"]
            )
            review = await ReviewService().create_review(
                student_id=student.id,
                mentor_id=input.mentor_id,
                student=student,
                text=input.text,
                stars=input.stars,
            )
            return await ReviewType.from_pydantic(model=review)
        except SessionWasExpire:
            raise SessionWasExpire
        except Exception as e:
            raise Exception(e)


@type
class StarMutation:
    @mutation(name="createReviewOnUser")
    async def create_star(self, info: Info, input: StarInput) -> StarType:
        try:
            mentor = await MentorService().get_mentor_by_session(
                request=info.context["request"]
            )
            review = await StarService().create_review(
                student_id=input.student_id,
                mentor_id=mentor.id,
                mentor=mentor,
                stars=input.stars,
            )
            return await StarType.from_pydantic(model=review)
        except SessionWasExpire:
            raise SessionWasExpire
        except Exception as e:
            raise Exception(e)
