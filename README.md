# Damped Newton Method Visualizer

A React application for visualizing the Newton-Raphson method with damping, enabling interactive root-finding and parameter exploration.

## Features

- **Interactive Graph**
  Utilizes `function-plot` to dynamically render the function, its derivative, and tangent lines.

- **Newton Iteration**
  Provides step-by-step execution of the damped Newton method for precise root approximation.

- **Customizable Parameters**
  - Function expression input
  - Configurable starting point
  - Adjustable error tolerance (`eps`)
  - Controllable maximum iterations (`max iterations`)

- **Interval Calculation**
  Automatically determines an optimal interval for root approximation.

- **Reset Functionality**
  Easily clear inputs and reset the visualization state.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/mpowd/damped-newton-iteration.git
   ```

2. Navigate to project directory:
   ```sh
   cd damped-newton-iteration
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Start development server:
   ```sh
   npm start
   ```

## Usage

1. Enter a function (e.g., `x - 1/6*x^3 + 1/120*x^5 + 1`)
2. Click "Update Graph" to visualize the mathematical function
3. Set initial root guess
4. Use "Calculate Interval" to find valid range 
5. Execute "Newton Iteration" step-by-step
6. Adjust `eps` and max iterations as needed
7. Reset inputs anytime

## Dependencies

- React
- function-plot
- mathjs
