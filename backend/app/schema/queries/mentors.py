# -*- coding: utf-8 -*-

from typing import List
from uuid import UUID

from sklearn.metrics.pairwise import cosine_similarity
from strawberry import field, type

from app.core.db import model, session
from app.schema.types.mentors import MentorType
from app.schema.types.requests import RequestTypeStudent
from app.services.mentor_service import MentorService
from app.services.request_service import RequestMentorShipForUserService


async def get_all_mentors(
    tags: list[str] = list(), query: str = ""
) -> MentorType:
    mentor_alt = await MentorService().get_all_mentors()
    mentor_alt = [mentor for mentor in mentor_alt if mentor.approved == True]
    mentor_list = list()
    if tags:
        for mentor in mentor_alt:
            if mentor.tags is not None:
                mtags = mentor.tags
                mtags = [tag.lower() for tag in mtags]
                if all(tag.lower() in mtags for tag in tags):
                    mentor_list.append(mentor)
    else:
        mentor_list = mentor_alt.copy()
    if query:
        if len(mentor_list) == 0:
            return []

        strings = list()

        for mentor in mentor_list:
            s = mentor.expertise
            if mentor.description != None:
                s = s + ". " + mentor.description
            if mentor.tags:
                for tag in mentor.tags:
                    s += ". " + tag
            strings.append(s)

        embeddings = model.encode(strings)
        vec1 = model.encode([query])

        similarity = cosine_similarity(vec1, embeddings)

        sorted_mentors = list()
        for i in range(len(similarity[0])):
            sorted_mentors.append((similarity[0][i], mentor_list[i]))
        sorted_mentors.sort(key=lambda x: x[0], reverse=True)

        mentor_list = [mentor[1] for mentor in sorted_mentors]

    output = [
        await MentorType.from_pydantic(model=mentor)
        for mentor in mentor_list
    ]

    if not query:
        output.sort(key=lambda x: x.rating, reverse=True)

    return output


@type
class MentorQuery:
    @field
    async def get_mentor_by_id(self, id: UUID) -> MentorType:
        mentor = await MentorService().get_mentor_by_id(id=id)
        return await MentorType.from_pydantic(model=mentor)


@type
class MentorRequests:
    @field
    async def get_requests_by_mentor(
        self, mentor_id: UUID
    ) -> List[RequestTypeStudent]:
        requests = await RequestMentorShipForUserService().get_all_requests_by_mentor_id(
            mentor_id=mentor_id
        )
        return [
            await RequestTypeStudent.from_pydantic(model=request)
            for request in requests
        ]
