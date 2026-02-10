import React, { useState, useEffect } from 'react';
import personsService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Notification from './components/Notification';
import ErrorNotification from './components/ErrorNotification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService.getAll().then(response => {
      setPersons(response.data);
    });
  }, []);

  const handleAddPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id === existingPerson.id ? response.data : p));
            setNewName('');
            setNewNumber('');

            setSuccessMessage(`Updated ${response.data.name}`);
            setTimeout(() => setSuccessMessage(null), 3000);
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            );
            setTimeout(() => setErrorMessage(null), 3000);

            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personsService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');

        setSuccessMessage(`Added ${response.data.name}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  const personsToShow = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>
      <PersonForm
        handleAddPerson={handleAddPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
