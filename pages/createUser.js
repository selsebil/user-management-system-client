import { Button, TextField } from "@material-ui/core";
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useReducer } from "react";

const CreateUser=(props)=> {
  const router = useRouter();
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      first_name: "",
      last_name:"",
      username:"",
      password:"",
      email: ""
    }
  );

  const handleSubmit = evt => {
    evt.preventDefault();

    let formData = { formInput };
    const data = {
      first_name: formData.formInput.first_name,
      last_name:formData.formInput.last_name,
      username:formData.formInput.username,
      password:formData.formInput.password,
      email: formData.formInput.email
    }
    
    fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        if(response.error && response.error==='Bad Request'){
         alert(response.message)
        }else{
          router.push(`/`, undefined, { shallow: true });}})
      .catch(error => alert(error));
  };

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };


  return (
    <div>
      <div className='link'>
       <Link  href={{
              pathname: '/',
            }}>
           Home
      </Link>
      </div>
      <h1>
      Add  user
      </h1>
      <div className='grid-add-container'>
      <form className='form' onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            id="margin-normal"
            name="first_name"
            defaultValue={formInput.first_name}
            className='textField'
            helperText="Enter first name"
            onChange={handleInput}
          />
          <TextField
            label="Last Name"
            id="margin-normal"
            name="last_name"
            defaultValue={formInput.last_name}
            className='textField'
            helperText="Enter last name"
            onChange={handleInput}
          />
           <TextField
            label="Username"
            id="margin-normal"
            name="username"
            defaultValue={formInput.username}
            className='textField'
            helperText="Enter username"
            onChange={handleInput}
          />
           <TextField
           label="Password"
          id="outlined-password-input"
          type="password"
          name="password"
          autoComplete="current-password"
          defaultValue={formInput.password}
          className='textField'
          helperText="Enter password"
          onChange={handleInput}
        />
          <TextField
            label="Email"
            id="margin-normal"
            name="email"
            defaultValue={formInput.email}
            className='textField'
            helperText="e.g. name@gmail.com"
            onChange={handleInput}
          />
       
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </form>
      </div>
     
    </div>
  );
}

export default CreateUser;
