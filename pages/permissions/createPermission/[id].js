import { Button, TextField } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useReducer } from "react";

const CreatePermission=(props)=> {
  const router = useRouter();
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      code: "",
      description:"",
   
    }
  );

  const handleSubmit = evt => {
    evt.preventDefault();

    let formData = { formInput };
    const data = {
      code: formData.formInput.code,
      description:formData.formInput.description,
      userId:router.query.id,
    }
    
    fetch("http://localhost:3000/permissions", {
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
          router.push(`/permissions/${router.query.id}`, undefined, { shallow: true });}})
      .catch(error => alert(error));
  };

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };


  return (
    <div>
      <h1>
      Assign permission
      </h1>
      <div className='grid-add-container'>
      <form className='form' onSubmit={handleSubmit}>
          <TextField
            label="Code"
            id="margin-normal"
            name="code"
            defaultValue={formInput.code}
            className='textField'
            helperText="Enter Code"
            onChange={handleInput}
          />
          <TextField
            label="Description"
            id="margin-normal"
            name="description"
            defaultValue={formInput.description}
            className='textField'
            helperText="Enter description"
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

export default CreatePermission;
