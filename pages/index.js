
import { Button } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useState } from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
export default function Users(props) {
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page) || 1);
  const [pageSize, setPageSize] = useState(10);
  const { data } = useQuery(
    ["users",pageSize, page],
    async () =>
      await fetch(
        `http://localhost:3000/users?pageSize=${pageSize}&page=${page}`
      ).then((result) => result.json()),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const [count, setCount] = useState(Math.ceil(data.count/10));
 const  handlePaginationChange=(e, value) =>{
    setPage(value);
    router.push(`?page=${value}`, undefined, { shallow: true });
  }
  const  createUser=(e, value) =>{
    router.push(`/createUser`, undefined, { shallow: true });
  }
 
   
  const handleDelete =(id)=>{
    var result =confirm("Are you sure?")
    if(result){
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
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
  return (
    <div>
      <h1>
      <Link  className='link' href='/'>
       User Management System
      </Link>
      <Button  className='button-add' variant="contained" color="success" onClick={createUser}>Add user</Button>
      </h1>
      {data?.data.length>0 && (<div>
      <Pagination
        count={count}
        variant='outlined'
        color='primary'
        className='pagination'
        page={page}
        onChange={handlePaginationChange}
      />
      <div className='grid-container'>
        {data?.data.map((item) => (
          <article key={item.id}>
            <div className='text-grid'>
              <p>Name: {item.first_name} {item.last_name}</p>
              <p>Username: {item.username}</p>
              <p>Email: {item.email}</p>
              <p>Status: {item.status}</p>
            </div>
            <div className='button-grid'>
            <Button className='button-edit' variant="contained" color="success" ><Link  className='link' href={{
              pathname: '/editUser/[id]',
              query: { id: item.id},
            }}>
            Edit
      </Link >
      </Button>
           
            <Button className='button-delete' onClick={()=>handleDelete(item.id)}>Delete</Button>
           
            <Link className='link' href={{
              pathname: '/permissions/[id]',
              query: { id: item.id},
            }}>
            Assign
      </Link>
           
            </div>
          </article>
        ))}
      </div>
      <Pagination
        count={count}
        variant='outlined'
        color='primary'
        className='pagination'
        page={page}
        onChange={handlePaginationChange}
      />
      </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  let page = 1;
  let pageSize = 10;
  if (context.query.page) {
    page = parseInt(context.query.page);
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ["users",pageSize,page],
    async () =>
      await fetch(
        `http://localhost:3000/users?pageSize=${pageSize}&page=${page}`
      ).then((result) => result.json())
  );
  return { props: { dehydratedState: dehydrate(queryClient) } };
}

