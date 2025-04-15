# -*- coding: utf-8 -*-

from typing import List

from strawberry import Schema, field, type

from app.schema.mutations.admins import AdminMutations
from app.schema.mutations.auth import AuthStudentMutations, RegisterMentor
from app.schema.mutations.autogenerate import autogenerate
from app.schema.mutations.mentors import (
    ChangeRequestStatusMutation,
    EditMentorMutation,
)
from app.schema.mutations.review import ReviewMutation, StarMutation
from app.schema.mutations.students import (
    CreateRequestMentorshipMutation,
    StudentEditMutation,
)
from app.schema.queries.admins import AdminQuery
from app.schema.queries.auth import AuthQuery
from app.schema.queries.mentors import (
    MentorQuery,
    MentorRequests,
    get_all_mentors,
)
from app.schema.queries.statistic import get_statistic
from app.schema.queries.students import StudentQuery, StudentRequests
from app.schema.types.mentors import MentorType
from app.schema.types.statistic import StatisticType


@type
class Query(
    StudentQuery,
    AuthQuery,
    MentorQuery,
    AdminQuery,
    MentorRequests,
    StudentRequests,
):
    get_all_mentors: List[MentorType] = field(resolver=get_all_mentors)
    get_statistic: StatisticType = field(resolver=get_statistic)


@type
class Mutation(
    AuthStudentMutations,
    RegisterMentor,
    StudentEditMutation,
    AdminMutations,
    CreateRequestMentorshipMutation,
    ChangeRequestStatusMutation,
    EditMentorMutation,
    ReviewMutation,
    StarMutation,
):
    autogenerate: str = field(resolver=autogenerate)

    @field
    async def test(self, uuid: str) -> str:
        from datetime import datetime

        from app.core.db import session
        from app.models.requests import Request, RequestStatusEnum

        async with session:
            x = Request(
                student_id="892448e3-aaa0-4d2e-b06d-76f7265dbdee",
                mentor_id=uuid,
                question="Help me pls",
                creation_date=datetime.now(),
                status=RequestStatusEnum.ACCEPTED,
            )
            session.add(x)
            await session.commit()
        return "ok"


schema: Schema = Schema(query=Query, mutation=Mutation)
