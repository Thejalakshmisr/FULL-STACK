import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, type }) => {
  if (!message) return null
  return <div className={type}>{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Fetch all persons on load
  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added. Replace the old number?`
      )
      if (!confirmUpdate) return

      const changedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p =>
            p.id !== existingPerson.id ? p : returnedPerson
          ))
          setSuccessMessage(`Updated ${returnedPerson.name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${changedPerson.name} has already been removed from server`
          )
          setTimeout(() => setErrorMessage(null), 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })

      return
    }

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => setSuccessMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error || 'Error adding person')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === Number(id)) || persons.find(p => p.id === id)

    if (!person) {
      setErrorMessage('Person not found')
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setSuccessMessage(`Deleted ${person.name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          )
          setTimeout(() => setErrorMessage(null), 5000)
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Numbers</h2>
      {persons.map(person => (
        <div key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}

export default App
