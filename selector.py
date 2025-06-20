import json
import os
import random

STATE_FILE = "selector_state.json"
EPSILON = 0.2

class Selector:
    def __init__(self, funnel, file=STATE_FILE, epsilon=EPSILON):
        self.funnel = funnel
        self.file = file
        self.epsilon = epsilon
        self.state = {}
        if os.path.exists(self.file):
            try:
                with open(self.file, 'r', encoding='utf-8') as f:
                    self.state = json.load(f)
            except json.JSONDecodeError:
                self.state = {}

    def save(self):
        with open(self.file, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, indent=2)

    def _ensure(self, phase):
        phase = str(phase)
        lines = self.funnel.get(phase, [])
        if phase not in self.state:
            self.state[phase] = {
                'scores': [0.0 for _ in lines],
                'counts': [0 for _ in lines]
            }
            return
        # expand if lines changed
        diff = len(lines) - len(self.state[phase]['scores'])
        if diff > 0:
            self.state[phase]['scores'].extend([0.0]*diff)
            self.state[phase]['counts'].extend([0]*diff)

    def choose(self, phase):
        phase = str(phase)
        lines = self.funnel.get(phase, [])
        if not lines:
            return None, ""
        self._ensure(phase)
        scores = self.state[phase]['scores']
        counts = self.state[phase]['counts']
        if random.random() < self.epsilon or not all(counts):
            idx = random.randrange(len(lines))
        else:
            idx = max(range(len(lines)), key=lambda i: scores[i])
        self.last = (phase, idx)
        return idx, lines[idx]

    def update(self, phase, idx, reward):
        if idx is None:
            return
        phase = str(phase)
        self._ensure(phase)
        scores = self.state[phase]['scores']
        counts = self.state[phase]['counts']
        c = counts[idx]
        scores[idx] = (scores[idx]*c + reward) / (c+1)
        counts[idx] = c + 1
        self.save()

    def average_score(self):
        totals = []
        for st in self.state.values():
            totals.extend(st['scores'])
        return sum(totals)/len(totals) if totals else 0.0

    def reset(self):
        self.state = {}
        self.save()

