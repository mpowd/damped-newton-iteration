import React, { useEffect, useState } from 'react'
import functionPlot from 'function-plot'
var math = require('mathjs')

export default function Plot() {

  const [expression, setExpression] = useState("x^2 - 2")
  const [interval, setInterval] = useState([])
  const [startPoint, setStartPoint] = useState(0)
  const [newExpression, setNewExpression] = useState(expression)
  const [newInterval, setNewInterval] = useState(interval)
  const [xCurrent, setXCurrent] = useState("")
  const [i, setNewI] = useState(0)
  const [eps, setEps] = useState("")
  const [maxI, setMaxI] = useState(20)
  const [conditionIsFulfilled, setConditionIsFulfilled] = useState(false)
  let a = -100
  let b = 100
  let tolerance = 3
  

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
    //setStartPoint(startPoint)
    //setXCurrent(startPoint)
  }
  const startPointChange = event => {
    //setStartPoint(event.target.value)
    //setNewXCurrent(startPoint)
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

  }

  const newtonIteration = () => {
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log(i + ". Iteration:")
    if(terminationConditionFulfilled()) {
      console.log()
      console.log("Abbruchbedingung wurde erfüllt")
      console.log("Totaler Approximationsfehler: " + Math.abs(evaluateExpression(expression, xCurrent*1)))
      console.log()
      return
    }
    console.log("x_" + i + " = " + xCurrent*1)
    setNewI(i + 1)
    let x = xCurrent*1
    //let f = eval(expression)
    //let f_ = eval(math.derivative(expression, 'x').toString())
    let f = evaluateExpression(expression, xCurrent*1)
    let f_ = evaluateExpression(math.derivative(expression, 'x').toString(), xCurrent*1)
    console.log("f(x) = " + f)
    console.log("f'(x) = " + f_)
    let s_i = - (f / f_)
    console.log("s_i = " + s_i)
    //alert(evaluated_derivative)
    let lambda = chooseLambda(s_i)
    console.log("Dämpfungsfaktor: " + lambda)
    //let x_next = xCurrent - evaluated_expression / evaluated_derivative
    let x_next = xCurrent*1 + lambda * s_i
    setXCurrent(x_next.toString())
  }

  function terminationConditionFulfilled() {
    let fulfilled = (Math.abs(evaluateExpression(expression, xCurrent*1)) < (10**(-eps*1)) || i > maxI)
    if(fulfilled) {
      setConditionIsFulfilled(true)
      return true
    }
    return false
    /* if (evaluateExpression(expression, xCurrent) < eps) {
      setEpsConditionIsFulfilled(true)
    } */
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
      }, {
        points: [
          [xCurrent*1, 0],
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

  const calcInterval = () => {
    calculateInterval(-100, 100, false)
  }


  function calculateInterval(a , b, found) {

    if((b - a) < tolerance) {
      if(found) {
        console.log("Intervall gefunden: " + a + ", " + b)
        setXCurrent((a + b) / 2)
      }
      return
    }

    let bothSameSign = (evaluateExpression(expression, a) > 0 && evaluateExpression(expression, b) > 0)
                     ||(evaluateExpression(expression, a) < 0 && evaluateExpression(expression, b) < 0)

    if(!bothSameSign) {
      calculateInterval(a, (a+b)/2, true)
    }else {
      calculateInterval((a+b)/2, b, false)
    }
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
      <p>
        Abbruchbedingungen:
        <br></br>
        <br></br>
        eps: <input onChange = {epsChange} value = {eps} />
        <br></br>
        <br></br>
        max. Iterationsanzahl: <input onChange = {maxIChange} value = {maxI} />
        <br></br>
        <br></br>
        x: <input onChange = {startPointChange} value = {xCurrent} />
        <br></br>
        <br></br>
        <button onClick = {calcInterval}>Berechne Intervall</button>
      </p>
{/*       <button onClick = {startPointClick}>Setze Startstelle</button>
 */}    </div>
    <div>
      <br></br>
      <br></br>
      <button onClick = {newtonIteration}>Newton Iteration</button>
    </div>
    <div>
      <br></br>
      <button onClick = {reset}>eps und x zurücksetzen</button>
    </div>
    </>
  )
}