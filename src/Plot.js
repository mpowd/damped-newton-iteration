import React, { useEffect, useState } from 'react'
import functionPlot from 'function-plot'
var math = require('mathjs')



export default function Plot() {

  const [expression, setExpression] = useState("x-1/6x^3+1/120x^5 + 1")
  const [interval, setInterval] = useState([])
  const [startPoint, setStartPoint] = useState(0)
  const [newExpression, setNewExpression] = useState(expression)
  const [xCurrent, setXCurrent] = useState("")
  const [i, setNewI] = useState(0)
  const [eps, setEps] = useState("")
  const [maxI, setMaxI] = useState(20)
  const [conditionIsFulfilled, setConditionIsFulfilled] = useState(false)
  const [tangent, setTangent] = useState("0")
  let tolerance = 3
  

  const expressionClick = () => {
    setNewExpression(expression)
  }
  const expressionChange = event => {
    setExpression(event.target.value)
  }
  const startPointChange = event => {
    setXCurrent(event.target.value)
    console.log("xcurrent: " + event.target.value)
    setNewI(0)
  }

  const epsChange = event => {
    setEps(event.target.value)
    console.log("eps: 10^(-" + event.target.value * 1 + ")")
  }

  const maxIChange = event => {
    setMaxI(event.target.value * 1)
  }

  const reset = () => {
    setXCurrent("")
    setEps("")
    setNewI(0)
    setInterval([])
    setTangent("0")
  }

  const newtonIteration = () => {
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log(i + ". iteration:")
    if(terminationConditionFulfilled()) {
      console.log()
      console.log("Termination condition has been met.")
      console.log("Total approximation error: " + Math.abs(evaluateExpression(expression, xCurrent*1)))
      console.log()
      return
    }
    console.log("x_" + i + " = " + xCurrent*1)
    setNewI(i + 1)
    let x = xCurrent*1
    let fx = evaluateExpression(expression, xCurrent*1)
    let f_x = evaluateExpression(math.derivative(expression, 'x').toString(), xCurrent*1)
    setTangent(f_x.toString() + "*x+" + (fx).toString() + "-" + (f_x).toString() + "*" + xCurrent.toString())
    console.log("f(x) = " + fx)
    console.log("f'(x) = " + f_x)
    let s_i = - (fx / f_x)
    console.log("s_i = " + s_i)
    let lambda = chooseLambda(s_i)
    console.log("damping factor: " + lambda)
    let x_next = xCurrent*1 + lambda * s_i
    setXCurrent(x_next.toString())
    console.log(f_x.toString() + "*x+" + (fx - f_x).toString() + "*x")
  }

  function terminationConditionFulfilled() {
    let fulfilled = (Math.abs(evaluateExpression(expression, xCurrent*1)) < (10**(-eps*1)) || i > maxI)
    if(fulfilled) {
      setConditionIsFulfilled(true)
      return true
    }
    return false
  }

  function chooseLambda(s_i) {
    let lambda = 1
    let i = 0
    while(true){
      if(Math.pow(evaluateExpression(expression, xCurrent*1 + lambda * s_i), 2) < Math.pow(evaluateExpression(expression, xCurrent*1), 2)) {
        return lambda
      } else {
        lambda = lambda / 2
      }
      if(i >= 1000){
        console.log("Else Fall Lambda: " + lambda)
        return lambda
      }
    }
  }

  function evaluateExpression(e, x) {
    return math.evaluate(e.replaceAll("x", "(" + x.toString() + ")"))
  }

  useEffect(() => {

    let contentsBounds = document.body.getBoundingClientRect();
    let width = 800;
    let height = 500;
    let ratio = contentsBounds.width / width;
    width *= ratio;
    height *= ratio;

    functionPlot({
      target: '#plot',
      data: [{
        fn: newExpression,
        derivative: {
          fn: math.derivative(expression, 'x').toString(),
          updateOnMouseMove: true
        },
        graphType: 'polyline'
      },{
        fn: tangent
      },{
        points: [
          [xCurrent*1, 0],
          [interval[0], 0],
          [interval[0], 0.1],
          [interval[0], -0.1],
          [interval[0], 0.2],
          [interval[0], -0.2],
          [interval[1], 0],
          [interval[1], 0.1],
          [interval[1], -0.1],
          [interval[1], 0.2],
          [interval[1], -0.2]
        ],
        fnType: 'points',
        graphType: 'scatter'
      }],
    })
  }, [newExpression, xCurrent, interval])

  const calcInterval = () => {
    calculateInterval(-100, 100)
  }


  function calculateInterval(a , b) {

    if(evaluateExpression(expression, a) == 0) {
      console.log("root found: " + a)
      setXCurrent(a)
      return a
    }
    if(evaluateExpression(expression, b) == 0) {
      console.log("root found: " + b)
      setXCurrent(b)
      return b
    }

    let bothSameSign = (evaluateExpression(expression, a) > 0 && evaluateExpression(expression, b) > 0)
                     ||(evaluateExpression(expression, a) < 0 && evaluateExpression(expression, b) < 0)

    if((b - a) < tolerance) {
      if(!bothSameSign) {
        console.log("interval found " + a + ", " + b)
        setXCurrent((a + b) / 2)
        setInterval([a, b])
        return
      }
      return
    }
    calculateInterval(a, (a+b)/2)
    calculateInterval((a+b)/2, b)
  }


  return (
    <>
    <div>
      <input onChange = {expressionChange}
          value = {expression} />
      <button onClick = {expressionClick}>update graph</button>
    </div>
    <div id="plot"></div>
    <div>
      <p>
        x: <input onChange = {startPointChange} value = {xCurrent} />
        <br></br>
        <br></br>
        <button onClick = {calcInterval}>Calculate Interval</button>
      </p>
    </div>
    <div>
      <br></br>
      <br></br>
      <button onClick = {newtonIteration}>Newton Iteration</button>
    </div>
    <div>
      <br></br>
      <button onClick = {reset}>Reset</button>
    </div>
    <p>
      <br></br>
      <br></br>
      <br></br>
      termination conditions:
      <br></br>
      <br></br>
      eps: <input onChange = {epsChange} value = {eps} />
      <br></br>
      <br></br>
      max iterations: <input onChange = {maxIChange} value = {maxI} />
    </p>
    </>
  )
}