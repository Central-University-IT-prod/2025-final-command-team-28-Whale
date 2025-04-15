# -*- coding: utf-8 -*-

from typing import List
from uuid import UUID

from strawberry import field, type

from app.schema.types.requests import RequestTypeStudent
from app.schema.types.students import StudentType
from app.services.request_service import RequestMentorShipForUserService
from app.services.student_service import StudentService


@type
class StudentQuery:
    @field(name="getStudentById")
    async def get_student_by_id_query(self, id: UUID) -> StudentType:
        student = await StudentService().get_student_by_id(id=id)
        return await StudentType.from_pydantic(model=student)


@type
class StudentRequests:
    @field
    async def get_requests_by_student(
        self, student_id: UUID
    ) -> List[RequestTypeStudent]:
        requests = await RequestMentorShipForUserService().get_all_requests_by_student_id(
            student_id=student_id
        )
        return [
            await RequestTypeStudent.from_pydantic(model=request)
            for request in requests
        ]
