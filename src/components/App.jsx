
import React, { Component } from 'react';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import FilterByName from './FilterByName/FilterByName';
import { nanoid } from 'nanoid';
import css from './App.module.css';

const _ = require('lodash');



export class App extends Component {

  state = {
    contacts: [],
    name: '',
    filter: '',
    number: ''    
  }

  componentDidUpdate() {
    localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
  }

  componentDidMount() {
    const contactList = JSON.parse(localStorage.getItem('contacts'));
    if (!contactList) {
      localStorage.setItem('contacts', JSON.stringify([]));
    } else {
      this.setState({ contacts: contactList });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }
  
  handleFilterChange = _.debounce((e) => {
    this.setState({filter: e.target.value})   
   }, 300)
    
  getFilteredContacts = () => {
    const { filter } = this.state;

    !JSON.parse(localStorage.getItem('contacts')) && localStorage.setItem('contacts', JSON.stringify([]))
    
    const contactList = JSON.parse(localStorage.getItem('contacts'))
    const filteredContacts = [...contactList];
    return filter ? (filteredContacts.filter(contact => contact.name.toLowerCase().includes(filter.toLocaleLowerCase()))) : contactList 
  }

  sendContactsToLocalStorage = (list) => {

    localStorage.setItem('contacts', JSON.stringify(list))
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    const { name, number, contacts} = this.state; 
    const form = e.currentTarget;    

    if(contacts.some(contact => contact.name === name)) {
      alert(name+' is already in contacts');
    }
    else {
        const contactsAfterAdd = [...contacts, {
        name: name,
        number: number,
        id: nanoid()
      }
    ]
      this.setState({contacts: contactsAfterAdd });
      this.sendContactsToLocalStorage(contactsAfterAdd)
    };
        
    form.reset()
  }
  
  deleteHandler = (id) => {
    const { contacts } = this.state
    
    const contactsAfterDelete = contacts.filter(contact => contact.id !== id)
    this.setState({ contacts: contactsAfterDelete })
    this.sendContactsToLocalStorage(contactsAfterDelete)
  }

  render() {  
    
    return (
      <div className = {css.container}>
        <h2>Phonebook</h2>
        <ContactForm 
          onFormSubmit={this.handleSubmit}
          onChange={this.handleChange}
        />
        <h2>Contacts</h2>
        <FilterByName 
          onFilterChange={this.handleFilterChange}
        />
        <ContactList 
          contacts={this.getFilteredContacts()}
          deleteContact={this.deleteHandler}  
        /> 
      </div>
    )
  }
}