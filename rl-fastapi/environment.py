class Environment:
    def __init__(self):
        self.capacity = 100

    def step(self, state, action):
        instances = state["instances"]

        if action == "scale_up":
            instances += 1
        elif action == "scale_down" and instances > 1:
            instances -= 1

        cpu = min(100, state["request_rate"] / (instances * self.capacity) * 100)
        memory = cpu * 0.8
        response_time = cpu * 3

        next_state = {
            "cpu": cpu,
            "memory": memory,
            "instances": instances,
            "response_time": response_time,
            "request_rate": state["request_rate"]
        }

        reward = 10 if response_time < 200 else -10
        reward -= instances * 2

        return next_state, reward