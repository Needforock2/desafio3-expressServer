import { Button, Flex} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

export default function Pagination({ pagination, handleNextPrevPage, handleRandomClick }) {
  const { pages, nextlink, nextpage, prevlink, prevpage, page } = pagination;
  const [selectedPage, setSelectedPage] = useState(page)
  console.log(nextlink)
  console.log(prevlink)
    useEffect(() => {
      setSelectedPage(page)
    }, [page])

    const pagesArray = Array(pages)
    .fill()
    .map((_, index) => index + 1);
  const maxVisibleButtons = 5;

  const startIndex = Math.max(1, selectedPage - Math.floor(maxVisibleButtons / 2));
  const endIndex = Math.min(startIndex + maxVisibleButtons, pagesArray.length);

  return (
    <Flex
      fontSize={30}
      justifyContent="center"
      alignItems="center"
      gap={10}
      m={10}
    >
      {page === 1 ? (
        <Button isDisabled={true}>Prev</Button>
      ) : (
        <Button onClick={() => handleNextPrevPage(prevlink)}>Prev</Button>
      )}
      <>
        <Button
          onClick={() => {
            handleRandomClick(1);
          }}
          padding={2}
          color={selectedPage === 1 ? "white" : "black"}
          backgroundColor={selectedPage === 1 ? "blue" : "blue.100"}
        >
          {" "}
          1
        </Button>
        <Flex fontSize={30} justifyContent="center" gap={10}>
          {pagesArray.slice(startIndex, endIndex).map((item) => (
            <Button
              onClick={() => {
                handleRandomClick(item);
              }}
              key={item}
              padding={2}
              color={selectedPage === item ? "white" : "black"}
              backgroundColor={selectedPage === item ? "blue" : "blue.100"}
            >
              {item}
            </Button>
          ))}
        </Flex>
      </>

      {page === pagesArray.length ? (
        <Button isDisabled={true}>Next</Button>
      ) : (
        <Button onClick={() => handleNextPrevPage(nextlink)}>Next</Button>
      )}
    </Flex>
  );
}