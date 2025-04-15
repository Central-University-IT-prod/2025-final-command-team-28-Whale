# -*- coding: utf-8 -*-

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from app.core.config import settings
from app.core.db import initdb
from app.schema.schema import schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initdb()
    yield


app: FastAPI = FastAPI(
    debug=settings.DEBUG,
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan,
)

gql: GraphQLRouter = GraphQLRouter(
    schema=schema,
    path=settings.API_PATH,
    graphql_ide=settings.gql_ide(),
    debug=settings.DEBUG,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    # allow_origins=settings.get_cors(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gql)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
