import asyncio

async def run_async(resume, crew):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, run, resume, crew)

def run(resume, crew):
    inputs = {"resume": resume}
    return crew.kickoff(inputs=inputs)
