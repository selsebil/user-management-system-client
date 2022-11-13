import { Button, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";

const EditUser=(props)=> {
  const router = useRouter();
  const id = router.query.id
  const [data,setData]=useState(null)
  const [isLoading, setLoading] = useState(false)
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      first_name: "",
      last_name:"",
      status:"",
      email: ""
    }
  );

  useEffect(() => {
    setLoading(true)
    if(id){
      fetch(`http://localhost:3000/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
       
        setLoading(false)
      })
     
    }
  }, [id])
  useEffect(()=>{
    if(data){
    setFormInput({ first_name: data.first_name,
      last_name: data.last_name,
      email:  data.email,
      status: data.status}
    );}
  },[data])

  const handleSubmit = evt => {
    evt.preventDefault();

    let formData = { formInput };
    const data = {
      first_name: formData.formInput.first_name,
      last_name:formData.formInput.last_name,
      email: formData.formInput.email,
      status: formData.formInput.status
    }
    
    fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
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

  const handleChange = (event) => {
   setFormInput({ 'status': event.target.value });
  };
  if (!formInput.first_name) return <p>Loading...</p>

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
      Edit user
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
         
         <InputLabel id="demo-simple-select-label">Status</InputLabel>
         <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={formInput.status}
    label="Age"
    onChange={handleChange}
  >
    <MenuItem value={'Active'}>Active</MenuItem>
    <MenuItem value={'Inactive'}>Inactive</MenuItem>
  </Select>
        
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
            Edit
          </Button>
        </form>
      </div>
     
    </div>
  );
}

export default EditUser;
