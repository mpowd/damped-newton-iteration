import React, { useEffect, useState } from 'react'
import functionPlot from 'function-plot'
var math = require('mathjs')

export default function Plot() {

  const [expression, setExpression] = useState("x^2 - 2")
  const [interval, setInterval] = useState([])
  const [newExpression, setNewExpression] = useState(expression)
  const [newInterval, setNewInterval] = useState(interval)
  const [xCurrent, setNewXCurrent] = useState(1)

  const expressionClick = () => {
    setNewExpression(expression)
  }
  const expressionChange = event => {
    setExpression(event.target.value)
  }
  const intervalClick = () => {
    setNewInterval(interval)
    setNewXCurrent(interval[0])
  }
  const intervalChange = event => {
    setInterval(event.target.value.split(","))
  }
  const newtonClick = () => {
    let evaluated_expression = evaluateExpression(expression, xCurrent)
    let evaluated_derivative = evaluateExpression(math.derivative(expression, 'x').toString(), xCurrent)
    //alert(evaluated_derivative)
    let x_next = xCurrent - evaluated_expression / evaluated_derivative
    setNewXCurrent(x_next.toString() * 1)
  }

  useEffect(() => {
    functionPlot({
      target: '#plot',
      data: [{
        fn: newExpression,
        derivative: {
          fn: math.derivative(expression, 'x').toString(),
          updateOnMouseMove: true
        },
        graphType: 'polyline'
      }, {
        points: [
          [xCurrent, 0],
          [newInterval[0], 0],
          [newInterval[0], 0.1],
          [newInterval[0], -0.1],
          [newInterval[1], 0],
          [newInterval[1], 0.1],
          [newInterval[1], -0.1]
        ],
        fnType: 'points',
        graphType: 'scatter'
      }],
    })
  }, [newExpression, newInterval, xCurrent])

  function calculateInterval() {

  }

  function evaluateExpression(e, x) {
    return math.evaluate(e.replaceAll("x", x.toString()))
  }

  return (
    <>
    <div>
      <input onChange = {expressionChange}
          value = {expression} />
      <button onClick = {expressionClick}>Aktualisere Graph</button>
    </div>
    <div id="plot"></div>
    <div>
      <button onClick = {intervalClick}>Berechne Intervall</button>
      <input onChange = {intervalChange}
          value = {interval} />
    </div>
    <div>
      <button onClick = {newtonClick}>Newton Iteration</button>
    </div>
    </>
  )
}