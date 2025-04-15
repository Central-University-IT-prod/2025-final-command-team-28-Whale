from strawberry import type
from strawberry.scalars import JSON


@type
class StatisticType:
    registrations: JSON
    active_mentors: int
    total_accepted_requests: int
    inactive_mentors: int
    avg_rate: float
