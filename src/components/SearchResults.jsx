import Sidebar from './layout/Sidebar';

const SearchResults = ({ routes, searchParams }) => {
  return (
    <Sidebar
      routes={routes}
      searchParams={{
        from: searchParams.from,
        to: searchParams.to
      }}
    />
  );
};

export default SearchResults;