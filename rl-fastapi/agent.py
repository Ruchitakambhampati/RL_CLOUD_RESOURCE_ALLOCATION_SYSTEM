import json
import random
import os

class QLearningAgent:
    def __init__(self):
        self.alpha = 0.1
        self.gamma = 0.9
    
        self.epsilon = 0.3
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.05
        self.actions = ["scale_up", "scale_down", "no_change"]

        self.q_path = "qtable.json"

        if os.path.exists(self.q_path):
            with open(self.q_path, "r") as f:
                self.q_table = json.load(f)
        else:
            self.q_table = {}

    def get_key(self, state):
        cpu_bucket = int(state['cpu'] / 10)
        memory_bucket = int(state['memory'] / 10)

        inst_bucket = min(10, max(1, state["instances"] // 2))
        req_bucket = min(10, state["request_rate"] // 50)

        return f"{cpu_bucket}_{memory_bucket}_{inst_bucket}_{req_bucket}"


    def choose_action(self, state):
        key = self.get_key(state)

        if key not in self.q_table:
            self.q_table[key] = [0, 0, 0]

        if random.random() < self.epsilon:
            return random.choice(self.actions)

        return self.actions[self.q_table[key].index(max(self.q_table[key]))]

    def update(self, state, action, reward, next_state):
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)
        key = self.get_key(state)
        next_key = self.get_key(next_state)

        if next_key not in self.q_table:
            self.q_table[next_key] = [0, 0, 0]

        idx = self.actions.index(action)

        old = self.q_table[key][idx]
        new = old + self.alpha * (reward + self.gamma * max(self.q_table[next_key]) - old)

        self.q_table[key][idx] = new

        with open(self.q_path, "w") as f:
            json.dump(self.q_table, f)