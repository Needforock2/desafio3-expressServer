import { useEffect, useState } from "react";

import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import { Box, Flex } from "@chakra-ui/react";
import Pagination from "../Pagination/Pagination";
import SearchBar from "../SearchBar/SearchBar";
import NoSearchResults from "../NoSearchResults/NoSearchResults";
axios.defaults.withCredentials = true;

export default function ProductContainer() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  useEffect(() => {
    async function fetchProducts() {
      try {
        const resp = await axios.get("http://localhost:8080/api/products");
        setProducts(resp.data.payload);
        setPagination({
          page: resp.data.page,
          pages: resp.data.totalPages,
          nextlink: resp.data.nextLink,
          nextpage: resp.data.nextpage,
          prevlink: resp.data.prevLink,
          prevpage: resp.data.prevPage,
        });

        return resp;
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
  }, []);

  const handleNextPrevPage = async (data) => {
    try {
      const resp = await axios.get(data);
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
    const url = `http://localhost:8080/api/products?limit=6&page=${data}`;
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
        const url = `http://localhost:8080/api/products?title=${value}`;
        try {
            const resp = await axios.get(url)
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
            console.log(error)
        }
    }

  return (
      <>
          <Box m='40px auto' maxW='40%'>
          <SearchBar handleSearch={(search)=>handleSearch(search)}/>
              
          </Box>
      {Object.keys(pagination).length > 0 ? (
        <Pagination
          pagination={pagination}
          handleNextPrevPage={(data) => handleNextPrevPage(data)}
          handleRandomClick={(data) => handleRandomClick(data)}
        />
          ) : null}
          {products.length > 0
              ?
              <Flex
                  maxW={1500}
                  flexWrap="wrap"
                  gap={4}
                  m="10px auto"
                  alignItems="center"
                  justifyContent="center"
              >
                  {products.map((product) => (
                      <ProductCard key={product.id} producto={product} />
                  ))}
              </Flex>
              :
              <NoSearchResults />}
      
      {Object.keys(pagination).length > 0 ? (
        <Pagination
          pagination={pagination}
          handleNextPrevPage={(data) => handleNextPrevPage(data)}
          handleRandomClick={(data) => handleRandomClick(data)}
        />
      ) : null}
    </>
  );
}
