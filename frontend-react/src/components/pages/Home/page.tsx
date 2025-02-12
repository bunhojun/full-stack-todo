import { fetcher } from '@/apis/fetcher.ts';
import { useQuery } from '@tanstack/react-query';

const getHello = async (): Promise<string | undefined> => {
  return fetcher('/');
};

export const Home = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['getHello'],
    queryFn: getHello,
  });

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Home</h1>
      <div>{data}</div>
    </div>
  );
};
