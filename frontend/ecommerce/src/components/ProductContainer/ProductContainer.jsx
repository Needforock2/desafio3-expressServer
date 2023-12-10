import { useEffect, useState } from "react";

import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Pagination from "../Pagination/Pagination";
import SearchBar from "../SearchBar/SearchBar";
import NoSearchResults from "../NoSearchResults/NoSearchResults";
axios.defaults.withCredentials = true;

export default function ProductContainer({ edit }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pagination, setPagination] = useState({});
  const [searchString, setSearchString] = useState("");
const [deleteP, setDeleteP] = useState(false)

  const handleDeleteP = () => {
     setDeleteP(!deleteP)

  }

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        let url = `${import.meta.env.VITE_BACKEND_URL}/products`;
        if (edit) {
          url = url + "?edit=true";
        }
        const resp = await axios.get(url);
        setProducts(resp.data.payload);
        setPagination({
          page: resp.data.page,
          pages: resp.data.totalPages,
          nextlink: resp.data.nextLink,
          nextpage: resp.data.nextpage,
          prevlink: resp.data.prevLink,
          prevpage: resp.data.prevPage,
        });
        setLoadingProducts(false);
        return resp;
      } catch (error) {
        console.log(error);
      }
    }

      fetchProducts();
    
  }, [deleteP]);

  const handleNextPrevPage = async (data) => {
    try {
      const query = data + `&title=${searchString}`;
      const resp = await axios.get(query);
      setProducts(resp.data.payload);
      setPagination({
        page: resp.data.page,
        pages: resp.data.totalPages,
        nextlink: resp.data.nextLink,
        nextpage: resp.data.nextPage,
        prevlink: resp.data.prevLink,
        prevpage: resp.data.prevPage,
      });

      return resp;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRandomClick = async (data) => {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/products?limit=6&page=${data}&title=${searchString}`;
    try {
      const resp = await axios.get(url);
      setProducts(resp.data.payload);
      setPagination({
        page: resp.data.page,
        pages: resp.data.totalPages,
        nextlink: resp.data.nextLink,
        nextpage: resp.data.nextPage,
        prevlink: resp.data.prevLink,
        prevpage: resp.data.prevPage,
      });
      return resp;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (value) => {
    setSearchString(value);

    const url = `${import.meta.env.VITE_BACKEND_URL}/products?title=${value}`;
    try {
      const resp = await axios.get(url, { withCredentials: true });
      setProducts(resp.data.payload);
      setPagination({
        page: resp.data.page,
        pages: resp.data.totalPages,
        nextlink: resp.data.nextLink,
        nextpage: resp.data.nextPage,
        prevlink: resp.data.prevLink,
        prevpage: resp.data.prevPage,
      });
      return resp;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!loadingProducts ? (
        <>
          <Box m="40px auto" maxW="40%">
            <SearchBar handleSearch={(search) => handleSearch(search)} />
          </Box>
          {Object.keys(pagination).length > 0 ? (
            <Pagination
              pagination={pagination}
              handleNextPrevPage={(data) => handleNextPrevPage(data)}
              handleRandomClick={(data) => handleRandomClick(data)}
            />
          ) : null}
          {products.length > 0 ? (
            <Flex
              maxW={1500}
              flexWrap="wrap"
              gap={4}
              m="10px auto"
              alignItems="center"
              justifyContent="center"
            >
              {products.map((product) => (
                <ProductCard key={product.id} producto={product} edit={edit} handleDeleteP={ handleDeleteP} />
              ))}
            </Flex>
          ) : (
            <NoSearchResults />
          )}

          {Object.keys(pagination).length > 0 ? (
            <Pagination
              pagination={pagination}
              handleNextPrevPage={(data) => handleNextPrevPage(data)}
              handleRandomClick={(data) => handleRandomClick(data)}
            />
          ) : null}
        </>
      ) : (
        <Flex
          minH="90vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="6"
        >
          <Spinner size="xl" />
          <Text>Actualizando....</Text>
        </Flex>
      )}
    </>
  );
}
