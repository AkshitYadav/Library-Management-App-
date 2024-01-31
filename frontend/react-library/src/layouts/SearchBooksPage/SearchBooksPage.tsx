import { useEffect, useState } from "react";
import BookModel  from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {

  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoding, setIsLodaing] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    const fetchBooks = async () => {
      const baseurl: string = "http://localhost:8080/api/books";

      const url: string = `${baseurl}?page=${currentPage - 1}&size=${booksPerPage}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.books;

      setTotalAmountOfBooks(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const loadedBooks: BookModel[] = [];

      for (const key in responseData) {
        loadedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          author: responseData[key].author,
          description: responseData[key].description,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
      }
      window.scrollTo(0,0);
      setBooks(loadedBooks);
      setIsLodaing(false);
    };

    fetchBooks().catch((error: any) => {
      setIsLodaing(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (isLoding) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? 
                 booksPerPage * currentPage : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container">
        <div>
            <div className="row mt-5">
                <div className="col-6">
                    <div className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" 
                            aria-labelledby="Search" />
                            <button className="btn btn-outlined-success">
                                Search
                            </button>
                    </div>
                </div>
                <div className="col-4">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button"
                            id="dropdownMenuButton1" data-bs-toggle="dropdown"
                            aria-expanded="false">
                                Category
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <a className="dropdown-item" href="#">
                                    All
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Front End
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Back End
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Data
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Devop
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-3">
                    <h5>Number of results: ({totalAmountOfBooks})</h5>
                </div>
                <p>
                    {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                </p>
                {books.map(book => (
                    <SearchBook book={book} key={book.id} />
                ))}

                { totalPages > 1 && 
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                }

            </div>
        </div>
    </div>
  )
};
