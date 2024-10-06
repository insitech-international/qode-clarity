# Gas Station Management for Efficient Refueling

## Metadata

- **ID**: 7121
- **Title**: Gas Station Management for Efficient Refueling
- **Difficulty**: Medium
- **Category**: Greedy Algorithms
- **Subcategory**: Activity Selection
- **Similar Questions**: LeetCode(134. Gas Station), HackerRank(Fuel Station)
- **Real Life Domains**: Transportation, Logistics, Operations Management, Energy Management

# Introduction

The "Gas Station Management for Efficient Refueling" problem presents three versions that showcase different aspects of resource management and optimization. Each version requires a unique approach while still adhering to greedy algorithmic principles.

# Classification Reason

These problems are classified under "Greedy Algorithms" and specifically "Activity Selection" for several reasons:

1. Optimal Substructure: Each problem can be solved by making locally optimal choices at each step.
2. Greedy Choice Property: At each decision point, we can make a greedy choice based on the current state.
3. Linear Traversal: The solutions involve a single pass through the input, characteristic of many greedy algorithms.
4. Efficiency: The greedy approaches lead to O(n) time complexity solutions, which are optimal for these problems.
5. Resource Management: All versions deal with managing limited resources (fuel, time) efficiently.

# Pythonic Implementation

Here are the implementations for all three versions of the problem:

```python
from typing import List, Dict
from dataclasses import dataclass
from queue import PriorityQueue
import heapq

  "Version 1: LeetCode - Circular Route Gas Stations"

class CircularRouteGasStation:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        n = len(gas)
        total_surplus = 0
        current_surplus = 0
        start_station = 0

        for i in range(n):
            total_surplus += gas[i] - cost[i]
            current_surplus += gas[i] - cost[i]

            if current_surplus < 0:
                start_station = i + 1
                current_surplus = 0

        return start_station if total_surplus >= 0 else -1

"Version 2: HackerRank - Race Fuel Management"
class RaceFuelManagement:
    def milestonescrossed(self, N: int, X: int, P: List[int]) -> int:
        fuel_remaining = X
        milestones_crossed = 0

        for fuel_consumption in P:
            if fuel_remaining >= fuel_consumption:
                fuel_remaining -= fuel_consumption
                milestones_crossed += 1
            else:
                break

        return milestones_crossed

"Version 3: Advanced Gas Station Management"
@dataclass
class Vehicle:
    id: str
    type: str
    arrival_time: int
    fuel_needed: int
    max_wait: int

@dataclass
class Pump:
    id: int
    efficiency: float

@dataclass
class RefuelingSchedule:
    vehicle: Vehicle
    pump: Pump
    start_time: int
    end_time: int

class AdvancedGasStationManager:
    def __init__(self, pumps: List[Pump]):
        self.pumps = pumps
        self.schedule = []
        self.current_time = 0
        self.available_pumps = [(0, pump) for pump in pumps]
        heapq.heapify(self.available_pumps)

    def optimize_refueling(self, vehicles: List[Vehicle]) -> List[RefuelingSchedule]:
        vehicle_queue = PriorityQueue()
        for vehicle in vehicles:
            vehicle_queue.put((vehicle.arrival_time, vehicle))

        while not vehicle_queue.empty():
            arrival_time, vehicle = vehicle_queue.get()
            self.current_time = max(self.current_time, arrival_time)

            while self.available_pumps and self.available_pumps[0][0] <= self.current_time:
                _, pump = heapq.heappop(self.available_pumps)
                heapq.heappush(self.available_pumps, (self.current_time, pump))

            if not self.available_pumps:
                continue

            pump_available_time, pump = heapq.heappop(self.available_pumps)
            start_time = max(self.current_time, pump_available_time)
            refueling_duration = self.calculate_refueling_time(vehicle, pump)
            end_time = start_time + refueling_duration

            if end_time - vehicle.arrival_time <= vehicle.max_wait:
                self.schedule.append(RefuelingSchedule(vehicle, pump, start_time, end_time))
                heapq.heappush(self.available_pumps, (end_time, pump))
            else:
                heapq.heappush(self.available_pumps, (pump_available_time, pump))

        return self.schedule

    def calculate_refueling_time(self, vehicle: Vehicle, pump: Pump) -> int:
        base_time = vehicle.fuel_needed
        if vehicle.type == "truck":
            base_time *= 1.5
        elif vehicle.type == "motorcycle":
            base_time *= 0.5
        return int(base_time / pump.efficiency)

"Example usage"
if __name__ == "__main__":
    'Version 1'
    v1 = CircularRouteGasStation()
    gas = [1, 2, 3, 4, 5]
    cost = [3, 4, 5, 1, 2]
    print(f"Version 1 result: {v1.canCompleteCircuit(gas, cost)}")

    'Version 2'
    v2 = RaceFuelManagement()
    N, X = 5, 10
    P = [2, 3, 1, 4, 5]
    print(f"Version 2 result: {v2.milestonescrossed(N, X, P)}")

    'Version 3'
    pumps = [
        Pump(1, 1.2),
        Pump(2, 1.0),
        Pump(3, 0.8)
    ]
    vehicles = [
        Vehicle("Car1", "car", 10, 30, 15),
        Vehicle("Truck1", "truck", 12, 100, 30),
        Vehicle("Car2", "car", 13, 20, 10),
        Vehicle("Emergency1", "emergency", 14, 40, 5)
    ]
    v3 = AdvancedGasStationManager(pumps)
    schedule = v3.optimize_refueling(vehicles)
    print("Version 3 result:")
    for refueling in schedule:
        print(f"Vehicle {refueling.vehicle.id} at pump {refueling.pump.id}: "
              f"start {refueling.start_time}, end {refueling.end_time}")
```

