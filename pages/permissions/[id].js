
import { Button } from "@material-ui/core";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';



export default function Permissions () {
  const router = useRouter()
  const id = router.query.id;
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true)
    if(id){
      fetch(`http://localhost:3000/permissions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
    }
  }, [id])
  const handleDelete =(itemId)=>{
    var result=confirm("Are you sure?")
    if(result){
      fetch(`http://localhost:3000/permissions/${itemId}`, {
        method: "DELETE",
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
            router.reload();}})
        .catch(error => alert(error));
   
    }
   
   
  }
  if (isLoading) return <p>Loading...</p>
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
      <div className='grid-permission'>
    <Link href='/'>
     Permissions for user
    </Link>
    <Button  className='button-assign'  style={{margin:10}}>
    <Link  href={{
              pathname: '/permissions/createPermission/[id]',
              query: { id: id },
            }}>
            Assign new permission
      </Link>
      </Button>
      </div>
    </h1>
    <div className='grid-container'>
      {data?.map((item) => (
        <article key={item.id}>
          <div className='text-grid'>
            <p>Code: {item.code}</p>
            <p>Description: {item.description}</p>
          </div>
          <div className='button-grid'>
          <Button className='button-delete' onClick={()=>handleDelete(item.id)}>Remove</Button>       
          </div>
        </article>
      ))}
    </div>
  </div>
   )
   }
