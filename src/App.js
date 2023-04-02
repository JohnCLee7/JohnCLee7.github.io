import './App.css';
import {useEffect, useState} from 'react';
import AppCard from './components/AppCard';

function App() {
  let [contacts, setContacts] = useState(null);
  let [expand, setExpand] = useState(0);
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(
        function(response) {
            return response.json();
        }
    ).then(
        function(data) {
            setContacts(data);
        }
    );
  }, [])
  function generateList(contacts) {
    if (contacts==null) {
      return <></>;
    } else {
      return contacts.map((data) => 
        <AppCard 
          key={data.id} 
          id={data.id}
          name={data.name} 
          username={data.username} 
          email={data.email} 
          address={data.address}
          phone={data.phone}
          website={data.website}
          company={data.company}
          expand={expand}
          onPress={() => {
            let target = 0;
            if (expand !== data.id) target = data.id;
            setExpand(target);
          }}
          />)
    }
  }
  return (
    <div className="Contacts-Web-App">
      <header className="Header">
        <h1>Contacts List</h1>
        <ul>
          {generateList(contacts)}
        </ul>
      </header>
    </div>
  );
}

export default App;
