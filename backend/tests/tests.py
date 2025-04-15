import pytest

from app.schema.schema import schema


@pytest.mark.asyncio
async def test_f():
    query = """
    query Q ($tags: [String!]!, $query: String!){
        getAllMentors(tags: $tags, query: $query) {
            id
        }
    }
    """
    result = await schema.execute(query=query, variable_values={"tags": []})
    assert result.errors is None
    assert len(result.data) != 0
