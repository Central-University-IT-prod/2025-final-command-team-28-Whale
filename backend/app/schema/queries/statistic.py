from datetime import date, timedelta

from sqlmodel import select

from app.core.db import session
from app.models.mentors import Mentor
from app.models.requests import Request, RequestStatusEnum
from app.models.students import Student
from app.schema.types.statistic import StatisticType


async def get_statistic() -> StatisticType:
    registrations = list()
    async with session:
        for i in range(5):
            current_date = date.today() - timedelta(days=i)
            statement = (
                select(Student)
                .where(Student.creation_date == current_date)
                .order_by(Student.creation_date)
            )
            registrations_list = await session.exec(statement=statement)
            registrations.append(
                {
                    "regs": len(registrations_list.all()),
                    "date": current_date.strftime("%B %d, %Y %H:%M:%S"),
                }
            )

        statement = (
            select(Mentor)
            .join(Request, Mentor.id == Request.mentor_id)
            .where(Request.status == RequestStatusEnum.ACCEPTED)
            .distinct()
        )
        active_mentors = await session.exec(statement=statement)
        active_mentors = active_mentors.all()
        active_mentors = len(active_mentors)

        statement = select(Request).where(
            Request.status == RequestStatusEnum.ACCEPTED
        )
        total_accepted_requests = await session.exec(statement=statement)
        total_accepted_requests = total_accepted_requests.all()
        total_accepted_requests = len(total_accepted_requests)

        statement = select(Mentor)
        total_mentors = await session.exec(statement=statement)
        total_mentors = total_mentors.all()
        total_mentors = len(total_mentors)
        inactive_mentors = total_mentors - active_mentors

    return StatisticType(
        registrations=registrations,
        active_mentors=active_mentors,
        inactive_mentors=inactive_mentors,
        total_accepted_requests=total_accepted_requests,
        avg_rate=0,
    )