# Mathematical Abstraction

Let's define the problem mathematically:

Given two sequences G = (g₁, g₂, ..., gₙ) and C = (c₁, c₂, ..., cₙ), where gᵢ represents the gas available at station i and cᵢ represents the cost to travel from station i to i+1 (circular), we want to find the starting station s such that:

∀k ∈ [0, n-1], ∑ᵏⱼ₌₀ (g₍ₛ₊ⱼ₎ₘₒₙₙ - c₍ₛ₊ⱼ₎ₘₒₙₙ) ≥ 0

where (s+j) mod n represents the circular nature of the route.

The greedy approach simplifies this by observing that:

1. If ∑ⁿ₍ᵢ₌₁₎ (gᵢ - cᵢ) < 0, no solution exists.
2. Otherwise, there exists a unique solution, which can be found by a single pass through the array.

# Real World Analogies

1. Road Trip Planning:
   Imagine planning a road trip around a circular route. Each town has a gas station with a certain amount of fuel, and the distance to the next town requires a specific amount of fuel.

   - Implementation:
     1. Start from any town.
     2. Keep track of your fuel as you move from town to town.
     3. If you run out of fuel, start over from the next town.
     4. The first town from which you can complete the circuit is your starting point.

2. Relay Race Strategy:
   Consider a circular relay race where each runner can cover a certain distance (gas) but needs to hand over the baton at specific points (cost).

   - Implementation:
     1. Start with any runner.
     2. Calculate if each runner can reach the next handover point.
     3. If a runner can't make it, start the race with the next runner.
     4. The first runner who can complete the full circuit is your starting runner.

3. Circular Supply Chain:
   Visualize a circular supply chain where each node produces resources (gas) and requires resources to send products to the next node (cost).

   - Implementation:
     1. Begin at any node in the chain.
     2. Track the resource balance as you move through the chain.
     3. If resources become negative, restart from the next node.
     4. The first node that allows a complete circuit is your starting point.

These real-world scenarios demonstrate how the greedy algorithm can be applied to solve practical problems involving circular routes and resource management in various domains.

# System Comparisons

Greedy Approach (our solution):
Let's explain our greedy approach using an analogy of a circular buffet:

Imagine you're at a circular buffet where each station has a certain amount of food (gas) and requires a certain amount of energy to walk to the next station (cost). You want to find a starting point from which you can complete a full circuit without running out of energy.

Here's how you might do it:

1. Start at any station (initialize start_station = 0).
2. Begin walking around the buffet:
   - At each station, add the food to your energy (gas[i]).
   - Subtract the energy needed to reach the next station (cost[i]).
3. If at any point your energy becomes negative:
   - You can't reach the next station from this starting point.
   - Reset your energy to 0 and make the next station your new starting point.
4. Continue this process until you've checked all stations.
5. After one complete circuit:
   - If your total energy (sum of all gas minus all costs) is non-negative, the last starting point you chose will allow you to complete the circuit.
   - If it's negative, no starting point will work.

This buffet analogy demonstrates how the greedy approach makes locally optimal decisions (moving to the next station when possible) to find the globally optimal solution (the correct starting point).

# Visual Representation

Here's a textual representation of how the algorithm would process the input [gas = [1,2,3,4,5], cost = [3,4,5,1,2]]:

```
Station | Gas | Cost | Surplus | Total | Current | Start
   0    |  1  |  3   |   -2    |  -2   |   -2    |  0
   1    |  2  |  4   |   -2    |  -4   |   -4    |  0
   2    |  3  |  5   |   -2    |  -6   |   -6    |  0
   3    |  4  |  1   |    3    |  -3   |    3    |  3
   4    |  5  |  2   |    3    |   0   |    6    |  3
```

This visual representation helps understand how the algorithm processes each station, updates the surplus, and determines the starting point (station 3 in this case).

The key observations:

1. The total surplus is 0, so a valid circuit exists.
2. The algorithm identifies station 3 as the starting point because it's the first station from which the current surplus remains non-negative for a full circuit.

This greedy approach efficiently solves the problem in a single pass through the data, demonstrating its effectiveness for this type of circular route optimization problem.
