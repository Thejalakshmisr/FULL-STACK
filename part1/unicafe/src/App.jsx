import { useState } from 'react'

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const veryGood = props.veryGood
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const total = veryGood + good + neutral + bad

  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = (veryGood + good - bad) / total
  const positive = ((veryGood + good) / total) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="very good" value={veryGood} />
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [veryGood, setVeryGood] = useState(0)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setVeryGood(veryGood + 1)} text="very good" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics veryGood={veryGood} good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
