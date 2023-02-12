import React, { useEffect, useState } from 'react'
import functionPlot from 'function-plot'
var math = require('mathjs')

export default function Plot() {

  const [expression, setExpression] = useState("x^2 - 2")
  const [interval, setInterval] = useState([])
  const [startPoint, setStartPoint] = useState(0)
  const [newExpression, setNewExpression] = useState(expression)
  const [newInterval, setNewInterval] = useState(interval)
  const [xCurrent, setNewXCurrent] = useState((-2.5))
  const [lambda, setNewLambda] = useState(1)
  const [i, setNewI] = useState(0)

  const expressionClick = () => {
    setNewExpression(expression)
  }
  const expressionChange = event => {
    setExpression(event.target.value)
  }
  const intervalClick = () => {
    setNewInterval(interval)
    //setNewXCurrent(interval[0])
  }
  const intervalChange = event => {
    setInterval(event.target.value.split(","))
  }
  const startPointClick = () => {
    setStartPoint(startPoint)
    setNewXCurrent(startPoint)
  }
  const startPointChange = event => {
    setStartPoint(event.target.value)
    setNewXCurrent(startPoint)
  }
  const newtonIteration = () => {
    console.log("x_" + i + " = " + xCurrent)
    setNewI(i + 1)
    console.log(expression)
    console.log(xCurrent)
    let x = xCurrent
    //let f = eval(expression)
    //let f_ = eval(math.derivative(expression, 'x').toString())
    let f = evaluateExpression(expression, xCurrent)
    let f_ = evaluateExpression(math.derivative(expression, 'x').toString(), xCurrent)
    console.log("f(x) = " + f)
    console.log("f'(x) = " + f_)
    let s_i = - (f / f_)
    console.log("s_i = " + s_i)
    //alert(evaluated_derivative)
    //let lambda = chooseLambda(s_i)
    let lambda = 1
    //let x_next = xCurrent - evaluated_expression / evaluated_derivative
    let x_next = xCurrent + s_i
    setNewXCurrent(x_next.toString() * 1)
    
  }


  function chooseLambda(s_i){
    let lambda = 1
    let i = 0
    while(true){
      if(Math.pow(evaluateExpression(expression, xCurrent + lambda * s_i), 2) < Math.pow(evaluateExpression(expression, xCurrent), 2)) {
        console.log("Choosen lambda = " + lambda)
        return lambda
      } else {
        lambda = lambda / 2
      }
      if(i >= 10){
        return lambda
      }
    }
  }

  function evaluateExpression(e, x) {
    return math.evaluate(e.replaceAll("x", "(" + x.toString() + ")"))
  }

  useEffect(() => {
    setNewXCurrent(xCurrent)
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
          /* [newInterval[0], 0],
          [newInterval[0], 0.1],
          [newInterval[0], -0.1],
          [newInterval[1], 0],
          [newInterval[1], 0.1],
          [newInterval[1], -0.1] */
          //[startPoint, 0]
        ],
        fnType: 'points',
        graphType: 'scatter'
      }],
    })
  }, [newExpression, xCurrent])

  function calculateInterval() {

  }

  return (
    <>
    <div>
      <input onChange = {expressionChange}
          value = {expression} />
      <button onClick = {expressionClick}>Aktualisere Graph</button>
    </div>
    <div id="plot"></div>
    {/* <div>
      <button onClick = {intervalClick}>Berechne Intervall</button>
      <input onChange = {intervalChange}
          value = {interval} />
    </div> */}
    <div>
      <input onChange = {startPointChange}
          value = {startPoint} />
      <button onClick = {startPointClick}>Setze Startpunkt</button>
    </div>
    <div>
      <button onClick = {newtonIteration}>Newton Iteration</button>
    </div>
    </>
  )
}