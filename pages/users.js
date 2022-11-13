import Pagination from "@material-ui/lab/Pagination";
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
  function handlePaginationChange(e, value) {
    setPage(value);
    router.push(`users/?page=${value}`, undefined, { shallow: true });
  }
  return (
    <div>
      <h1>
       User Management System
      </h1>
      <Pagination
        count={count}
        variant='outlined'
        color='primary'
        className='pagination'
        page={page}
        onChange={handlePaginationChange}
      />
      <div className='grid-container'>
        {data?.data.map((character) => (
          <article key={character.id}>
            <div className='text'>
              <p>Name: {character.first_name} {character.last_name}</p>
              <p>Username: {character.username}</p>
              <p>Email: {character.email}</p>
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
