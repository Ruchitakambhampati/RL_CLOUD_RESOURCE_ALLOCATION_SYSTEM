from fastapi import FastAPI
from pydantic import BaseModel
from agent import QLearningAgent
from environment import Environment
import random

app = FastAPI()

agent = QLearningAgent()
env = Environment()

# 📌 Request Model
class State(BaseModel):
    cpu: float
    memory: float
    instances: int
    request_rate: float

# 📌 HEALTH
@app.get("/health")
def health():
    return {"status": "ok"}

# 📌 DECIDE
@app.post("/decide")
def decide(state: State):
    state_dict = state.dict()

    action = agent.choose_action(state_dict)
    next_state, reward = env.step(state_dict, action)

    agent.update(state_dict, action, reward, next_state)

    return {
        "action": action,
        "next_state": next_state,
        "reward": reward
    }

# 📌 TRAIN
@app.post("/train")
def train(data: dict):
    episodes = data.get("episodes", 10000)

    for _ in range(episodes):
        state = {
        "cpu": random.randint(10, 90),
        "memory": random.randint(10, 90),
        "instances": random.randint(1, 10),
        "request_rate": random.randint(20, 200)
        }

        action = agent.choose_action(state)
        next_state, reward = env.step(state, action)
        agent.update(state, action, reward, next_state)

    return {"status": "training complete"}

# 📌 RESET
@app.post("/reset")
def reset():
    agent.q_table = {}
    return {"status": "reset done"}